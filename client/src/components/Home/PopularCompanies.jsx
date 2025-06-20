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
  const [startIndex, setStartIndex] = useState(0);

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

  // Rotate 5 companies every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prevIndex) => (prevIndex + 5) % companies.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [companies]);

  const visibleCompanies = companies.slice(startIndex, startIndex + 5);

  return (
    <div className="companies">
      <div className="container">
        <h3>TOP COMPANIES</h3>

        <div className="overflow-hidden h-[200px] relative">
          <div className="animate-marquee flex gap-4">
            {visibleCompanies.map((element, index) => (
              <div className="card min-w-[200px]" key={index}>
                <div className="content">
                  <div className="icon text-3xl">{getRandomIcon()}</div>
                  <div className="text">
                    <p>{element.company?.name || "Company"}</p>
                    <p>{element.company?.location || "Location"}</p>
                  </div>
                </div>
                <button className="mt-2">Open Positions {element.jobCount}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add this to your global CSS or Tailwind config */}
      <style>{`
        .animate-marquee {
          animation: scroll 4s linear infinite;
        }

        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default PopularCompanies;
