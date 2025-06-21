import axios from "axios";
import { useEffect, useState } from "react";
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
        const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/company`, {
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

  return (
    <div className="companies">
      <div className="container">
        <h3>TOP COMPANIES</h3>
        <div className="banner">
          {companies.map((element, index) => (
            <div className="card" key={index}>
              <div className="content">
                <div className="icon">{getRandomIcon()}</div>
                <div className="text">
                  <p>{element.company?.name || "Company"}</p>
                  <p>{element.company?.location || "Location"}</p>
                </div>
              </div>
              <button>Open Positions {element.jobCount}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCompanies;
