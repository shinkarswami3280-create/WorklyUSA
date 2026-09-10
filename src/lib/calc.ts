/**
 * Workly USA calculation engine.
 *
 * Every formula lives here so calculators never duplicate logic. All functions
 * are pure, deterministic and safe with empty, zero, decimal or negative input.
 */

export type Values = Record<string, string>;

/** Parse a user-entered value. Returns NaN for blank/garbage input. */
export function num(values: Values, key: string, fallback = NaN): number {
  const raw = (values[key] ?? "").toString().trim().replace(/[$,\s]/g, "");
  if (raw === "") return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** Parse with a default when blank, and clamp negatives to 0. */
export function nonNeg(values: Values, key: string, fallback = 0): number {
  const value = num(values, key, fallback);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(0, value);
}

export function str(values: Values, key: string, fallback = ""): string {
  const raw = values[key];
  return raw === undefined || raw === "" ? fallback : raw;
}

export class CalcError extends Error {}

/** Require a positive number, otherwise surface a friendly message. */
export function required(value: number, label: string, allowZero = false): number {
  if (!Number.isFinite(value)) throw new CalcError(`Enter ${label}.`);
  if (value < 0) throw new CalcError(`${label} can't be negative.`);
  if (!allowZero && value === 0) throw new CalcError(`${label} must be greater than zero.`);
  if (value > 1e12) throw new CalcError(`${label} is too large.`);
  return value;
}

/* ------------------------------------------------------------------ *
 * Pay frequency
 * ------------------------------------------------------------------ */

export const PAY_PERIODS_PER_YEAR = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
  quarterly: 4,
  annually: 1,
} as const;

export type PayFrequency = keyof typeof PAY_PERIODS_PER_YEAR;

export const PAY_FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Weekly (52 / year)" },
  { value: "biweekly", label: "Every 2 weeks (26 / year)" },
  { value: "semimonthly", label: "Twice a month (24 / year)" },
  { value: "monthly", label: "Monthly (12 / year)" },
  { value: "annually", label: "Annually (1 / year)" },
];

export function periodsPerYear(frequency: string): number {
  return PAY_PERIODS_PER_YEAR[frequency as PayFrequency] ?? 26;
}

/* ------------------------------------------------------------------ *
 * Salary <-> hourly
 * ------------------------------------------------------------------ */

export interface PayBreakdown {
  hourly: number;
  daily: number;
  weekly: number;
  biweekly: number;
  semimonthly: number;
  monthly: number;
  annual: number;
  annualHours: number;
}

export function payBreakdownFromAnnual(
  annual: number,
  hoursPerWeek: number,
  weeksPerYear = 52,
  daysPerWeek = 5,
): PayBreakdown {
  const annualHours = hoursPerWeek * weeksPerYear;
  const weekly = annual / (weeksPerYear || 52);
  return {
    hourly: annualHours > 0 ? annual / annualHours : NaN,
    daily: daysPerWeek > 0 ? weekly / daysPerWeek : NaN,
    weekly,
    biweekly: annual / 26,
    semimonthly: annual / 24,
    monthly: annual / 12,
    annual,
    annualHours,
  };
}

export function payBreakdownFromHourly(
  hourly: number,
  hoursPerWeek: number,
  weeksPerYear = 52,
  daysPerWeek = 5,
): PayBreakdown {
  const annual = hourly * hoursPerWeek * weeksPerYear;
  return payBreakdownFromAnnual(annual, hoursPerWeek, weeksPerYear, daysPerWeek);
}

/* ------------------------------------------------------------------ *
 * Overtime
 * ------------------------------------------------------------------ */

export interface OvertimeResult {
  regularHours: number;
  overtimeHours: number;
  doubleHours: number;
  regularPay: number;
  overtimePay: number;
  doublePay: number;
  total: number;
  blendedRate: number;
  totalHours: number;
}

