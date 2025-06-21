import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import ResumeModal from "./ResumeModal";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    }
  }, [isAuthorized, navigateTo]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (user && user.role === "Employer") {
          const res = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/application/employer/getall`,
            { withCredentials: true }
          );
          setApplications(res.data.applications);
        } else {
          const res = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/application/jobseeker/getall`,
            { withCredentials: true }
          );
          setApplications(res.data.applications);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch applications");
      }
    };

    fetchApplications();
  }, [isAuthorized, user]);

  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/application/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      setApplications((prevApplication) =>
        prevApplication.filter((application) => application._id !== id)
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete application");
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="my_applications page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <center>
            <h3>My Applications</h3>
          </center>
          {applications.length <= 0 ? (
            <>
              {" "}
              <center>
                <h4>No Applications Found</h4>
              </center>{" "}
            </>
          ) : (
            applications.map((element) => {
              return (
                <JobSeekerCard
                  element={element}
                  key={element._id}
                  deleteApplication={deleteApplication}
                  openModal={openModal}
                />
              );
            })
          )}
        </div>
      ) : (
        <div className="container">
          <center>
            <h3>Applications From Job Seekers</h3>
          </center>
          {applications.length <= 0 ? (
            <>
              <center>
                <h4>No Applications Found</h4>
              </center>
            </>
          ) : (
            applications.map((element) => {
              return <EmployerCard element={element} key={element._id} openModal={openModal} />;
            })
          )}
        </div>
      )}
      {modalOpen && <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />}
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  return (
    <div className="application-card glassy">
      <div className="application-info">
        <h3>{element.name}</h3>
        <p>
          <strong>Email:</strong> {element.email}
        </p>
        <p>
          <strong>Phone:</strong> {element.phone}
        </p>
        <p>
          <strong>Address:</strong> {element.address}
        </p>
        <p>
          <strong>Cover Letter:</strong> {element.coverLetter}
        </p>
      </div>
      <div className="application-actions">
        <img
          src={element.resume.url}
          alt="Resume"
          className="resume-img"
          onClick={() => openModal(element.resume.url)}
        />
        <button className="btn-delete" onClick={() => deleteApplication(element._id)}>
          🗑 Delete
        </button>
      </div>
    </div>
  );
};

const EmployerCard = ({ element, openModal }) => {
  return (
    <div className="application-card glassy">
      <div className="application-info">
        <h3>{element.name}</h3>
        <p>
          <strong>Email:</strong> {element.email}
        </p>
        <p>
          <strong>Phone:</strong> {element.phone}
        </p>
        <p>
          <strong>Address:</strong> {element.address}
        </p>
        <p>
          <strong>Cover Letter:</strong> {element.coverLetter}
        </p>
      </div>
      <div className="application-actions">
        <img
          src={element.resume.url}
          alt="Resume"
          className="resume-img"
          onClick={() => openModal(element.resume.url)}
        />
      </div>
    </div>
  );
};
