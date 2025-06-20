import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaAmazon,
  FaApple,
  FaDropbox,
  FaFacebook,
  FaGoogle,
  FaMicrosoft,
  FaSlack,
  FaSpotify,
} from "react-icons/fa";
import { SiAdobe, SiLinkedin, SiSamsung, SiTesla, SiTwitch } from "react-icons/si";

const icons = [
  <FaApple />,
  <FaMicrosoft />,
  <FaGoogle />,
  <FaAmazon />,
  <FaFacebook />,
  <FaSpotify />,
  <FaDropbox />,
  <FaSlack />,
  <SiTesla />,
  <SiSamsung />,
  <SiAdobe />,
  <SiLinkedin />,
  <SiTwitch />,
];

const getRandomIcon = () => icons[Math.floor(Math.random() * icons.length)];

const PopularCompanies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`https://jobfinderserver.vercel.app/api/v1/company`, {
          withCredentials: true,
        });
        setCompanies(res.data.companies);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch companies");
      }
    };

    fetchCompanies();
  }, []);

  // Take only the first 5 companies
  const topCompanies = companies.slice(0, 5);

  return (
    <div className="companies py-4 bg-white">
      <div className="container mx-auto text-center">
        <h3 className="text-xl font-bold mb-4">TOP COMPANIES</h3>
        <div className="flex justify-center gap-6 overflow-x-auto">
          {topCompanies.map((element, index) => (
            <div
              key={index}
              className="card bg-gray-100 rounded-xl shadow-md px-4 py-3 min-w-[200px] text-left flex flex-col items-center"
            >
              <div className="text-3xl mb-2">{getRandomIcon()}</div>
              <p className="font-semibold">{element.company?.name || "Company"}</p>
              <p className="text-sm text-gray-600">{element.company?.location || "Location"}</p>
              <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                Open Positions {element.jobCount}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCompanies;
