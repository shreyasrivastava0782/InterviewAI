import  { useState, useRef } from "react";
import {
  FiUploadCloud,
  FiBriefcase,
  FiUser,
  FiInfo,
  FiZap,
  FiSettings
} from "react-icons/fi";
import { IoPersonCircleOutline } from "react-icons/io5";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from 'react-router-dom'
import Dropdown from "../../auth/components/Dropdown";

const Home = () => {
  const { loading, generateReport,reports } = useInterview()
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");

  const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[ 0 ]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        navigate(`/interview/${data._id}`)
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    console.log("Reports:", reports);

  return (
    <div className="home">

      {/* Background Glow */}
      <div className="bg-glow"></div>

      <nav className="navbar">

  <div className="logo">
    <span>Interview</span>AI
  </div>

  <ul>

    <li className="active">Dashboard</li>

    <li>History</li>

    <li>Resources</li>

  </ul>

  <div className="right-nav">

    <button className="upgrade-btn">
      Upgrade Pro
    </button>

    <FiSettings className="nav-icon"/>

    {/* <IoPersonCircleOutline className="nav-icon"/> */}
    <Dropdown/>

  </div>

</nav>

      <div className="main-card">

        <div className="heading">
          <h1>
            Create Your Custom <span>Interview Plan</span>
          </h1>

          <p>
            Let our AI analyze the job requirements and your unique profile to
            build a winning interview strategy.
          </p>
        </div>

        <div className="content">

          {/* LEFT */}

          <div className="left">

            <div className="section-title">
              <FiBriefcase />
              <span>Target Job Description</span>
            </div>

            <textarea
              placeholder="Paste the full job description here...

e.g. Senior Frontend Engineer at Google requires proficiency in React, TypeScript and large-scale System Design..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <div className="counter">
              {jobDescription.length} / 10000 Characters
            </div>

          </div>

          {/* RIGHT */}

          <div className="right">

            <div className="section-title">
              <FiUser />
              <span>Your Profile</span>
            </div>

            <div className="upload-box">

              <div className="upload-icon">
                <FiUploadCloud />
              </div>

              <h3>Click to upload or drag & drop</h3>

              <p>PDF or DOCX (Max 5MB)</p>

              <input ref={resumeInputRef} type="file" />

            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <h4>Quick Self Description</h4>

            <textarea
              className="small-textarea"
              placeholder="Briefly describe your experience, key skills and projects..."
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
            />

            <div className="info-box">

              <FiInfo />

              <p>
                Either a <b>Resume</b> or a <b>Self Description</b> is required
                to generate your personalized strategy.
              </p>

            </div>

          </div>

        </div>

        <div className="bottom">

          <div className="note">
            • AI Powered Strategy Generation • Approx 30 Seconds
          </div>

          <button onClick={handleGenerateReport}>

            Generate My Interview Strategy

            <FiZap />

          </button>

        </div>

      </div>

      {/* recent reports list */}
      {/* {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
    
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )} */}

            <div className="recent-wrapper">
  {reports.length > 0 && (
    <section className="recent-reports">
      <h2>My Recent Interview Plans</h2>

      <ul className="reports-list">
        {reports.map((report) => (
          <li
            key={report._id}
            className="report-item"
            onClick={() => navigate(`/interview/${report._id}`)}
          >
            <h3>{report.title || "Untitled Position"}</h3>

            <p className="report-meta">
              📅 Generated on{" "}
              {new Date(report.createdAt).toLocaleDateString()}
            </p>

            <span
              className={`match-score ${
                report.matchScore >= 80
                  ? "score--high"
                  : report.matchScore >= 60
                  ? "score--mid"
                  : "score--low"
              }`}
            >
              ⭐ Match Score: {report.matchScore}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  )}
</div>

      <footer className="footer">

<div>

© 2024 InterviewAI. Precision Prep for Professionals.

</div>

<div className="footer-links">

<span>Privacy Policy</span>

<span>Terms of Service</span>

<span>Help Center</span>

<span>Support</span>

</div>

</footer>

    </div>
  );
};

export default Home;