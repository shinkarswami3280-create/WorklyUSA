/** Formatting helpers shared by every calculator. Pure and deterministic. */

const usd = (fractionDigits: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

export function money(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return usd(fractionDigits).format(value);
}

/** Money without cents when the value is a whole number, e.g. $62,000 / $2,384.62 */
export function moneySmart(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return Number.isInteger(value) ? money(value, 0) : money(value, 2);
}

export function rate(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return `${money(value, 2)}/hr`;
}

export function number(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function percent(value: number, fractionDigits = 1): string {
  if (!Number.isFinite(value)) return "—";
  return `${number(value, fractionDigits)}%`;
}

/** 495 minutes -> "8h 15m" */
export function duration(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes)) return "—";
  const sign = totalMinutes < 0 ? "-" : "";
  const abs = Math.abs(Math.round(totalMinutes));
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  if (hours === 0) return `${sign}${minutes}m`;
  if (minutes === 0) return `${sign}${hours}h`;
  return `${sign}${hours}h ${minutes}m`;
}

/** Decimal hours, the format payroll systems use: 8.25 hrs */
export function hours(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return `${number(value, 2)} hrs`;
}

/** 12-hour clock label from minutes since midnight. */
export function clock(minutesSinceMidnight: number): string {
  const m = ((Math.round(minutesSinceMidnight) % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const mins = m % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(mins).padStart(2, "0")} ${suffix}`;
}
