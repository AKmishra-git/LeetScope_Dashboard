import React from "react";

const Section = (props) => {
  const TOTAL_USERS = 25000000;

  const percentile = ((1 - props.user.ranking / TOTAL_USERS) * 100).toFixed(2);

  // -------- Max streak --------
  const days = Object.keys(props.user.submissionCalendar || {})
    .map((ts) => Number(ts))
    .sort((a, b) => a - b);

  const totalSubmissions = Object.values(props.user.submissionCalendar || {})
    .reduce((sum, v) => sum + v, 0);

  const ONE_DAY = 86400;
  let maxStreak = 0;
  let currentStreak = 0;

  for (let i = 0; i < days.length; i++) {
    if (i === 0 || days[i] === days[i - 1] + ONE_DAY) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    maxStreak = Math.max(maxStreak, currentStreak);
  }

  // -------- Difficulty % --------
  const easyPct = (props.user.easySolved / props.user.totalEasy) * 100;
  const mediumPct = (props.user.mediumSolved / props.user.totalMedium) * 100;
  const hardPct = (props.user.hardSolved / props.user.totalHard) * 100;

  return (
    <div
      className="h-[550px] w-full mt-4 rounded-xl px-5 py-2
      flex flex-col justify-center gap-6
      bg-[#0b0f14]
      border border-white/10
      shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_60px_rgba(0,255,200,0.08),0_0_120px_rgba(0,100,255,0.06)]"
    >
      {/* Row 1 */}
      <div className="h-[48%] w-full p-3 flex justify-around cursor-pointer">
        {/* Global Percentile */}
        <div className="w-[48%] h-full bg-[#0f172a]/75 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.6)] px-5 py-6 flex flex-col justify-between hover:scale-[1.05] transition">
          <h1 className="text-xl uppercase tracking-widest text-white">
            Global Percentile
          </h1>
          <div>
            <h1 className="text-5xl font-semibold text-white">
              Top {(100 - percentile).toFixed(2)}%
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Better than {percentile}% of users
            </p>
          </div>
        </div>

        {/* Clean Solve Rate */}
        <div className="w-[48%] h-full bg-[#0f172a]/75 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.6)] px-5 py-6 flex flex-col justify-between hover:scale-[1.05] transition">
          <h1 className="text-xl uppercase tracking-widest text-white">
            Clean Solve Rate
          </h1>
          <div>
            <h1 className="text-5xl font-semibold text-green-400">
             {((props.user.totalSolved / totalSubmissions) * 100).toFixed(2)}%

            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Based on all submissions
            </p>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="h-[48%] w-full p-3 flex justify-around cursor-pointer">
        {/* Max Streak */}
        <div className="w-[48%] h-full bg-[#0f172a]/75 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.6)] px-5 py-6 flex flex-col justify-between relative hover:scale-[1.05] transition">
          <p className="text-lg uppercase tracking-widest text-white ">
            Max Streak
          </p>
          <div>
            <h1 className="flex items-end gap-2">
              <span className="text-6xl font-semibold text-white">
                {maxStreak}
              </span>
              <span className="text-lg text-green-400 lowercase">days</span>
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Longest consecutive solving streak
            </p>
          </div>

          <div className="absolute top-5 right-5 w-20 h-20 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)]">
            <i className="ri-fire-line text-orange-400 text-[56px]"></i>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="w-[48%] h-full bg-[#0f172a]/75 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.6)] px-5 py-6 flex flex-col justify-between hover:scale-[1.05] transition">
          <p className="text-lg uppercase tracking-widest text-white">
            Difficulty Breakdown
          </p>

          <div className="flex flex-col gap-4 mt-2">
            {/* Easy */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-emerald-400">Easy</span>
                <span className="text-white">
                  {props.user.easySolved} / {props.user.totalEasy}
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded">
                <div
                  className="h-2 bg-emerald-400 rounded"
                  style={{ width: `${easyPct}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-yellow-400">Medium</span>
                <span className="text-white">
                  {props.user.mediumSolved} / {props.user.totalMedium}
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded">
                <div
                  className="h-2 bg-yellow-400 rounded"
                  style={{ width: `${mediumPct}%` }}
                />
              </div>
            </div>

            {/* Hard */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-400">Hard</span>
                <span className="text-white">
                  {props.user.hardSolved} / {props.user.totalHard}
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded">
                <div
                  className="h-2 bg-red-400 rounded"
                  style={{ width: `${hardPct}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            Your progress across all LeetCode difficulties
          </p>
        </div>
      </div>
    </div>
  );
};

export default Section;
