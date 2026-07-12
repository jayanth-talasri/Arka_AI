import {
  FaSolarPanel,
  FaChartLine,
  FaMoneyBillWave,
} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaSolarPanel />,
      title: "Solar Forecasting",
      desc: "Predict daily solar generation using AI-powered weather analysis and historical energy data.",
    },
    {
      icon: <FaChartLine />,
      title: "AI Analytics",
      desc: "Monitor system performance, generation trends, and energy efficiency with interactive insights.",
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Savings Insights",
      desc: "Understand your monthly savings and optimize electricity consumption intelligently.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-white py-24"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-16">

          <span className="text-orange-500 font-semibold uppercase tracking-wider">
            Platform Features
          </span>

          <h2 className="mt-3 text-5xl font-bold text-slate-900">
            Everything You Need
          </h2>

          <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto">
            Powerful AI tools designed to help you forecast solar generation,
            optimize energy consumption, and maximize your savings.
          </p>

        </div>

        {/* Cards */}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {features.map((item, index) => (

            <div
              key={index}
              className="
              group
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-8
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-xl
              "
            >

              <div
                className="
                mb-6
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-orange-100
                text-3xl
                text-orange-500
                transition
                group-hover:bg-orange-500
                group-hover:text-white
                "
              >
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {item.title}
              </h3>

              <p className="leading-8 text-slate-600">
                {item.desc}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
};

export default Features;