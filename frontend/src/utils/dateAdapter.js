const toCompact = (dateObj) => {
  return dateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }).replaceAll('-', '');
};

const parseLocal = (isoDateStr) => {
  const [y, m, d] = isoDateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const getQueryDatesForPage = (pageType, selectedDate, periodMode = 'daily') => {
  const base = parseLocal(selectedDate);

  switch (pageType) {
    // 1. Single-day pages: Recommendations & Weather
    case 'recommendations':
    case 'weather': {
      const compact = toCompact(base);
      return { start: compact, end: compact };
    }

    // 2. Forecast: Uses selectedDate as Day 1 and fetches 7 days ahead
    case 'forecast': {
      const end = new Date(base);
      end.setDate(base.getDate() + 6);
      return { start: toCompact(base), end: toCompact(end) };
    }

    // 3. Dashboard & Analytics: Adapts dynamically to Daily / Weekly / Monthly dropdown
    case 'dashboard':
    case 'analytics': {
      const start = new Date(base);
      if (periodMode === 'weekly') {
        start.setDate(base.getDate() - 6); // 7-day window ending on selectedDate
      } else if (periodMode === 'monthly') {
        start.setDate(base.getDate() - 29); // 30-day window ending on selectedDate
      }
      return { start: toCompact(start), end: toCompact(base) };
    }

    // 4. History: Shows trailing 7 days up to selectedDate (or single day if daily)
    case 'history': {
      const start = new Date(base);
      start.setDate(base.getDate() - 6);
      return { start: toCompact(start), end: toCompact(base) };
    }

    default: {
      const compact = toCompact(base);
      return { start: compact, end: compact };
    }
  }
};