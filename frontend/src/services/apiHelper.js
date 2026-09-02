export const DEFAULT_START_DATE = "20240101";
export const DEFAULT_END_DATE = "20240107";

export const buildDateParams = (params = {}) => {
  return {
    start: params.start || DEFAULT_START_DATE,
    end: params.end || DEFAULT_END_DATE,
    ...params,
  };
};

export const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error?.message ||
    error?.response?.data?.detail ||
    fallback
  );
};