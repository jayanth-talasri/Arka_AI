import { FaPlayCircle } from "react-icons/fa";

const DemoSection = () => {
  return (
    <section id="demoSection" className="py-24 bg-white">

      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-14">

          <span className="text-orange-500 uppercase font-semibold tracking-widest">
            Product Demo
          </span>

          <h2 className="text-5xl font-bold mt-4">
            See ArkaAI in Action
          </h2>

          <p className="mt-5 text-slate-600 max-w-3xl mx-auto text-lg">
            Watch how ArkaAI forecasts solar generation,
            recommends the best appliance usage time,
            and helps homeowners maximize energy savings.
          </p>

        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">

          <video
            controls
            className="w-full"
            
          >
            <source src="/demo.mp4" type="video/mp4" />

            Your browser does not support the video tag.

          </video>

        </div>

        <div className="flex justify-center mt-10">

          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 transition">

            <FaPlayCircle />

            Download Brochure

          </button>
          

        </div>

      </div>

    </section>
  );
};

export default DemoSection;