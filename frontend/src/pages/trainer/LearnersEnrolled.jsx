import React from "react";
import { useState, useContext } from "react";
import { dummyStudentEnrolled } from "./../../assets/assets";
import { useEffect } from "react";
import Loading from "./../../components/learner/Loading";
import { AppContext } from "./../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const LearnersEnrolled = () => {
  // const { currency, allCourses } = useContext(AppContext);

  const { backendUrl, getToken, isTrainer } = useContext(AppContext);

  const [enrolledLearners, setEnrolledLearners] = useState(null);

  const fectchEnrolledLearners = async () => {
    // setEnrolledLearners(dummyStudentEnrolled);

    try {
      const token = getToken();

      const { data } = await axios.get(
        backendUrl + "/api/trainer/enrolled-learners",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setEnrolledLearners(data.entrolledLearners.reverse());
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
      fectchEnrolledLearners();
    }
  }, [isTrainer]);
  return enrolledLearners ? (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
          <thead className="text-gray-900 border-b border-t-gray-500/20 text-sm text-left">
            <tr className="">
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                #
              </th>
              <th className="px-4 py-3 font-semibold">Learner Name</th>
              <th className="px-4 py-3 font-semibold">Course Title</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="text-sm to-gray-500">
            {enrolledLearners.map((item, i) => (
              <tr key={i} className="border-b border-gray-500/20">
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
                <td className="px-4 py-3 hidden sm:table-cell">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default LearnersEnrolled;
