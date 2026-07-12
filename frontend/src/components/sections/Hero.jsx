import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold text-slate-800 leading-tight">
            Smarter Solar Energy
            <span className="text-amber-500"> Forecasting</span>
            {" "}with AI
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Predict solar generation, optimize appliance usage,
            and maximize savings with intelligent recommendations.
          </p>

          <div className="mt-8 flex gap-6 justify-center md:justify-start">
            <Link
              to="/register"
              className="bg-amber-500 text-white px-6 py-3 rounded-lg"
            >
              Get Started
            </Link>
            <Link
              to="/"
              className="bg-amber-500 text-white px-6 py-3 rounded-lg"
            >
              View Demo
            </Link>
          </div>
        </div>

        <div>
          <img
            src="/favicon.jpg"
            alt="ArkaAI"
            className="rounded-xl shadow-lg"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;