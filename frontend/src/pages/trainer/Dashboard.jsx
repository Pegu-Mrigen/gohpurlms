import React from "react";
import { useContext, useEffect } from "react";
import { AppContext } from "./../../context/AppContext";
import { useState } from "react";
import { dummyDashboardData, assets } from "./../../assets/assets";
import Loading from "./../../components/learner/Loading";
import { toast } from "react-toastify";
import axios from "axios";

const Dashboard = () => {
  const { currency, backendUrl, getToken, isTrainer } = useContext(AppContext);
  const [dashboardDetails, setDashboardDetails] = useState(null);

  const fetchDashboardDetails = async () => {
    // setdashboardData(dummyDashboardData);
    try {
      const token = getToken();

      const { data } = await axios.get(backendUrl + "/api/trainer/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setDashboardDetails(data.dashboardDetails);
      } else {
        toast.error(data.msg);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  useEffect(() => {
    if (isTrainer) {
      fetchDashboardDetails();
    }
  }, [isTrainer]);
  return dashboardDetails ? (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.patients_icon} alt="" />
            <div className="">
              <p className="text-2xl font-medium to-gray-600">
                {dashboardDetails.enrolledStudentsData.length}
              </p>
              <p className="text-base text-gray-500">Total Enrollments</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.appointment_icon} alt="" />
            <div className="">
              <p className="text-2xl font-medium to-gray-600">
                {dashboardDetails.totalCourses}
              </p>
              <p className="text-base text-gray-500">Total Courses</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.earning_icon} alt="" />
            <div className="">
              <p className="text-2xl font-medium to-gray-600">
                {dashboardDetails.totalEarnings}
              </p>
              <p className="text-base text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>
        <div className="">
          <h2 className="pb-4 text-lg font-medium">Latest Enrollments</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed md:table-auto w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left ">
                <tr className="">
                  <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                    #
                  </th>
                  <th className="px-4 py-3  font-semibold">Learner Name</th>
                  <th className="px-4 py-3  font-semibold">Course Title</th>
                </tr>
              </thead>

              <tbody className="text-sm to-gray-500">
                {dashboardDetails.enrolledStudentsData.map((item, i) => (
                  <tr className="border-b border-gray-600/20">
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      {i + 1}
                    </td>
                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                      <img
                        src={item.student.imageUrl}
                        alt=""
                        className="w-9 h-9 rounded-full"
                      />
                      <span className="truncate">{item.student.name}</span>
                    </td>
                    <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
