import React from "react";

const Section = (props) => {
  const TOTAL_USERS = 25000000;

  const user = props.user ?? {};

  // ---------- GLOBAL PERCENTILE ----------
  const ranking = Number(user.ranking);
  const percentile = Number.isFinite(ranking)
    ? (1 - ranking / TOTAL_USERS) * 100
    : 0;

  // ---------- MAX STREAK ----------
  const calendar = user.submissionCalendar ?? {};

  const days = Object.keys(calendar)
    .map(Number)
    .sort((a, b) => a - b);

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

  // ---------- SAFE HELPERS ----------
  const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const safePct = (solved, total) =>
    total > 0 ? Math.min((solved / total) * 100, 100) : 0;

  // ---------- DIFFICULTY ----------
  const easySolved = safeNum(user.easySolved);
  const totalEasy = safeNum(user.totalEasy);
  const mediumSolved = safeNum(user.mediumSolved);
  const totalMedium = safeNum(user.totalMedium);
  const hardSolved = safeNum(user.hardSolved);
  const totalHard = safeNum(user.totalHard);

  const easyPct = safePct(easySolved, totalEasy);
  const mediumPct = safePct(mediumSolved, totalMedium);
  const hardPct = safePct(hardSolved, totalHard);

  // ---------- CONSISTENCY SCORE ----------
  const totalDaysActive = Object.keys(calendar).filter(
    (k) => Number(calendar[k]) > 0
  ).length;

  const firstDay = days.length > 0 ? days[0] : null;
  const now = Math.floor(Date.now() / 1000);
  const totalDaysSinceStart = firstDay
    ? Math.max(1, Math.floor((now - firstDay) / ONE_DAY))
    : 365;

  const consistencyScore = (
    (totalDaysActive / totalDaysSinceStart) * 100
  ).toFixed(1);

  return (
    <div
      className="w-full mt-4 rounded-xl px-3 md:px-5 py-4
      flex flex-col gap-4
      bg-[#0b0f14]
      border border-white/10
      shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_60px_rgba(0,255,200,0.08),0_0_120px_rgba(0,100,255,0.06)]"
    >
      {/* Row 1 */}
      <div className="w-full flex flex-col sm:flex-row gap-4">

        {/* Global Percentile */}
        <div className="flex-1 bg-[#0f172a]/75 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.6)] px-4 md:px-5 py-5 md:py-6 flex flex-col justify-between hover:scale-[1.02] transition min-h-[140px]">
          <h1 className="text-sm md:text-xl uppercase tracking-widest text-white">
            Global Percentile
          </h1>
          <div>
            <h1 className="text-3xl md:text-5xl font-semibold text-white">
              Top {(100 - percentile).toFixed(2)}%
            </h1>
            <p className="mt-2 text-xs md:text-sm text-gray-400">
              Better than {percentile.toFixed(2)}% of users
            </p>
          </div>
        </div>

        {/* Consistency Score */}
        <div className="flex-1 bg-[#0f172a]/75 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.6)] px-4 md:px-5 py-5 md:py-6 flex flex-col justify-between hover:scale-[1.02] transition min-h-[140px]">
          <h1 className="text-sm md:text-xl uppercase tracking-widest text-white">
            Consistency Score
          </h1>
          <div>
            <h1 className="text-3xl md:text-5xl font-semibold text-green-400">
              {consistencyScore}%
            </h1>
            <p className="mt-2 text-xs md:text-sm text-gray-400">
              Active {totalDaysActive} of {totalDaysSinceStart} days since joining
            </p>
          </div>
        </div>

      </div>

      {/* Row 2 */}
      <div className="w-full flex flex-col sm:flex-row gap-4">

        {/* Max Streak */}
        <div className="flex-1 bg-[#0f172a]/75 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.6)] px-4 md:px-5 py-5 md:py-6 flex flex-col justify-between relative hover:scale-[1.02] transition min-h-[160px]">
          <p className="text-sm md:text-lg uppercase tracking-widest text-white">
            Max Streak
          </p>
          <div>
            <h1 className="flex items-end gap-2">
              <span className="text-5xl md:text-6xl font-semibold text-white">
                {maxStreak}
              </span>
              <span className="text-base md:text-lg text-green-400 lowercase mb-1">
                days
              </span>
            </h1>
            <p className="mt-2 text-xs md:text-sm text-gray-400">
              Longest consecutive solving streak
            </p>
          </div>

          <div className="absolute top-4 right-4 w-14 h-14 md:w-20 md:h-20 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)]">
            <i className="ri-fire-line text-orange-400 text-[36px] md:text-[56px]"></i>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="flex-1 bg-[#0f172a]/75 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.6)] px-4 md:px-5 py-5 md:py-6 flex flex-col justify-between hover:scale-[1.02] transition min-h-[160px]">
          <p className="text-sm md:text-lg uppercase tracking-widest text-white">
            Difficulty Breakdown
          </p>

          <div className="flex flex-col gap-3 md:gap-4 mt-2">
            {/* Easy */}
            <div>
              <div className="flex justify-between text-xs md:text-sm mb-1">
                <span className="text-emerald-400">Easy</span>
                <span className="text-white">{easySolved} / {totalEasy}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded">
                <div className="h-2 bg-emerald-400 rounded" style={{ width: `${easyPct}%` }} />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between text-xs md:text-sm mb-1">
                <span className="text-yellow-400">Medium</span>
                <span className="text-white">{mediumSolved} / {totalMedium}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded">
                <div className="h-2 bg-yellow-400 rounded" style={{ width: `${mediumPct}%` }} />
              </div>
            </div>

            {/* Hard */}
            <div>
              <div className="flex justify-between text-xs md:text-sm mb-1">
                <span className="text-red-400">Hard</span>
                <span className="text-white">{hardSolved} / {totalHard}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded">
                <div className="h-2 bg-red-400 rounded" style={{ width: `${hardPct}%` }} />
              </div>
            </div>
          </div>

          <p className="text-xs md:text-sm text-gray-400 mt-3">
            Your progress across all LeetCode difficulties
          </p>
        </div>

      </div>
    </div>
  );
};

export default Section;