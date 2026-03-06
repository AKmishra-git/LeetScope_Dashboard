import React, { useState } from "react";

const Bottom = (props) => {
  const [active, setActive] = useState(null);

  // Safe user reference
  const user = props.user || {};

  const now = Math.floor(Date.now() / 1000);
  const todayKey = Math.floor(now / 86400) * 86400;

  const calendar = user.submissionCalendar || {};

  const solvedToday = calendar[todayKey] || 0;

  // ---------- BURNOUT INDEX ----------
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const day = Math.floor((now - i * 86400) / 86400) * 86400;
    return calendar[day] || 0;
  }).reduce((a, b) => a + b, 0);

  const prev30 = Array.from({ length: 30 }, (_, i) => {
    const day = Math.floor((now - (i + 30) * 86400) / 86400) * 86400;
    return calendar[day] || 0;
  }).reduce((a, b) => a + b, 0);

  const burnoutDiff = Math.abs(last30 - prev30);
  const isRamping = last30 >= prev30;
  const burnoutTrend = isRamping ? "Ramping Up 🔥" : "Cooling Down ❄️";
  const burnoutColor = isRamping ? "text-emerald-400" : "text-blue-400";

  const burnoutSubtext =
    last30 === prev30
      ? "Same pace as the previous 30 days"
      : isRamping
      ? `+${burnoutDiff} more submissions than previous 30 days`
      : `${burnoutDiff} fewer submissions than previous 30 days`;

  return (
    <>
      {/* MAIN SECTION */}
      <div
        className="w-full h-[400px] mt-[10px] rounded-xl px-4 py-4 flex justify-around
        bg-[radial-gradient(800px_circle_at_20%_20%,rgba(0,255,200,0.08),transparent_40%),radial-gradient(600px_circle_at_80%_0%,rgba(0,100,255,0.08),transparent_35%),linear-gradient(180deg,#0b0f14,#121826)]
        border border-white/10"
      >
        {/* Today's Submissions */}
        <div
          onClick={() => setActive("today")}
          className="w-[46%] h-full cursor-pointer 
          bg-[#0f172a]/75 backdrop-blur-md 
          rounded-2xl border border-white/10 
          py-6 px-6
          shadow-[0_8px_30px_rgba(0,0,0,0.6)]
          flex flex-col transition-all duration-300 hover:scale-[1.03]"
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

        {/* Burnout Index */}
        <div
          onClick={() => setActive("burnout")}
          className="w-[46%] h-full cursor-pointer 
          bg-[#0f172a]/75 backdrop-blur-md 
          rounded-2xl border border-white/10 
          py-6 px-6
          shadow-[0_8px_30px_rgba(0,0,0,0.6)]
          flex flex-col transition-all duration-300 hover:scale-[1.03]"
        >
          <p className="text-xl uppercase tracking-widest text-white">
            Burnout Index
          </p>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h1 className={`text-4xl font-semibold ${burnoutColor}`}>
              {burnoutTrend}
            </h1>
            <p className="mt-6 text-sm text-gray-400">
              {burnoutSubtext}
            </p>
            <div className="mt-6 flex gap-6 text-sm">
              <div className="flex flex-col items-center">
                <span className="text-white/50 mb-1">Last 30 days</span>
                <span className="text-2xl font-semibold text-white">{last30}</span>
              </div>
              <div className="w-px bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-white/50 mb-1">Prev 30 days</span>
                <span className="text-2xl font-semibold text-white">{prev30}</span>
              </div>
            </div>
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

            {active === "burnout" && (
              <>
                <p className="text-2xl text-white uppercase tracking-widest mb-6">
                  Burnout Index
                </p>
                <h1 className={`text-[60px] font-semibold ${burnoutColor}`}>
                  {burnoutTrend}
                </h1>
                <div className="mt-8 flex gap-10">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-lg">Last 30 days</span>
                    <span className="text-5xl font-semibold text-white mt-2">
                      {last30}
                    </span>
                    <span className="text-gray-500 text-sm mt-1">submissions</span>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-lg">Previous 30 days</span>
                    <span className="text-5xl font-semibold text-white mt-2">
                      {prev30}
                    </span>
                    <span className="text-gray-500 text-sm mt-1">submissions</span>
                  </div>
                </div>
                <p className="text-gray-400 text-lg mt-8">{burnoutSubtext}</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Bottom;