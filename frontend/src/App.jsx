import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import Home from "./pages/learner/Home";
import MyEnrollments from "./pages/learner/MyEnrollments";
import CourseDetails from "./pages/learner/CourseDetails";
import CoursesList from "./pages/learner/CoursesList";
import Player from "./pages/learner/Player";
import Loading from "./components/learner/Loading";
import Trainer from "./pages/trainer/Trainer";
import Dashboard from "./pages/trainer/Dashboard";
import AddCourse from "./pages/trainer/AddCourse";
import MyCourses from "./pages/trainer/MyCourses";
import LearnersEnrolled from "./pages/trainer/LearnersEnrolled";
import Navbar from "./components/learner/Navbar";
import "quill/dist/quill.snow.css";


const App = () => {
  const isTrainerRoute = useMatch("/trainer/*");
  return (
    <div className="text-default  min-h-screen bg-white">
      {!isTrainerRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:keywords" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/trainer" element={<Trainer />}>
          <Route path="/trainer" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="learner-enrolled" element={<LearnersEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
