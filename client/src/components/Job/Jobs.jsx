import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const { isJobSeeker, isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/job/getall`, {
          withCredentials: true,
        });
        setJobs(res.data.jobs || []);
        setFilteredJobs(res.data.jobs || []);
      } catch (error) {
        console.log("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    }
  }, [isAuthorized]);

  // Handle search logic
  const handleSearch = () => {
    const result = jobs.filter((job) => job.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredJobs(result);
    setSearchActive(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="jobs page">
      <div className="container">
        <h2>{isJobSeeker ? "Jobs for you" : "All Posted Jobs"}</h2>

        <div className="search-bar">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Search by job title..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                if (value.trim() === "") {
                  setFilteredJobs(jobs);
                  setSearchActive(false);
                }
              }}
              onKeyDown={handleKeyPress}
              className="search-input"
            />

            {searchTerm && (
              <button
                type="button"
                className="clear-button"
                onClick={() => {
                  setSearchTerm("");
                  setFilteredJobs(jobs);
                  setSearchActive(false);
                }}
              >
                ✕
              </button>
            )}
          </div>

          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>

        {searchActive && (
          <p className="search-note">
            Showing results for "<strong>{searchTerm}</strong>"
          </p>
        )}

        <div className="banner">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((element) => (
              <div className="card" key={element._id}>
                <p>
                  <strong>{element.title}</strong>
                </p>
                <p>{element.category}</p>
                <p>{element.country}</p>
                <Link to={`/job/${element._id}`}>Job Details</Link>
              </div>
            ))
          ) : (
            <div className="no-jobs">
              <p>
                No jobs found matching "<strong>{searchTerm}</strong>"
              </p>
              <p>Try using different keywords or browse all jobs again.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
