import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h1 className="text-5xl font-bold text-slate-800 leading-tight">
            Smarter Solar Energy
            <span className="text-amber-500"> Forecasting</span>
            {" "}with AI
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Predict solar generation, optimize appliance usage,
            and maximize savings with intelligent recommendations.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/register"
              className="bg-amber-500 text-white px-6 py-3 rounded-lg"
            >
              Get Started
            </Link>

            <button className="border px-6 py-3 rounded-lg">
              View Demo
            </button>
          </div>
        </div>

        <div>
          <img
            src="/hero.png"
            alt="ArkaAI"
            className="rounded-xl shadow-lg"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;