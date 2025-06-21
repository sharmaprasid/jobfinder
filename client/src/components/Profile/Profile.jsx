import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import "./Profile.css";

const Profile = () => {
  const { isAuthorized, user, setUser } = useContext(Context);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch user data
  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/user/getuser`, {
          withCredentials: true,
        });
        setProfile(res.data.user);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthorized, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("company.")) {
      const key = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        company: {
          ...prev.company,
          [key]: value,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`${import.meta.env.VITE_APP_API_URL}/user/update`, profile, {
        withCredentials: true,
      });
      setUser(res.data.user);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      toast.success("Profile updated successfully!");
      setLoading(false);
    }
  };

  if (loading || !profile) return <p className="loading-text">Loading...</p>;

  const isEmployer = profile.role === "Employer";

  return (
    <section className="profile page">
      <div className="container">
        <h3>Your Profile</h3>

        <div className="profile-info">
          <label>
            Name:
            {editMode ? (
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-field">{profile.name}</p>
            )}
          </label>

          <label>
            Email:
            <p className="text-field">{profile.email}</p>
          </label>

          <label>
            Phone:
            {editMode ? (
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-field">{profile.phone}</p>
            )}
          </label>

          <label>
            Role:
            <p className="text-field">{profile.role}</p>
          </label>

          {isEmployer && (
            <>
              <h3>Company Info</h3>

              <label>
                Company Name:
                {editMode ? (
                  <input
                    name="company.name"
                    value={profile.company?.name || ""}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-field">{profile.company?.name}</p>
                )}
              </label>

              <label>
                Location:
                {editMode ? (
                  <input
                    name="company.location"
                    value={profile.company?.location || ""}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-field">{profile.company?.location}</p>
                )}
              </label>

              <label>
                Industry:
                {editMode ? (
                  <input
                    name="company.industry"
                    value={profile.company?.industry || ""}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-field">{profile.company?.industry}</p>
                )}
              </label>

              {profile.company?.website && (
  <label>
    Website:
    {editMode ? (
      <input
        name="company.website"
        value={profile.company.website}
        onChange={handleChange}
        className="input-field"
      />
    ) : (
      <p className="text-field">
        <a
          href={
            profile.company.website.startsWith("http")
              ? profile.company.website
              : `https://${profile.company.website}`
          }
          target="_blank"
          rel="noreferrer"
        >
          {profile.company.website}
        </a>
      </p>
    )}
  </label>
)}
            </>
          )}
        </div>

        <div className="profile-actions">
          {editMode ? (
            <>
              <button onClick={handleSave} className="btn save-btn">
                Save
              </button>
              <button onClick={() => setEditMode(false)} className="btn cancel-btn">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="btn edit-btn">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
