import React, { useState } from "react";

const Bottom = (props) => {
  const [active, setActive] = useState(null);

  const now = Math.floor(Date.now() / 1000);
  const todayKey = Math.floor(now / 86400) * 86400;

  const calendar = props.user.submissionCalendar || {};

  const solvedToday = calendar[todayKey] || 0;

  let past6Days = 0;
  for (let i = 1; i <= 6; i++) {
    const day = todayKey - i * 86400;
    past6Days += calendar[day] || 0;
  }

  const points = props.user.contributionPoints;
  const reputation = props.user.reputation;

  return (
    <>
      {/* MAIN SECTION */}
      <div
        className="w-full h-[400px] mt-[10px] rounded-xl px-4 py-4 flex justify-around
        bg-[radial-gradient(800px_circle_at_20%_20%,rgba(0,255,200,0.08),transparent_40%),radial-gradient(600px_circle_at_80%_0%,rgba(0,100,255,0.08),transparent_35%),linear-gradient(180deg,#0b0f14,#121826)]
        border border-white/10"
      >
        {/* Today */}
        <div
          onClick={() => setActive("today")}
          className="w-[46%] h-full cursor-pointer 
          bg-[#0f172a]/75 backdrop-blur-md 
          rounded-2xl border border-white/10 
          py-6 px-6
          shadow-[0_8px_30px_rgba(0,0,0,0.6)]
          flex flex-col transition-all duration-300 hover:scale-[1.03] cursor-pointer"
        >
          <p className="text-xl uppercase tracking-widest text-white">
            Today's Submissions
          </p>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h1 className="flex items-end gap-2">
              <span className="text-[150px] leading-none font-semibold text-emerald-400">
                {solvedToday}
              </span>
              <span className="text-xl text-gray-400 lowercase mb-2">
                submissions
              </span>
            </h1>

            <p className="mt-4 text-sm text-white">
              {solvedToday > 0
                ? `Streak active — ${solvedToday} submissions today`
                : "No submissions today — keep the streak alive"}
            </p>
          </div>
        </div>

        {/* Community */}
        <div
          onClick={() => setActive("community")}
          className="w-[46%] h-full cursor-pointer 
          bg-[#0f172a]/75 backdrop-blur-md 
          rounded-2xl border border-white/10 
          py-6 px-6
          shadow-[0_8px_30px_rgba(0,0,0,0.6)]
          flex flex-col transition-all duration-300 hover:scale-[1.03]"
        >
          <p className="text-xl uppercase tracking-widest text-white">
            Total Points
          </p>

          <div className="flex flex-1 flex-col items-center justify-center">
            <h1 className="flex items-end gap-2">
              <span className="text-[150px] leading-none font-semibold text-emerald-400">
                {points}
              </span>
              <span className="text-4xl text-gray-400 lowercase mb-2">
                points
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* OVERLAY */}
      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[60%] h-[60%] 
            bg-[#0f172a]/90 backdrop-blur-md 
            rounded-3xl border border-white/10 
            p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            {active === "today" && (
              <>
                <p className="text-2xl text-white uppercase tracking-widest mb-6">
                  Today's Submissions
                </p>

                <h1 className="text-[120px] text-emerald-400 font-semibold">
                  {solvedToday}
                </h1>

                <p className="text-gray-400 text-lg mt-4">
                  AC submissions made today
                </p>
              </>
            )}

            {active === "community" && (
              <>
                <p className="text-2xl text-white uppercase tracking-widest mb-6">
                  Contribution Points
                </p>

                <h1 className="text-[90px] text-emerald-400 font-semibold">
                  {points} Points
                </h1>

                <p className="text-gray-400 text-xl mt-4">
                  Reputation: {reputation}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Bottom;
