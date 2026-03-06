import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(props.username || "");
  const navigate = useNavigate();

  // Sync input with username
  useEffect(() => {
    setInput(props.username || "");
  }, [props.username]);

  // Safe user reference
  const user = props.user || {};

  // All-time total submissions from merged calendar
  const totalSubmissions = Object.values(
    user.submissionCalendar || {}
  ).reduce((sum, v) => sum + Number(v), 0);

  return (
    <div
      className="w-full h-[200px] rounded-2xl 
      bg-[#0f172a]/75 
      backdrop-blur-md 
      border border-white/10 
      shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(255,255,255,0.12)] 
      px-5 py-5 flex justify-around items-center"
    >
      {/* PROFILE + DROPDOWN */}
      <div className="relative">
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer select-none"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
            alt="LeetCode"
            className="w-8 h-8 object-contain"
          />

          <h1 className="text-gray-200 text-3xl font-semibold tracking-wide flex items-center gap-2">
            {props.username || "Select User"}
            <span className="text-gray-400 text-xl">▾</span>
          </h1>
        </div>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute mt-1 right-0 w-[260px] 
            bg-[#0f172a]/90 backdrop-blur-md 
            border border-white/10 
            rounded-xl p-4 
            shadow-[0_0_20px_rgba(0,0,0,0.6)] z-50"
          >
            <p className="text-gray-400 text-sm mb-2">
              LeetCode username
            </p>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  props.setUsername(input.trim());
                  setOpen(false);
                }
              }}
              type="text"
              placeholder="Enter username"
              className="w-full px-3 py-2 rounded-lg 
              bg-black/40 border border-white/10 
              text-white placeholder:text-gray-500 
              outline-none focus:border-emerald-400/40"
            />

            <button
              onClick={() => {
                if (input.trim()) {
                  props.setUsername(input.trim());
                  setOpen(false);
                }
              }}
              className="mt-3 w-full py-2 rounded-lg 
              bg-emerald-400/10 border border-emerald-400/30 
              text-emerald-400 font-semibold hover:bg-emerald-400/20 transition"
            >
              Load Profile
            </button>
          </div>
        )}

        {/* Ranking badge */}
        <div className="m-4 px-4 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center">
          <span className="text-emerald-400 text-lg font-semibold">
            Global Rank: {user.ranking ?? "--"}
          </span>
        </div>
      </div>

      {/* Questions Solved */}
      <div
        className="w-[220px] p-4 rounded-xl 
        bg-[#0f172a]/75 backdrop-blur-md 
        border border-white/10 
        shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(255,255,255,0.12)]"
      >
        <h1 className="text-sm text-emerald-500 tracking-wide font-semibold">
          Questions Solved
        </h1>
        <p className="mt-2 text-3xl font-semibold text-white">
          {user.totalSolved ?? "--"}
        </p>
      </div>

      {/* Total Submissions (All Time) */}
      <div
        className="h-[90%] w-[220px] 
        bg-[#0f172a]/75 backdrop-blur-md 
        border border-white/10 p-5 rounded-xl  
        shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(255,255,255,0.12)]"
      >
        <h1 className="text-lg tracking-wide font-semibold text-emerald-500">
          Submissions (All Time)
        </h1>
        <h3 className="mt-3 text-4xl font-semibold text-white">
          {totalSubmissions || "--"}
        </h3>
      </div>

      {/* Compare Button */}
      <button
        onClick={() => navigate("/compare")}
        className="px-6 py-3 rounded-xl 
        bg-emerald-400/10 
        border border-emerald-400/30 
        text-emerald-400 font-semibold 
        hover:bg-emerald-400/20 transition"
      >
        Compare
      </button>
    </div>
  );
};

export default Header;