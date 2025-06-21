import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const Application = () => {
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    coverLetter: "",
  });
  const [resume, setResume] = useState(null);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileError("");

    if (!file) return setResume(null);

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Please select a PNG, JPEG, or WEBP file.");
      return setResume(null);
    }

    if (file.size > 2 * 1024 * 1024) {
      setFileError("File must be less than 2MB.");
      return setResume(null);
    }

    setResume(file);
  };

  const handleApplication = async (e) => {
    e.preventDefault();

    const { name, email, phone, address, coverLetter } = formData;
    if (!name || !email || !phone || !address || !coverLetter) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!resume) {
      setFileError("Resume is required.");
      return;
    }

    setLoading(true);

    const submission = new FormData();
    Object.entries(formData).forEach(([key, value]) => submission.append(key, value));
    submission.append("resume", resume);
    submission.append("jobId", id);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/application/post`,
        submission,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(data.message);
      setFormData({ name: "", email: "", phone: "", address: "", coverLetter: "" });
      setResume(null);
      navigateTo("/job/getall");
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong. Please try again later.";
      toast.error(msg);
      if (msg.includes("Cloudinary") || msg.includes("api_key")) {
        toast.error("Resume upload service temporarily unavailable.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("/");
  }

  return (
    <section className="application">
      <div className="container">
        <h2 className="form-title">Apply for this job</h2>
        <form className="application-form" onSubmit={handleApplication}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Your Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Your Address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <textarea
            name="coverLetter"
            rows="4"
            placeholder="Write your cover letter..."
            value={formData.coverLetter}
            onChange={handleInputChange}
          />

          <label className="resume-label">
            Upload Resume
            <span className="hint">(PNG, JPEG, WEBP • Max 2MB)</span>
            <input type="file" onChange={handleFileChange} accept="image/*" />
          </label>
          {fileError && <p className="error-msg">{fileError}</p>}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Submitting..." : "Send Application"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Application;
