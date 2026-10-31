// Formatting helpers built on the browser's Intl API (no moment.js needed).

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export const formatCurrency = (n) => currency.format(Number(n) || 0);

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

// "2026-10-31" -> local Date (avoids the off-by-one-day bug of new Date("2026-10-31") in some timezones)
export const parseDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const formatDate = (iso) => dateFmt.format(parseDate(iso));

const monthFmt = new Intl.DateTimeFormat("en-IN", { month: "short", year: "2-digit" });
export const formatMonth = (yyyyMm) => monthFmt.format(parseDate(`${yyyyMm}-01`));

export const todayISO = () => {
  const d = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
