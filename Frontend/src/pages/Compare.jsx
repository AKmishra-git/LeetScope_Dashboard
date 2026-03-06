import React, { useState } from "react";

/* =======================
   Helpers
======================= */
const safeNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const getTotalSubmissions = (calendar) => {
  if (!calendar) return 0;
  return Object.values(calendar).reduce(
    (sum, count) => sum + Number(count),
    0
  );
};

const TOTAL_USERS = 25_000_000;

const getGlobalPercentile = (ranking) => {
  const r = safeNumber(ranking);
  if (r === 0) return "N/A";
  const percentile = (1 - r / TOTAL_USERS) * 100;
  return `Top ${(100 - percentile).toFixed(2)}%`;
};

const getBalanceScore = (easy, medium, hard) => {
  const e = safeNumber(easy);
  const m = safeNumber(medium);
  const h = safeNumber(hard);
  const mean = (e + m + h) / 3;
  const variance =
    (Math.pow(e - mean, 2) +
      Math.pow(m - mean, 2) +
      Math.pow(h - mean, 2)) /
    3;
  return Math.sqrt(variance);
};

/* =======================
   UI Components
======================= */
const StatRow = ({ label, v1, v2 }) => (
  <div className="grid grid-cols-3 py-3 border-b border-white/10 text-sm">
    <span className="text-white/70">{label}</span>
    <span className="text-center">{v1}</span>
    <span className="text-center">{v2}</span>
  </div>
);

const Insight = ({ label, diff, name1, name2 }) => {
  const value = Math.abs(diff);
  return (
    <li className="list-disc ml-5 text-white/80">
      {diff === 0
        ? `${name1} and ${name2} are equal in ${label}`
        : diff > 0
        ? `${name1} is ahead by ${value} ${label}`
        : `${name2} is ahead by ${value} ${label}`}
    </li>
  );
};

