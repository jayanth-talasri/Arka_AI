const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mx-auto"></div>

        <p className="mt-4 text-gray-600 font-medium">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Loader;