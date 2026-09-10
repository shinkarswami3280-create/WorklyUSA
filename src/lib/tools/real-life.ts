import { commuteCost, minutesToHours, nonNeg, num, ptoAccrual, required } from "@/lib/calc";
import { duration, hours as fmtHours, money, moneySmart, number, percent } from "@/lib/format";
import type { Tool } from "./types";

export const realLifeTools: Tool[] = [
  {
    slug: "commute-cost-calculator",
    name: "Commute Cost Calculator",
    h1: "Commute Cost Calculator",
    category: "real-life",
    icon: "Car",
    short: "What driving to work actually costs each year.",
    keywords: ["commute cost", "cost of driving to work", "gas cost commute", "mileage cost"],
    title: "Commute Cost Calculator – Yearly Cost of Driving to Work | Workly USA",
    description:
      "Calculate the yearly cost of your commute including fuel, maintenance, parking and tolls, and what it costs in work hours.",
    intro:
      "Fuel is only part of it. Add maintenance, parking and tolls to see what your commute really costs.",
    fields: [
      { id: "milesPerDay", label: "Round-trip miles per day", default: "32", step: "0.1" },
      { id: "daysPerWeek", label: "Commute days per week", default: "5" },
      { id: "weeksPerYear", label: "Weeks per year", default: "48" },
      { id: "mpg", label: "Vehicle MPG", default: "27", step: "0.1" },
      { id: "gasPrice", label: "Gas price per gallon", prefix: "$", default: "3.35", step: "0.01" },
      {
        id: "maintenance",
        label: "Maintenance & wear per mile",
        prefix: "$",
        default: "0.10",
        step: "0.01",
        help: "Tires, oil, repairs and depreciation. $0.08–$0.15 is a common range.",
      },
      {
        id: "parking",
        label: "Parking and tolls per day",
        prefix: "$",
        default: "0",
        optional: true,
      },
      {
        id: "hourlyRate",
        label: "Your hourly rate (optional)",
        prefix: "$",
        default: "0",
        optional: true,
        step: "0.01",
      },
    ],
    compute: (v) => {
      const result = commuteCost({
        milesPerDay: required(num(v, "milesPerDay"), "round-trip miles", true),
        daysPerWeek: required(num(v, "daysPerWeek", 5), "commute days per week"),
        weeksPerYear: required(num(v, "weeksPerYear", 48), "weeks per year"),
        mpg: required(num(v, "mpg", 27), "vehicle MPG"),
        gasPrice: nonNeg(v, "gasPrice", 0),
        maintenancePerMile: nonNeg(v, "maintenance", 0),
        parkingTolls: nonNeg(v, "parking", 0),
      });
      const hourly = nonNeg(v, "hourlyRate", 0);
      const rows = [
        { label: "Fuel", value: moneySmart(result.fuelCost) },
        { label: "Maintenance & wear", value: moneySmart(result.maintenance) },
        { label: "Parking & tolls", value: moneySmart(result.parking) },
        { label: "Monthly cost", value: money(result.monthlyCost), strong: true },
        { label: "Cost per commuting day", value: money(result.costPerDay) },
        { label: "Miles driven per year", value: `${number(result.annualMiles, 0)} mi` },
        { label: "Gallons of fuel per year", value: number(result.gallons, 1) },
      ];
      if (hourly > 0) {
        rows.push({
          label: "Work hours needed to pay for it",
          value: fmtHours(result.annualCost / hourly),
        });
      }
      return {
        primary: { value: moneySmart(result.annualCost), label: "Estimated yearly commute cost" },
        rows,
      };
    },
    howItWorks: [
      "Annual miles are round-trip miles × commuting days per week × weeks per year.",
      "Fuel cost divides annual miles by MPG and multiplies by gas price.",
      "Per-mile maintenance and daily parking or tolls are added for a full picture.",
    ],
    formula:
      "Annual cost = (Miles ÷ MPG × Gas price) + (Miles × Maintenance per mile) + (Parking per day × Commuting days)",
    example: [
      "32 round-trip miles a day, 5 days a week, 48 weeks: 7,680 miles per year.",
      "At 27 MPG and $3.35 a gallon, fuel is about $953. Maintenance at $0.10 a mile adds $768.",
      "Total: roughly $1,721 a year, or $143 a month.",
    ],
    assumptions: [
      "Insurance and registration are excluded because you'd pay them anyway.",
      "Per-mile maintenance is an estimate; heavier vehicles and older cars cost more.",
    ],
    faqs: [
      {
        q: "Should I include car payments?",
        a: "Only the share caused by commuting. Most people already own the car, so per-mile wear is the fairer number.",
      },
      {
        q: "How does this compare with transit?",
        a: "Compare the total here against an annual transit pass. Also compare time using the commute time calculator.",
      },
      {
        q: "Is commuting tax deductible?",
        a: "For most US employees, ordinary commuting to a regular workplace is not deductible.",
      },
    ],
    related: [
      "commute-time-calculator",
      "effective-hourly-wage-calculator",
      "job-offer-comparison-calculator",
      "monthly-pay-calculator",
    ],
  },

  {
    slug: "commute-time-calculator",
    name: "Commute Time Calculator",
    h1: "Commute Time Calculator",
    category: "real-life",
    icon: "MapPin",
    short: "How many hours and days a year your commute takes.",
    keywords: ["commute time", "hours commuting per year", "time spent commuting", "commute hours"],
    title: "Commute Time Calculator – Hours Spent Commuting a Year | Workly USA",
    description:
      "See how many hours, workdays and unpaid hours your daily commute adds up to over a year.",
    intro:
      "A short daily trip adds up fast. See your commute in hours per year — and what those hours are worth.",
    fields: [
      { id: "minutesEachWay", label: "Minutes each way", default: "35" },
      { id: "daysPerWeek", label: "Commute days per week", default: "5" },
      { id: "weeksPerYear", label: "Weeks per year", default: "48" },
      {
        id: "hourlyRate",
        label: "Your hourly rate (optional)",
        prefix: "$",
        default: "0",
        optional: true,
        step: "0.01",
      },
    ],
    compute: (v) => {
      const each = required(num(v, "minutesEachWay"), "minutes each way", true);
      const days = required(num(v, "daysPerWeek", 5), "commute days per week");
      const weeks = required(num(v, "weeksPerYear", 48), "weeks per year");
      const dailyMinutes = each * 2;
      const annualMinutes = dailyMinutes * days * weeks;
      const annualHours = minutesToHours(annualMinutes);
      const hourly = nonNeg(v, "hourlyRate", 0);
      const rows = [
        { label: "Round trip per day", value: duration(dailyMinutes) },
        { label: "Per week", value: duration(dailyMinutes * days) },
        { label: "Per month", value: duration((annualMinutes / 12) | 0) },
        { label: "Equivalent 8-hour workdays", value: number(annualHours / 8, 1) },
        { label: "Equivalent 40-hour weeks", value: number(annualHours / 40, 1) },
      ];
      if (hourly > 0) {
        rows.push({
          label: "Unpaid time valued at your rate",
          value: moneySmart(annualHours * hourly),
        });
      }
      return {
        primary: { value: fmtHours(annualHours), label: "Hours commuting per year" },
        rows,
      };
    },
    howItWorks: [
      "Minutes each way are doubled for a round trip.",
      "That total is multiplied by commuting days per week and weeks per year.",
      "Annual minutes are converted into hours, workdays and full workweeks.",
    ],
    formula:
      "Annual commute hours = (Minutes each way × 2 × Days per week × Weeks per year) ÷ 60",
    example: [
      "35 minutes each way is 70 minutes a day.",
      "Over 5 days and 48 weeks that's 16,800 minutes.",
      "That's 280 hours a year — the equivalent of 35 eight-hour workdays.",
    ],
    assumptions: [
      "Travel time is assumed consistent; traffic varies.",
      "Weeks per year should exclude vacation and remote days.",
    ],
    faqs: [
      {
        q: "How much time do Americans spend commuting?",
        a: "Averages vary by metro area, but a 30-minute each-way commute is roughly 240 hours a year at five days a week.",
      },
      {
        q: "How do remote days change this?",
        a: "Lower your commuting days per week. Two remote days cuts commute time by 40%.",
      },
      {
        q: "Is commute time paid?",
        a: "Ordinary home-to-work travel is generally unpaid. Travel between job sites during the day often is payable.",
      },
    ],
    related: [
      "commute-cost-calculator",
      "effective-hourly-wage-calculator",
      "job-offer-comparison-calculator",
      "hours-worked-calculator",
    ],
  },

  {
    slug: "pto-hours-calculator",
    name: "PTO Hours Calculator",
    h1: "PTO Hours Calculator",
    category: "real-life",
    icon: "Umbrella",
    short: "Track accrued PTO hours and what's left to use.",
    keywords: ["pto calculator", "pto accrual", "paid time off hours", "pto balance"],
    title: "PTO Hours Calculator – Accrual and Balance | Workly USA",
    description:
      "Calculate PTO accrual per week and per pay period, your current balance in hours and days, and the value of unused time.",
    intro:
      "Enter your annual PTO allowance to see how fast it accrues and what your balance is right now.",
    fields: [
      { id: "hoursPerYear", label: "PTO hours per year", suffix: "hrs", default: "120" },
      { id: "hoursPerWeek", label: "Hours in your normal week", suffix: "hrs", default: "40" },
      { id: "weeksWorked", label: "Weeks worked so far this year", default: "26" },
      { id: "usedHours", label: "PTO hours already used", suffix: "hrs", default: "24", optional: true },
      {
        id: "hourlyRate",
        label: "Hourly rate (optional)",
        prefix: "$",
        default: "0",
        optional: true,
        step: "0.01",
      },
    ],
    compute: (v) => {
      const result = ptoAccrual({
        hoursPerYear: required(num(v, "hoursPerYear"), "PTO hours per year", true),
        hoursPerWeek: required(num(v, "hoursPerWeek", 40), "hours in your normal week"),
        usedHours: nonNeg(v, "usedHours", 0),
        weeksWorked: nonNeg(v, "weeksWorked", 0),
        weeksPerYear: 52,
      });
      const hourly = nonNeg(v, "hourlyRate", 0);
      const rows = [
        { label: "Accrued so far", value: fmtHours(result.accrued) },
        { label: "Used", value: fmtHours(nonNeg(v, "usedHours", 0)) },
        { label: "Balance in days", value: number(result.balanceDays, 2) },
        { label: "Accrual per week", value: fmtHours(result.accrualPerWeek) },
        { label: "Accrual per biweekly pay period", value: fmtHours(result.accrualPerPayPeriodBiweekly) },
        { label: "Total PTO days per year", value: number(result.totalDaysPerYear, 1) },
      ];
      if (hourly > 0) {
        rows.push({ label: "Value of current balance", value: money(result.balance * hourly) });
      }
      return {
        primary: { value: fmtHours(result.balance), label: "Current PTO balance" },
        rows,
      };
    },
    howItWorks: [
      "Annual PTO hours are divided by 52 to get a weekly accrual rate.",
      "Weekly accrual is multiplied by the weeks you've worked this year.",
      "Hours already used are subtracted to give your balance, then converted to days using your normal daily hours.",
    ],
    formula:
      "Balance = (PTO hours per year ÷ 52 × Weeks worked) − Hours used",
    example: [
      "120 PTO hours a year is 2.31 hours per week, or 4.62 hours per biweekly paycheck.",
      "After 26 weeks you've accrued 60 hours.",
      "Having used 24 hours, your balance is 36 hours — 4.5 days at 8 hours a day.",
    ],
    assumptions: [
      "Straight-line accrual across 52 weeks; some employers front-load or accrue per hour worked.",
      "Carryover caps, waiting periods and payout rules vary by employer and state.",
    ],
    faqs: [
      {
        q: "How many PTO days is 120 hours?",
        a: "15 days for someone working 8-hour days.",
      },
      {
        q: "How much PTO do I earn per paycheck?",
        a: "Divide your annual PTO hours by your number of pay periods — 26 for biweekly, 24 for semi-monthly.",
      },
      {
        q: "Do I get paid for unused PTO?",
        a: "It depends on state law and employer policy. Some states treat accrued vacation as earned wages.",
      },
    ],
    related: [
      "vacation-days-calculator",
      "hours-worked-calculator",
      "salary-to-hourly-calculator",
      "job-offer-comparison-calculator",
    ],
  },

  {
    slug: "vacation-days-calculator",
    name: "Vacation Days Calculator",
    h1: "Vacation Days Calculator",
    category: "real-life",
    icon: "Plane",
    short: "Plan vacation days, holidays and remaining time off.",
    keywords: ["vacation days", "days off", "vacation planning", "annual leave"],
    title: "Vacation Days Calculator – Plan Your Days Off | Workly USA",
    description:
      "Plan your time off: total days available including holidays, days used, days remaining and the share of the year you're off.",
    intro:
      "See how many days off you really have once holidays are included, and how many are left to book.",
    fields: [
      { id: "vacationDays", label: "Vacation days per year", default: "15" },
      { id: "holidays", label: "Paid company holidays", default: "10" },
      { id: "personalDays", label: "Personal or sick days", default: "5", optional: true },
      { id: "used", label: "Vacation days already used", default: "6", optional: true },
      { id: "planned", label: "Vacation days already booked", default: "3", optional: true },
      { id: "workDaysPerWeek", label: "Work days per week", default: "5" },
    ],
    compute: (v) => {
      const vacation = required(num(v, "vacationDays"), "vacation days per year", true);
      const holidays = nonNeg(v, "holidays", 0);
      const personal = nonNeg(v, "personalDays", 0);
      const used = nonNeg(v, "used", 0);
      const planned = nonNeg(v, "planned", 0);
      const perWeek = required(num(v, "workDaysPerWeek", 5), "work days per week");
      const totalPaidOff = vacation + holidays + personal;
      const remaining = Math.max(0, vacation - used - planned);
      const workDaysPerYear = perWeek * 52;
      return {
        primary: { value: `${number(remaining, 1)} days`, label: "Vacation days left to book" },
        rows: [
          { label: "Total paid days off per year", value: `${number(totalPaidOff, 1)} days`, strong: true },
          { label: "Vacation days used", value: `${number(used, 1)} days` },
          { label: "Vacation days booked", value: `${number(planned, 1)} days` },
          { label: "Full weeks of vacation available", value: number(vacation / perWeek, 1) },
          {
            label: "Share of scheduled workdays off",
            value: percent((totalPaidOff / workDaysPerYear) * 100, 1),
          },
          { label: "Working days after time off", value: number(workDaysPerYear - totalPaidOff, 0) },
        ],
      };
    },
    howItWorks: [
      "Vacation days, company holidays and personal days are added for total paid time off.",
      "Days used and days already booked are subtracted from your vacation allowance.",
      "Totals are also shown as full weeks and as a share of your scheduled workdays.",
    ],
    formula: "Days left = Vacation days − Days used − Days booked",
    example: [
      "15 vacation days, 10 holidays and 5 personal days is 30 paid days off.",
      "With 6 used and 3 booked, 6 vacation days remain.",
      "15 vacation days at a 5-day week is exactly 3 weeks of vacation.",
    ],
    assumptions: [
      "Holidays are assumed to fall on scheduled workdays.",
      "Unlimited-PTO policies don't map neatly onto a day count.",
    ],
    faqs: [
      {
        q: "How many vacation days is typical in the US?",
        a: "Private-sector full-time workers commonly start around 10 days and earn more with tenure. There is no federal minimum.",
      },
      {
        q: "Do holidays count as vacation?",
        a: "Usually they are separate paid days. This calculator lists them separately for that reason.",
      },
      {
        q: "How do I convert hours of PTO into days?",
        a: "Divide your PTO hours by your normal daily hours, or use the PTO hours calculator.",
      },
    ],
    related: [
      "pto-hours-calculator",
      "hours-worked-calculator",
      "annual-pay-calculator",
      "effective-hourly-wage-calculator",
    ],
  },
];
