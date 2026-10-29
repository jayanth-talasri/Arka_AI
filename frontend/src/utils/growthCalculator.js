export const calculateGrowth = (current, previous) => {
  const currentValue = Number(current);
  const previousValue = Number(previous);
  if (!Number.isFinite(currentValue) || !Number.isFinite(previousValue) || previousValue === 0) return null;
  return Number((((currentValue - previousValue) / Math.abs(previousValue)) * 100).toFixed(1));
};