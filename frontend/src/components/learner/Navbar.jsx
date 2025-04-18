import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { assets } from "./../../assets/assets";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { AppContext } from "./../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const { navigate, isTrainer, setIsTrainer, backendUrl, getToken } =
    useContext(AppContext);
  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();

  const { user } = useUser();

  const becomeTrainer = async () => {
    try {
      if (isTrainer) {
        navigate("/trainer");
        return;
      }

      const token = await getToken();

      const { data } = await axios.get(
        backendUrl + "/api/trainer/update-role",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setIsTrainer(true);
        toast.success(data.msg);
      } else {
        toast.error(data.msg);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.msg);
    }
  };
  return (
    <div
      className={`flex  items-center justify-between px-4 sm:px-10 md:px-14 lg:px-16 border-b border-gray-500 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100"
      }`}
    >
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="w-10 lg:w-12 cursor-pointer"
      />

      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              {/* <button onClick={() => navigate("/trainer")}> */}
              <button onClick={becomeTrainer}>
                {isTrainer ? "Trainer Dashboard" : "Become a Trainer"}
              </button>{" "}
              |<Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="text-white bg-blue-600 px-5 py-2 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>
      <div className="md:hidden flex items-center gap-2 sm:gap-5 to-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button onClick={becomeTrainer}>
                {isTrainer ? "Trainer Dashboard" : "Become a Trainer"}
              </button>
              <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>

        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
