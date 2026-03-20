import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(props.username || "");
  const navigate = useNavigate();

  useEffect(() => {
    setInput(props.username || "");
  }, [props.username]);

  const user = props.user || {};

  const totalSubmissions = Object.values(
    user.submissionCalendar || {}
  ).reduce((sum, v) => sum + Number(v), 0);

  return (
    <div
      className="w-full rounded-2xl 
      bg-[#0f172a]/75 
      backdrop-blur-md 
      border border-white/10 
      shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(255,255,255,0.12)] 
      px-4 py-4 
      flex flex-col md:flex-row md:justify-around md:items-center gap-4"
    >
      {/* Top row on mobile: profile + compare button */}
      <div className="flex items-center justify-between md:block">

        {/* PROFILE + DROPDOWN */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-2 py-1 cursor-pointer select-none"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
              alt="LeetCode"
              className="w-7 h-7 object-contain"
            />
            <h1 className="text-gray-200 text-xl md:text-3xl font-semibold tracking-wide flex items-center gap-2">
              {props.username || "Select User"}
              <span className="text-gray-400 text-base">▾</span>
            </h1>
          </div>

          {/* Dropdown */}
          {open && (
            <div
              className="absolute mt-1 left-0 md:right-0 md:left-auto w-[260px] 
              bg-[#0f172a]/90 backdrop-blur-md 
              border border-white/10 
              rounded-xl p-4 
              shadow-[0_0_20px_rgba(0,0,0,0.6)] z-50"
            >
              <p className="text-gray-400 text-sm mb-2">LeetCode username</p>
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
          <div className="mt-2 px-3 py-1 rounded-lg bg-emerald-400/10 border border-emerald-400/30 inline-flex items-center">
            <span className="text-emerald-400 text-sm md:text-lg font-semibold">
              Global Rank: {user.ranking ?? "--"}
            </span>
          </div>
        </div>

        {/* Compare Button — visible on mobile top row */}
        <button
          onClick={() => navigate("/compare")}
          className="md:hidden px-4 py-2 rounded-xl 
          bg-emerald-400/10 
          border border-emerald-400/30 
          text-emerald-400 font-semibold text-sm
          hover:bg-emerald-400/20 transition"
        >
          Compare
        </button>
      </div>

      {/* Stats row */}
      <div className="flex flex-row gap-3 md:contents">

        {/* Questions Solved */}
        <div
          className="flex-1 md:w-[220px] md:flex-none p-3 md:p-4 rounded-xl 
          bg-[#0f172a]/75 backdrop-blur-md 
          border border-white/10 
          shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_30px_rgba(0,0,0,0.6)]"
        >
          <h1 className="text-xs md:text-sm text-emerald-500 tracking-wide font-semibold">
            Questions Solved
          </h1>
          <p className="mt-1 md:mt-2 text-2xl md:text-3xl font-semibold text-white">
            {user.totalSolved ?? "--"}
          </p>
        </div>

        {/* Total Submissions */}
        <div
          className="flex-1 md:w-[220px] md:flex-none
          bg-[#0f172a]/75 backdrop-blur-md 
          border border-white/10 p-3 md:p-5 rounded-xl  
          shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_30px_rgba(0,0,0,0.6)]"
        >
          <h1 className="text-xs md:text-lg tracking-wide font-semibold text-emerald-500">
            Submissions (All Time)
          </h1>
          <h3 className="mt-1 md:mt-3 text-2xl md:text-4xl font-semibold text-white">
            {totalSubmissions || "--"}
          </h3>
        </div>
      </div>

      {/* Compare Button — hidden on mobile, visible on desktop */}
      <button
        onClick={() => navigate("/compare")}
        className="hidden md:block px-6 py-3 rounded-xl 
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