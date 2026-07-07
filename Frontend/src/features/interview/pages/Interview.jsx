import { useState, useEffect } from "react";
import {
  FiCode,
  FiUsers,
  FiMap,
  FiTrendingUp,
  FiChevronDown,
  FiChevronUp,
  FiDownload
} from "react-icons/fi";

import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { useParams } from "react-router-dom";
import Dropdown from "../../auth/components/Dropdown";

const Interview = () => {

  const [activeMenu, setActiveMenu] = useState("technical");
  const [openQuestion, setOpenQuestion] = useState(null);

  const {report,getReportById,loading,getResumePdf}=useInterview()

  const {interviewId}=useParams()

  useEffect(()=>{
    if(interviewId){
      getReportById(interviewId)
    }
  },[interviewId])



  const technical = report?.technicalQuestions || [];
  const behavioral = report?.behavioralQuestions || [];
  const roadmap = report?.preparationPlan || [];

  const questions =
    activeMenu === "technical"
      ? technical
      : activeMenu === "behavioral"
      ? behavioral
      : [];

const matchScore = report?.matchScore || 0;
const radius = 70;
const circumference = 2 * Math.PI * radius;
const offset = circumference - (matchScore / 100) * circumference;
  

    if(loading || !report){
      return (
        <main className='loading-screen'>
          <h1>Loading your interview plan...</h1>
        </main>
      )
    }

  return (
    <div className="interview-page">

      <div className="dashboard">

        {/* ================= LEFT SIDEBAR ================= */}

        <aside className="sidebar">

          <div className="logo">
            InterviewAI
          </div>

          <div className="menu">

            <div
              className={activeMenu === "technical" ? "item active" : "item"}
              onClick={() => {
                setActiveMenu("technical");
                setOpenQuestion(null);
              }}
            >
              <FiCode />
              <span>Technical Questions</span>
            </div>

            <div
              className={activeMenu === "behavioral" ? "item active" : "item"}
              onClick={() => {
                setActiveMenu("behavioral");
                setOpenQuestion(null);
              }}
            >
              <FiUsers />
              <span>Behavioral Questions</span>
            </div>

            <div
              className={activeMenu === "roadmap" ? "item active" : "item"}
              onClick={() => {
                setActiveMenu("roadmap");
                setOpenQuestion(null);
              }}
            >
              <FiMap />
              <span>Preparation Plan</span>
            </div>

          </div>

          {/* Download Button */}

  <div className="sidebar-footer">

    <button
      className="download-btn"
      onClick={() => getResumePdf(report._id)}
    >
       <FiDownload />
      {/* <svg height={"0.2 rem"} style={{marginRight:"0.2 rem"
      }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg> */}
      <span>Download Resume</span>
    </button>

  </div>

        </aside>

        {/* ================= CENTER ================= */}

        <main className="content">

          <div className="page-title">

            <h2>

              {activeMenu === "technical" && "Technical Questions"}

              {activeMenu === "behavioral" && "Behavioral Questions"}

              {activeMenu === "roadmap" && "Preparation Plan"}

            </h2>

            <div className="count">

              {activeMenu === "technical" && `${technical.length} Questions`}

              {activeMenu === "behavioral" && `${behavioral.length} Questions`}

              {activeMenu === "roadmap" && `${roadmap.length} Days`}

            </div>

          </div>

          <div className="cards">

            {
              activeMenu !== "roadmap" ? (

                questions.map((item, index) => {

                  

                  return (

                    <div className="question-card" key={index}>

                      <div
                        className="question-header"
                        onClick={() =>
                          setOpenQuestion(
                            openQuestion === index ? null : index
                          )
                        }
                      >

                        <div className="question-left">

                          <div className="badge">

                            Q{index + 1}

                          </div>

                          <h3>

                            {item.question}

                          </h3>

                        </div>

                        <div className="arrow">

                          {
                            openQuestion === index ?

                              <FiChevronUp />

                              :

                              <FiChevronDown />
                          }

                        </div>

                      </div>

                      {

                        openQuestion === index && (

                          <div className="question-body">

                            <div className="answer-box">

                              <span className="label purple">

                                INTENTION

                              </span>

                              <p>

                                {item.intention}

                              </p>

                            </div>

                            <div className="answer-box">

                              <span className="label green">

                                MODEL ANSWER

                              </span>

                              <p>

                                {item.answer}

                              </p>

                            </div>

                          </div>

                        )

                      }

                    </div>

                  );

                })

              ) : (

                roadmap.map((day, index) => {

                  

                  return (

                    <div className="roadmap" key={index}>

                      <div className="day">

                        Day {day.day}

                      </div>

                      <h3>

                        {day.focus}

                      </h3>

                      <ul>

                        {(day.tasks || []).map((task, i) => (

                          <li key={i}>

                            {task}

                          </li>

                        ))}

                      </ul>

                    </div>

                  );

                })

              )

            }

          </div>

        </main>

        {/* ================= RIGHT PANEL ================= */}

        <aside className="analysis">

           <div className="analysis-header">
    <Dropdown />
  </div>

          <div className="score-card">

            <h4>

              Overall Match

            </h4>

            <div className="circle">

<svg width="170" height="170">

<circle
className="track"
cx="85"
cy="85"
r={radius}
/>

<circle
className="progress"
cx="85"
cy="85"
r={radius}
strokeDasharray={circumference}
strokeDashoffset={offset}
/>

</svg>

<div className="score-text">

<div className="score-number">

{matchScore}

<span>%</span>

</div>

</div>

</div>

            <p>
  {matchScore >= 80
    ? "Excellent Match"
    : matchScore >= 60
    ? "Good Match"
    : matchScore >= 40
    ? "Average Match"
    : "Needs Improvement"}
</p>

          </div>

          <div className="skill-card">

            <h4>

              <FiTrendingUp />

              Skill Gaps

            </h4>

            <div className="skills">

              {

                report?.skillGaps?.map((skill, index) => {

                  

                  return (

                    <span
                      key={index}
                      className={skill.severity}
                    >

                      { skill.skill}

                    </span>

                  );

                })

              }

            </div>

          </div>

        </aside>

      </div>

    </div>
  );

};

export default Interview;