export function overtimePay(options: {
  hourlyRate: number;
  regularHours: number;
  overtimeHours?: number;
  doubleHours?: number;
  overtimeMultiplier?: number;
  doubleMultiplier?: number;
}): OvertimeResult {
  const {
    hourlyRate,
    regularHours,
    overtimeHours = 0,
    doubleHours = 0,
    overtimeMultiplier = 1.5,
    doubleMultiplier = 2,
  } = options;

  const regularPay = hourlyRate * regularHours;
  const overtimeRate = hourlyRate * overtimeMultiplier;
  const doubleRate = hourlyRate * doubleMultiplier;
  const overtimeAmount = overtimeRate * overtimeHours;
  const doubleAmount = doubleRate * doubleHours;
  const total = regularPay + overtimeAmount + doubleAmount;
  const totalHours = regularHours + overtimeHours + doubleHours;

  return {
    regularHours,
    overtimeHours,
    doubleHours,
    regularPay,
    overtimePay: overtimeAmount,
    doublePay: doubleAmount,
    total,
    blendedRate: totalHours > 0 ? total / totalHours : NaN,
    totalHours,
  };
}

/** Split weekly hours into straight time and overtime at a threshold. */
export function splitWeeklyHours(totalHours: number, threshold = 40) {
  const regular = Math.min(totalHours, threshold);
  return { regular, overtime: Math.max(0, totalHours - threshold) };
}

/* ------------------------------------------------------------------ *
 * Time of day / shifts
 * ------------------------------------------------------------------ */

/** "22:30" or "10:30 PM" -> minutes since midnight. NaN if unparseable. */
export function parseTime(input: string | undefined): number {
  if (!input) return NaN;
  const text = input.trim().toLowerCase();
  const match = text.match(/^(\d{1,2})[:.]?(\d{2})?\s*(am|pm)?$/);
  if (!match) return NaN;
  let hoursPart = Number(match[1]);
  const minutesPart = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3];
  if (minutesPart > 59) return NaN;
  if (meridiem) {
    if (hoursPart < 1 || hoursPart > 12) return NaN;
    if (meridiem === "pm" && hoursPart !== 12) hoursPart += 12;
    if (meridiem === "am" && hoursPart === 12) hoursPart = 0;
  } else if (hoursPart > 23) return NaN;
  return hoursPart * 60 + minutesPart;
}

/**
 * Minutes worked between two clock times, correctly handling overnight
 * shifts (10:00 PM -> 6:00 AM = 480 minutes) and subtracting unpaid breaks.
 */
export function shiftMinutes(start: string, end: string, breakMinutes = 0): number {
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);
  if (!Number.isFinite(startMinutes) || !Number.isFinite(endMinutes)) return NaN;
  let span = endMinutes - startMinutes;
  if (span <= 0) span += 24 * 60; // crossed midnight
  return Math.max(0, span - Math.max(0, breakMinutes || 0));
}

/** Minutes of a shift that fall inside a night-differential window. */
export function nightMinutes(
  start: string,
  end: string,
  windowStart: string,
  windowEnd: string,
): number {
  const shiftStart = parseTime(start);
  const shiftEnd = parseTime(end);
  const nightStart = parseTime(windowStart);
  const nightEnd = parseTime(windowEnd);
  if ([shiftStart, shiftEnd, nightStart, nightEnd].some((v) => !Number.isFinite(v))) return NaN;

  const shiftFinish = shiftEnd > shiftStart ? shiftEnd : shiftEnd + 1440;
  let overlap = 0;
  // Check the night window on the previous, current and next day.
  for (const offset of [-1440, 0, 1440]) {
    const winStart = nightStart + offset;
    const winFinish = (nightEnd > nightStart ? nightEnd : nightEnd + 1440) + offset;
    overlap += Math.max(0, Math.min(shiftFinish, winFinish) - Math.max(shiftStart, winStart));
  }
  return overlap;
}

export const minutesToHours = (minutes: number) => (Number.isFinite(minutes) ? minutes / 60 : NaN);

/** Payroll rounding options for time cards. */
export function roundMinutes(minutes: number, increment: number): number {
  if (!increment || increment <= 1) return minutes;
  return Math.round(minutes / increment) * increment;
}

