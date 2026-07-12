import {
  FaSolarPanel,
  FaClock,
  FaMoneyBillWave,
  FaBrain,
} from "react-icons/fa";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <FaSolarPanel size={35} />,
      title: "Maximize Solar Output",
      desc: "Predict peak solar generation and utilize every unit of clean energy efficiently.",
    },
    {
      icon: <FaClock size={35} />,
      title: "Smart Appliance Scheduling",
      desc: "Know the best time to run heavy appliances and reduce dependency on grid electricity.",
    },
    {
      icon: <FaMoneyBillWave size={35} />,
      title: "Reduce Electricity Bills",
      desc: "Track savings and optimize daily energy consumption with AI-driven insights.",
    },
    {
      icon: <FaBrain size={35} />,
      title: "AI Recommendations",
      desc: "Receive intelligent suggestions based on weather forecasts and energy usage patterns.",
    },
  ];

  return (
    <section id="benefitsSection" className="py-24 bg-slate-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-orange-500 font-semibold uppercase tracking-widest">
            Why Choose Arka-AI
          </span>

          <h2 className="text-5xl font-bold mt-4">
            Smarter Energy Decisions
          </h2>

          <p className="mt-5 text-slate-600 max-w-3xl mx-auto text-lg">
            ArkaAI helps homeowners forecast solar generation,
            optimize appliance usage, and maximize monthly savings
            using Artificial Intelligence.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {benefits.map((item, index) => (

            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:-translate-y-2 hover:shadow-xl transition duration-300"
            >

              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center mb-6">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold mb-4">
                {item.title}
              </h3>

              <p className="text-slate-600 leading-7">
                {item.desc}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default BenefitsSection;