
const parseLocalDate = (value) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid selected date: ${value}`);
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatCompactDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const getPeriodStart = (date, periodMode) => {
  const start = new Date(date);

  switch (periodMode) {
    case "daily":
      return start;

    case "weekly": {
      // Monday is the first day of the week.
      const daysFromMonday = (start.getDay() + 6) % 7;
      start.setDate(start.getDate() - daysFromMonday);
      return start;
    }

    case "monthly":
      start.setDate(1);
      return start;

    case "yearly":
      start.setMonth(0, 1);
      return start;

    default:
      throw new Error(`Unsupported period mode: ${periodMode}`);
  }
};

export const getQueryDatesForPage = (
  pageType,
  selectedDate,
  periodMode = "daily"
) => {
  const selected = parseLocalDate(selectedDate);

  // These pages currently request data for one selected day.
  // Their existing API behavior is intentionally preserved.
  if (pageType === "weather" || pageType === "recommendations") {
    const date = formatCompactDate(selected);

    return {
      start: date,
      end: date,
    };
  }

  // Historical pages must not request dates after the selected date.
  if (
    pageType === "dashboard" ||
    pageType === "analytics" ||
    pageType === "history"
  ) {
    const start = getPeriodStart(selected, periodMode);

    return {
      start: formatCompactDate(start),
      end: formatCompactDate(selected),
    };
  }

  // Forecast keeps its own future-range calculation in ForecastPage.
  if (pageType === "forecast") {
    const end = addDays(selected, 6);

    return {
      start: formatCompactDate(selected),
      end: formatCompactDate(end),
    };
  }

  const date = formatCompactDate(selected);

  return {
    start: date,
    end: date,
  };
};