/* ------------------------------------------------------------------ *
 * Paycheck (simple estimate)
 * ------------------------------------------------------------------ */

export interface PaycheckEstimate {
  gross: number;
  preTax: number;
  taxableGross: number;
  taxes: number;
  postTax: number;
  net: number;
  effectiveTaxRate: number;
  annualGross: number;
  annualNet: number;
}

export function paycheckEstimate(options: {
  gross: number;
  frequency: string;
  taxRatePercent: number;
  preTaxDeductions?: number;
  postTaxDeductions?: number;
}): PaycheckEstimate {
  const preTax = Math.max(0, options.preTaxDeductions || 0);
  const postTax = Math.max(0, options.postTaxDeductions || 0);
  const gross = options.gross;
  const taxableGross = Math.max(0, gross - preTax);
  const taxes = taxableGross * (Math.max(0, options.taxRatePercent) / 100);
  const net = Math.max(0, taxableGross - taxes - postTax);
  const periods = periodsPerYear(options.frequency);
  return {
    gross,
    preTax,
    taxableGross,
    taxes,
    postTax,
    net,
    effectiveTaxRate: gross > 0 ? ((gross - net) / gross) * 100 : NaN,
    annualGross: gross * periods,
    annualNet: net * periods,
  };
}

/* ------------------------------------------------------------------ *
 * Effective hourly wage ("what am I really making")
 * ------------------------------------------------------------------ */

export interface EffectiveWage {
  annual: number;
  monthly: number;
  weekly: number;
  nominalHourly: number;
  effectiveHourly: number;
  annualWorkHours: number;
  annualCommuteHours: number;
  totalCommittedHours: number;
  netOfExpenses: number;
  effectiveAfterExpenses: number;
  hourlyGap: number;
}

export function effectiveWage(options: {
  annualSalary: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  commuteMinutesPerDay: number;
  workDaysPerWeek: number;
  annualExpenses?: number;
}): EffectiveWage {
  const {
    annualSalary,
    hoursPerWeek,
    weeksPerYear,
    commuteMinutesPerDay,
    workDaysPerWeek,
    annualExpenses = 0,
  } = options;

  const annualWorkHours = hoursPerWeek * weeksPerYear;
  const annualCommuteHours = (commuteMinutesPerDay / 60) * workDaysPerWeek * weeksPerYear;
  const totalCommittedHours = annualWorkHours + annualCommuteHours;
  const netOfExpenses = annualSalary - Math.max(0, annualExpenses);
  const nominalHourly = annualWorkHours > 0 ? annualSalary / annualWorkHours : NaN;
  const effectiveHourly = totalCommittedHours > 0 ? annualSalary / totalCommittedHours : NaN;

  return {
    annual: annualSalary,
    monthly: annualSalary / 12,
    weekly: annualSalary / (weeksPerYear || 52),
    nominalHourly,
    effectiveHourly,
    annualWorkHours,
    annualCommuteHours,
    totalCommittedHours,
    netOfExpenses,
    effectiveAfterExpenses:
      totalCommittedHours > 0 ? netOfExpenses / totalCommittedHours : NaN,
    hourlyGap: nominalHourly - effectiveHourly,
  };
}

/* ------------------------------------------------------------------ *
 * Job offers
 * ------------------------------------------------------------------ */

export interface OfferInput {
  salary: number;
  bonus: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  commuteMinutes: number;
  daysPerWeek: number;
  ptoDays: number;
  retirementMatchPercent: number;
  benefitsValue: number;
  otherComp: number;
}

export interface OfferResult {
  salary: number;
  totalComp: number;
  retirementMatch: number;
  annualWorkHours: number;
  annualCommuteHours: number;
  totalHours: number;
  effectiveHourly: number;
  ptoValue: number;
}

