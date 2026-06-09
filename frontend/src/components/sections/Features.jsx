import {
  FaSolarPanel,
  FaChartLine,
  FaMoneyBillWave
} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaSolarPanel size={40} />,
      title: "Solar Forecasting",
      desc: "Predict daily solar generation."
    },
    {
      icon: <FaChartLine size={40} />,
      title: "AI Analytics",
      desc: "Track trends and system performance."
    },
    {
      icon: <FaMoneyBillWave size={40} />,
      title: "Savings Insights",
      desc: "Optimize energy usage and reduce costs."
    }
  ];

  return (
    <section
      id="features"
      className="py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-12">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {features.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 p-8 rounded-xl shadow-sm"
            >
              <div className="text-amber-500 mb-4">
                {item.icon}
              </div>

              <h3 className="font-bold text-xl mb-2">
                {item.title}
              </h3>

              <p>{item.desc}</p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Features;