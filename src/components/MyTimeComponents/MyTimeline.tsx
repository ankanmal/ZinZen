/* eslint-disable react/jsx-key */
import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "react-bootstrap-icons";

import { darkModeState, displayToast } from "@src/store";
import { ITask } from "@src/Interfaces/Task";

import "./MyTimeline.scss";

export const MyTimeline = ({ myTasks }: { myTasks: { scheduled: ITask[], impossible: ITask[], freeHrsOfDay: number, scheduledHrs: number }}) => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [showScheduled, setShowScheduled] = useState(true);
  const [displayOptionsIndex, setDisplayOptionsIndex] = useState("root");

  const setShowToast = useSetRecoilState(displayToast);

  const handleView = () => { setShowScheduled(!showScheduled); };

  const handleActionClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setShowToast({ open: true, message: "Consider donating...", extra: "Feature coming soon..." });
  };
  return (
    <>
      {myTasks.impossible.length > 0 && (
        <div className={`timeline-view${darkModeStatus ? "-dark" : ""}`}>
          <button type="button" className={`${showScheduled && "activeView"}`} onClick={handleView}>Scheduled</button>
          <button type="button" className={`${!showScheduled && "activeView"}`} onClick={handleView}>Impossible</button>
        </div>
      )}
      <div className={`MTL-display${darkModeStatus ? "-dark" : ""}`}>
        { myTasks[showScheduled ? "scheduled" : "impossible"].map((task) => {
          const startTime = task.start ? task.start.split("T")[1].slice(0, 2) : null;
          const endTime = task.deadline ? task.deadline.split("T")[1].slice(0, 2) : null;
          return (
            <button
              type="button"
              style={displayOptionsIndex !== task.goalid ? { cursor: "pointer" } : {}}
              onClick={() => {
                if (displayOptionsIndex !== task.goalid) {
                  setDisplayOptionsIndex(task.goalid);
                } else setDisplayOptionsIndex("");
              }}
            >
              <div style={{ display: "flex", position: "relative" }}>
                <button
                  type="button"
                  className="MTL-circle"
                  style={{ backgroundColor: `${task.goalColor}` }}
                >.
                </button>
                <div style={{ marginLeft: "11px", color: `${task.goalColor}` }}>
                  <button
                    type="button"
                    className="MTL-taskTitle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDisplayOptionsIndex(task.goalid);
                      if (displayOptionsIndex === task.goalid) {
                        navigate("/MyGoals", { state: { isRootGoal: task.parentGoalId === "root", openGoalOfId: task.goalid } });
                      }
                    }}
                  >
                    {task.title}
                  </button>
                  <p className="MTL-goalTiming">
                    {startTime ? `${startTime}:00` : ""}-{endTime ? `${endTime}:00` : ""}
                  </p>
                </div>

                { displayOptionsIndex === task.goalid && (
                  <button
                    type="button"
                    onClick={() => setDisplayOptionsIndex("")}
                    className={`MyTime-expand-btw${darkModeStatus ? "-dark" : ""} task-dropdown${darkModeStatus ? "-dark" : ""}`}
                  > <div><ChevronDown /></div>
                  </button>
                )}
              </div>
              { displayOptionsIndex === task.goalid ? (
                <div className="MTL-options">
                  <button type="button" onClick={handleActionClick}> Forget</button><div />
                  <button type="button" onClick={handleActionClick}> Reschedule</button><div />
                  <button type="button" onClick={handleActionClick}> Done</button><div />
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </>
  );
};
