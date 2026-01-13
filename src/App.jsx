import React, { useEffect } from 'react'
import Header from './components/Header.jsx'
import Section from './components/Section.jsx'
import Bottom from './components/Bottom.jsx'
import { useState } from 'react'
import axios from "axios"

const App = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

  const getData = async () => {
    try {
      const response = await axios.get(
      `https://leetcode-stats-api.herokuapp.com/${username}`
    );
    console.log(response.data);
    setUser(response.data);
    }catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  },  [username]);





  return (
  <div>
    {!user ? (
      <div className="text-white p-10">Loading...</div>
    ) : (
      <>
        <Header user={user} username={username} setUsername={setUsername} />
        <Section user={user} />
        <Bottom user={user} />
      </>
    )}
  </div>
);

}

export default App