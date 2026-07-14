import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const Navbar = () => {

  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">

        <div className="flex items-center gap-3">

          <button
            onClick={() => setOpenSidebar(true)}
            className="text-2xl"
          >
            ☰
          </button>

          <h1 className="text-2xl font-bold text-amber-500">
            ☀️ArkaAI
          </h1>

        </div>

        <div className="flex gap-8">
          <a href="#benefitsSection">Benefits</a>
          <a href="#features">Features</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="mt-1 flex gap-6 justify-center">
          <Link
            to="/login"
            className="bg-amber-500 text-white px-5 py-2 rounded-lg"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-amber-500 text-white px-5 py-2 rounded-lg"
          >
            signup
          </Link>
        </div>

      </nav>

      {openSidebar && (
        <Sidebar
          closeSidebar={() => setOpenSidebar(false)}
        />
      )}
    </>
  );
};

export default Navbar;