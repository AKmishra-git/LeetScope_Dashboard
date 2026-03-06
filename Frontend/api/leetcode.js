export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "Username is required" });

  try {
    // Step 1: Get CSRF token
    const initRes = await fetch("https://leetcode.com", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const rawCookies = initRes.headers.getSetCookie?.() ?? [];
    let csrfToken = "";
    for (const cookie of rawCookies) {
      const match = cookie.match(/csrftoken=([^;]+)/);
      if (match) {
        csrfToken = match[1];
        break;
      }
    }

    const headers = {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://leetcode.com/",
      Origin: "https://leetcode.com",
      Cookie: `csrftoken=${csrfToken}`,
      "x-csrftoken": csrfToken,
    };

    // Step 2: Fetch profile + stats
    const profileQuery = `
      query getUserProfile($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          username
          profile {
            ranking
            reputation
          }
          contributions {
            points
          }
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
            totalSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    // Step 3: Fetch calendars for all years from 2015 to current year
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = 2015; y <= currentYear; y++) {
      years.push(y);
    }

    const calendarQuery = (year) => `
      query getUserCalendar($username: String!) {
        matchedUser(username: $username) {
          userCalendar(year: ${year}) {
            submissionCalendar
          }
        }
      }
    `;

    // Fire profile + all calendar year requests in parallel
    const [profileRes, ...calendarResponses] = await Promise.all([
      fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers,
        body: JSON.stringify({ query: profileQuery, variables: { username } }),
      }),
      ...years.map((year) =>
        fetch("https://leetcode.com/graphql", {
          method: "POST",
          headers,
          body: JSON.stringify({
            query: calendarQuery(year),
            variables: { username },
          }),
        })
      ),
    ]);

    const profileData = await profileRes.json();

    if (profileData.errors || !profileData.data?.matchedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Parse and merge all calendar years into one object
    const calendarDataArr = await Promise.all(
      calendarResponses.map((r) => r.json())
    );

    let mergedCalendar = {};
    for (const calData of calendarDataArr) {
      try {
        const raw =
          calData.data?.matchedUser?.userCalendar?.submissionCalendar ?? "{}";
        const parsed = JSON.parse(raw);
        mergedCalendar = { ...mergedCalendar, ...parsed };
      } catch {
        // skip years with no data
      }
    }

    const u = profileData.data.matchedUser;
    const allQ = profileData.data.allQuestionsCount;

    const getAC = (diff) =>
      u.submitStats.acSubmissionNum.find((x) => x.difficulty === diff)?.count ?? 0;

    const getQCount = (diff) =>
      allQ.find((x) => x.difficulty === diff)?.count ?? 0;

    const normalized = {
      username: u.username,
      ranking: u.profile.ranking ?? 0,
      reputation: u.profile.reputation ?? 0,
      contributionPoints: u.contributions?.points ?? 0,
      totalSolved: getAC("All"),
      easySolved: getAC("Easy"),
      totalEasy: getQCount("Easy"),
      mediumSolved: getAC("Medium"),
      totalMedium: getQCount("Medium"),
      hardSolved: getAC("Hard"),
      totalHard: getQCount("Hard"),
      submissionCalendar: mergedCalendar,
    };

    return res.status(200).json(normalized);
  } catch (err) {
    console.error("LeetCode proxy error:", err);
    return res.status(500).json({ error: "Failed to fetch from LeetCode" });
  }
}