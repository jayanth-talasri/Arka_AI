import Navbar from "../components/navigation/Navbar";
import Hero from "../components/sections/Hero";
import React from "react";
import BenifitsSection from "../components/sections/BenifitsSection";
import DemoSection from "../components/sections/DemoVideo";
import Features from "../components/sections/Features";
import Testimonials from "../components/sections/Testimonials";
import Footer from "../components/sections/Footer";
import Sidebar from "../components/navigation/Sidebar";
const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <BenifitsSection />
      <DemoSection />
      <Features />
      <Testimonials />
      <Footer />
    </>
  );
};

export default HomePage;