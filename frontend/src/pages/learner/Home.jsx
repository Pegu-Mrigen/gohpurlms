import React from "react";
import Hero from "../../components/learner/Hero";
import Companies from "../../components/learner/Companies";
import CoursesSection from "../../components/learner/CoursesSection";
import Testimonials from "../../components/learner/Testimonials";
import GetStarted from "../../components/learner/GetStarted";
import Footer from "../../components/learner/Footer";

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <Hero />
      <Companies />
      <CoursesSection />
      <Testimonials />
      <GetStarted />
      <Footer />
    </div>
  );
};

export default Home;
