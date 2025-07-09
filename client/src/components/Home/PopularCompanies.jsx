import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import {
  FaAmazon, FaApple, FaDropbox, FaFacebook,
  FaGoogle, FaMicrosoft, FaSlack, FaSpotify
} from "react-icons/fa";
import {
  SiAdobe, SiLinkedin, SiSamsung, SiTesla, SiTwitch
} from "react-icons/si";
import { Context } from "../../main"; // Adjust the import path based on your project

const icons = [
  <FaApple />, <FaMicrosoft />, <FaGoogle />, <FaAmazon />,
  <FaFacebook />, <FaSpotify />, <FaDropbox />, <FaSlack />,
  <SiTesla />, <SiSamsung />, <SiAdobe />, <SiLinkedin />, <SiTwitch />,
];

// Stable icon assignment using modulo
const getIconByIndex = (index) => icons[index % icons.length];

const PopularCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthorized } = useContext(Context); // Optional: use this to conditionally fetch

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          `https://jobfinderserver.vercel.app/api/v1/company`,
          { withCredentials: true }
        );
        setCompanies(res.data.companies);
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to fetch companies");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is authenticated
    if (isAuthorized) {
      fetchCompanies();
    } else {
      setLoading(false);
    }
  }, [isAuthorized]);

  return (
    <div className="companies">
      <div className="container">
        <h3>TOP COMPANIES</h3>

        {loading ? (
          <p>Loading companies...</p>
        ) : companies.length === 0 ? (
          <p>No companies available.</p>
        ) : (
          <div className="banner">
            {companies.map((element, index) => (
              <div className="card" key={index}>
                <div className="content">
                  <div className="icon">{getIconByIndex(index)}</div>
                  <div className="text">
                    <p>{element.company?.name || "Company"}</p>
                    <p>{element.company?.location || "Location"}</p>
                  </div>
                </div>
                <button>
                  Open Positions {element.jobCount || 0}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularCompanies;
