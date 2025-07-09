// App.jsx
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Home/Home";
import JobDetails from "./components/Job/JobDetails";
import Jobs from "./components/Job/Jobs";
import MyJobs from "./components/Job/MyJobs";
import PostJob from "./components/Job/PostJob";
import Footer from "./components/Layout/Footer";
import Navbar from "./components/Layout/Navbar";
import NotFound from "./components/NotFound/NotFound";
import { Context } from "./main";
import Profile from "./components/Profile/Profile";

// Configure axios defaults
axios.defaults.withCredentials = true;

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser, user } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        // First check if we have a token in localStorage as fallback
        const token = localStorage.getItem('token');
        
        const config = {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        };

        // If we have a token, add it to headers as fallback
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.get(
          `https://jobfinderserver.vercel.app/api/v1/user/getuser`,
          config
        );
        
        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthorized(true);
        } else {
          throw new Error('User fetch failed');
        }
      } catch (error) {
        console.error("Auth error:", error.response?.data || error.message);
        setIsAuthorized(false);
        setUser(null);
        // Clear any stored token if auth fails
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setIsAuthorized, setUser]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/applications/me" element={<MyApplications />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;