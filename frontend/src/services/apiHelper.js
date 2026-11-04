export const DEFAULT_START_DATE = "20240101";
export const DEFAULT_END_DATE = "20240107";

const toDate = (value) => {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (/^\d{8}$/.test(value)) {
    return new Date(
      Number(value.slice(0, 4)),
      Number(value.slice(4, 6)) - 1,
      Number(value.slice(6, 8))
    );
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date) =>
  `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const buildDateParams = (params = {}) => {
  return {
    start: params.start || DEFAULT_START_DATE,
    end: params.end || DEFAULT_END_DATE,
    ...params,
  };
};

export const getPeriodDates = (range = "daily", selectedDate = new Date()) => {
  const date = toDate(selectedDate);

  let start;
  let end;
  let previousStart;
  let previousEnd;

  if (range === "daily") {
    start = date;
    end = date;
    previousStart = addDays(start, -1);
    previousEnd = previousStart;
  } else if (range === "weekly") {
    const daysFromMonday = (date.getDay() + 6) % 7;
    start = addDays(date, -daysFromMonday);
    end = addDays(start, 6);
    previousStart = addDays(start, -7);
    previousEnd = addDays(start, -1);
  } else if (range === "monthly") {
    start = new Date(date.getFullYear(), date.getMonth(), 1);
    end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    previousStart = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    previousEnd = new Date(date.getFullYear(), date.getMonth(), 0);
  } else if (range === "yearly") {
    start = new Date(date.getFullYear(), 0, 1);
    end = new Date(date.getFullYear(), 11, 31);
    previousStart = new Date(date.getFullYear() - 1, 0, 1);
    previousEnd = new Date(date.getFullYear() - 1, 11, 31);
  } else {
    throw new Error(`Unsupported date range: ${range}`);
  }

  const effectiveEnd = end > date ? date : end;

  return {
    start: formatDate(start),
    end: formatDate(effectiveEnd),
    previousStart: formatDate(previousStart),
    previousEnd: formatDate(previousEnd),
  };
};

export const calculateGrowth = (current, previous) => {
  const currentValue = Number(current);
  const previousValue = Number(previous);

  if (
    !Number.isFinite(currentValue) ||
    !Number.isFinite(previousValue) ||
    previousValue === 0
  ) {
    return null;
  }

  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
};

export const getErrorMessage = (error, fallback = "Something went wrong.") => (
  error?.response?.data?.message ||
  error?.response?.data?.error?.message ||
  error?.response?.data?.detail ||
  error?.message ||
  fallback
);