/* =======================
   Main Component
======================= */
const Compare = () => {
  const [u1, setU1] = useState("");
  const [u2, setU2] = useState("");
  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConclusion, setShowConclusion] = useState(false);

  const fetchUsers = async () => {
    if (!u1.trim() || !u2.trim()) {
      setError("Please enter both usernames");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setShowConclusion(false);

      const [res1, res2] = await Promise.all([
        fetch(`/api/leetcode?username=${u1.trim()}`),
        fetch(`/api/leetcode?username=${u2.trim()}`),
      ]);

      const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

      if (!res1.ok || data1.error) {
        setError(`User "${u1}" not found or invalid.`);
        return;
      }
      if (!res2.ok || data2.error) {
        setError(`User "${u2}" not found or invalid.`);
        return;
      }

      setUser1(data1);
      setUser2(data2);
    } catch {
      setError("Failed to fetch comparison data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    setU1("");
    setU2("");
    setUser1(null);
    setUser2(null);
    setError("");
    setShowConclusion(false);
    setLoading(false);
  };

  /* =======================
     INPUT SCREEN
  ======================= */
  if (!user1 || !user2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0f1a] to-black text-white px-6 py-14">
        <h1 className="text-4xl font-semibold text-center mb-12">
          Compare LeetCode Profiles
        </h1>

        <div className="flex flex-col md:flex-row justify-center gap-6 mb-6">
          <input
            placeholder="First username"
            className="bg-black/40 border border-white/10 rounded-xl px-5 py-3 w-full md:w-80 text-white outline-none focus:border-emerald-400/40"
            value={u1}
            onChange={(e) => setU1(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
            disabled={loading}
          />
          <input
            placeholder="Second username"
            className="bg-black/40 border border-white/10 rounded-xl px-5 py-3 w-full md:w-80 text-white outline-none focus:border-emerald-400/40"
            value={u2}
            onChange={(e) => setU2(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
            disabled={loading}
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className={`px-10 py-3 rounded-xl transition text-white
              ${loading ? "bg-white/5 cursor-not-allowed" : "bg-white/10 hover:bg-white/20"}`}
          >
            {loading ? "Comparing..." : "Compare"}
          </button>

          <button
            onClick={handleReload}
            disabled={loading}
            className="px-8 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
          >
            Reload
          </button>
        </div>

        {loading && (
          <p className="text-center text-white/60 mt-6">
            Fetching profile data, please wait...
          </p>
        )}

        {error && (
          <p className="text-center text-red-400 mt-6">{error}</p>
        )}
      </div>
    );
  }

  /* =======================
     Derived Stats
  ======================= */
  const balance1 = getBalanceScore(user1.easySolved, user1.mediumSolved, user1.hardSolved);
  const balance2 = getBalanceScore(user2.easySolved, user2.mediumSolved, user2.hardSolved);

  const diffs = {
    solved: safeNumber(user1.totalSolved) - safeNumber(user2.totalSolved),
    easy: safeNumber(user1.easySolved) - safeNumber(user2.easySolved),
    medium: safeNumber(user1.mediumSolved) - safeNumber(user2.mediumSolved),
    hard: safeNumber(user1.hardSolved) - safeNumber(user2.hardSolved),
    submissions:
      getTotalSubmissions(user1.submissionCalendar) -
      getTotalSubmissions(user2.submissionCalendar),
    balance: balance2 - balance1,
    ranking: safeNumber(user2.ranking) - safeNumber(user1.ranking),
  };

  const wins1 = Object.values(diffs).filter((d) => d > 0).length;
  const wins2 = Object.values(diffs).filter((d) => d < 0).length;

  let verdict = "Both profiles are evenly matched.";
  if (wins1 >= 3) verdict = `${u1} dominates with a high difference.`;
  else if (wins2 >= 3) verdict = `${u2} dominates with a high difference.`;
  else if (wins1 === 2) verdict = `${u1} wins with a moderate difference.`;
  else if (wins2 === 2) verdict = `${u2} wins with a moderate difference.`;
  else if (wins1 === 1) verdict = `${u1} has a slight edge.`;
  else if (wins2 === 1) verdict = `${u2} has a slight edge.`;

  /* =======================
     RESULTS SCREEN
  ======================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0f1a] to-black text-white px-6 py-14">
      <h1 className="text-4xl font-semibold text-center mb-4">
        Compare LeetCode Profiles
      </h1>

      <div className="flex justify-center mb-10">
        <button
          onClick={handleReload}
          className="px-8 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 transition text-sm"
        >
          ← Compare Again
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
        <div className="grid grid-cols-3 mb-6 font-semibold text-sm">
          <span>Metric</span>
          <span className="text-center text-emerald-400">{u1}</span>
          <span className="text-center text-blue-400">{u2}</span>
        </div>

        <StatRow label="Total Solved" v1={user1.totalSolved ?? "--"} v2={user2.totalSolved ?? "--"} />
        <StatRow label="Easy Solved" v1={user1.easySolved ?? "--"} v2={user2.easySolved ?? "--"} />
        <StatRow label="Medium Solved" v1={user1.mediumSolved ?? "--"} v2={user2.mediumSolved ?? "--"} />
        <StatRow label="Hard Solved" v1={user1.hardSolved ?? "--"} v2={user2.hardSolved ?? "--"} />
        <StatRow
          label="Submissions (last year)"
          v1={getTotalSubmissions(user1.submissionCalendar)}
          v2={getTotalSubmissions(user2.submissionCalendar)}
        />
        <StatRow
          label="Global Percentile"
          v1={getGlobalPercentile(user1.ranking)}
          v2={getGlobalPercentile(user2.ranking)}
        />
        <StatRow
          label="Strength Balance (lower = better)"
          v1={balance1.toFixed(2)}
          v2={balance2.toFixed(2)}
        />
      </div>

      <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-semibold mb-4">Insights</h2>

        <ul className="space-y-2 mb-6">
          <Insight label="total solved" diff={diffs.solved} name1={u1} name2={u2} />
          <Insight label="easy problems" diff={diffs.easy} name1={u1} name2={u2} />
          <Insight label="medium problems" diff={diffs.medium} name1={u1} name2={u2} />
          <Insight label="hard problems" diff={diffs.hard} name1={u1} name2={u2} />
          <Insight label="submissions" diff={diffs.submissions} name1={u1} name2={u2} />
          <Insight label="difficulty balance" diff={diffs.balance} name1={u1} name2={u2} />
          <Insight label="ranking positions" diff={diffs.ranking} name1={u1} name2={u2} />
        </ul>

        <div className="text-center">
          <button
            onClick={() => setShowConclusion(true)}
            className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Show Conclusion
          </button>
        </div>

        {showConclusion && (
          <p className="text-center text-white/80 italic mt-4 text-lg">
            {verdict}
          </p>
        )}
      </div>
    </div>
  );
};

export default Compare;