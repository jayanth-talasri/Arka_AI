const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 rounded-lg p-6 text-center">

      <h2 className="text-xl font-semibold mb-2">
        Something went wrong
      </h2>

      <p className="mb-4">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Try Again
        </button>
      )}

    </div>
  );
};

export default ErrorMessage;