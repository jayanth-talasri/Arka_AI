const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Homeowner",
    feedback:
      "ArkaAI helped me understand when my solar panels generate the most power. My monthly electricity bill has reduced significantly.",
  },
  {
    name: "Priya Nair",
    role: "Solar User",
    feedback:
      "The AI recommendations are extremely useful. I now schedule all heavy appliances during peak solar production.",
  },
  {
    name: "Vikram Patel",
    role: "Engineer",
    feedback:
      "A simple yet powerful dashboard. Forecasts and analytics are presented beautifully and are easy to understand.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-slate-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-orange-500 uppercase tracking-widest font-semibold">
            Testimonials
          </span>

          <h2 className="text-5xl font-bold mt-4">
            What Our Users Say
          </h2>

          <p className="mt-5 text-lg text-slate-600 max-w-3xl mx-auto">
            Trusted by homeowners looking to maximize
            solar energy and reduce electricity costs.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-3">

          {testimonials.map((item, index) => (

            <div
              key={index}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 hover:shadow-xl transition"
            >

              <div className="text-amber-400 text-2xl mb-5">
                ★★★★★
              </div>

              <p className="text-slate-600 leading-7 italic">
                "{item.feedback}"
              </p>

              <div className="mt-8">

                <h4 className="font-bold text-lg">
                  {item.name}
                </h4>

                <p className="text-slate-500">
                  {item.role}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default Testimonials;