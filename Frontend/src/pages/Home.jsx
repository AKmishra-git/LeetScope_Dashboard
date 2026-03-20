import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Section from "../components/Section.jsx";
import Bottom from "../components/Bottom.jsx";

const Home = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getData = async () => {
    if (!username) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/leetcode?username=${username}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "User not found. Please check the username.");
        setUser(null);
        return;
      }

      setUser(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Please try again.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [username]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0f1a] to-black px-3 md:px-6 py-4 md:py-6">
      <Header
        user={user}
        username={username}
        setUsername={setUsername}
      />

      {loading && (
        <p className="text-center text-white/60 mt-6 text-base md:text-lg">
          Fetching profile data...
        </p>
      )}

      {error && (
        <p className="text-center text-red-400 mt-6 text-base md:text-lg">{error}</p>
      )}

      {!loading && (
        <>
          <Section user={user} />
          <Bottom user={user} />
        </>
      )}
    </div>
  );
};

export default Home;