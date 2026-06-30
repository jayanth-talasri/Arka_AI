import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100">

      <h1 className="text-8xl font-bold text-amber-500">
        404
      </h1>

      <h2 className="text-3xl font-semibold mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-600 mt-3 mb-8">
        The page you are looking for doesn't exist.
      </p>

      <Link
        to="/dashboard"
        className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition"
      >
        Go to Dashboard
      </Link>

    </div>
  );
};

export default NotFoundPage;