export function evaluateOffer(offer: OfferInput): OfferResult {
  const retirementMatch = offer.salary * (Math.max(0, offer.retirementMatchPercent) / 100);
  const totalComp =
    offer.salary + offer.bonus + retirementMatch + offer.benefitsValue + offer.otherComp;
  const annualWorkHours = offer.hoursPerWeek * offer.weeksPerYear;
  const annualCommuteHours =
    (offer.commuteMinutes / 60) * offer.daysPerWeek * offer.weeksPerYear;
  const totalHours = annualWorkHours + annualCommuteHours;
  const dailyHours = offer.daysPerWeek > 0 ? offer.hoursPerWeek / offer.daysPerWeek : 0;
  return {
    salary: offer.salary,
    totalComp,
    retirementMatch,
    annualWorkHours,
    annualCommuteHours,
    totalHours,
    effectiveHourly: totalHours > 0 ? totalComp / totalHours : NaN,
    ptoValue: annualWorkHours > 0 ? (offer.salary / annualWorkHours) * dailyHours * offer.ptoDays : 0,
  };
}

/* ------------------------------------------------------------------ *
 * Misc
 * ------------------------------------------------------------------ */

export function commuteCost(options: {
  milesPerDay: number;
  daysPerWeek: number;
  weeksPerYear: number;
  mpg: number;
  gasPrice: number;
  maintenancePerMile: number;
  parkingTolls: number;
}): {
  annualMiles: number;
  gallons: number;
  fuelCost: number;
  maintenance: number;
  parking: number;
  annualCost: number;
  monthlyCost: number;
  weeklyCost: number;
  costPerDay: number;
  daysPerYear: number;
} {
  const daysPerYear = options.daysPerWeek * options.weeksPerYear;
  const annualMiles = options.milesPerDay * daysPerYear;
  const gallons = options.mpg > 0 ? annualMiles / options.mpg : NaN;
  const fuelCost = gallons * options.gasPrice;
  const maintenance = annualMiles * Math.max(0, options.maintenancePerMile);
  const parking = Math.max(0, options.parkingTolls) * daysPerYear;
  const annualCost = fuelCost + maintenance + parking;
  return {
    annualMiles,
    gallons,
    fuelCost,
    maintenance,
    parking,
    annualCost,
    monthlyCost: annualCost / 12,
    weeklyCost: options.weeksPerYear > 0 ? annualCost / options.weeksPerYear : NaN,
    costPerDay: daysPerYear > 0 ? annualCost / daysPerYear : NaN,
    daysPerYear,
  };
}

export function ptoAccrual(options: {
  hoursPerYear: number;
  hoursPerWeek: number;
  usedHours: number;
  weeksWorked: number;
  weeksPerYear: number;
}) {
  const accrualPerWeek = options.weeksPerYear > 0 ? options.hoursPerYear / options.weeksPerYear : 0;
  const accrued = accrualPerWeek * options.weeksWorked;
  const balance = accrued - Math.max(0, options.usedHours);
  const dailyHours = options.hoursPerWeek / 5;
  return {
    accrualPerWeek,
    accrualPerPayPeriodBiweekly: accrualPerWeek * 2,
    accrued,
    balance,
    balanceDays: dailyHours > 0 ? balance / dailyHours : NaN,
    totalDaysPerYear: dailyHours > 0 ? options.hoursPerYear / dailyHours : NaN,
  };
}

export function freelanceRate(options: {
  targetIncome: number;
  expenses: number;
  taxRatePercent: number;
  billableHoursPerWeek: number;
  workWeeksPerYear: number;
  utilizationPercent: number;
}) {
  const grossNeeded =
    (options.targetIncome + Math.max(0, options.expenses)) /
    Math.max(0.01, 1 - Math.max(0, Math.min(90, options.taxRatePercent)) / 100);
  const utilization = Math.max(1, Math.min(100, options.utilizationPercent)) / 100;
  const billableHours = options.billableHoursPerWeek * options.workWeeksPerYear * utilization;
  const hourly = billableHours > 0 ? grossNeeded / billableHours : NaN;
  return {
    grossNeeded,
    billableHours,
    hourly,
    dayRate: hourly * 8,
    weekRate: hourly * options.billableHoursPerWeek * utilization,
    monthlyRevenueTarget: grossNeeded / 12,
  };
}
