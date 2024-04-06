"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([
    {
      rank: 1,
      address: "0x1234567890123456789012345678901234567890",
      points: 1000,
    },
    {
      rank: 2,
      address: "0x1234567890123456789012345678901234567890",
      points: 900,
    },
    {
      rank: 3,
      address: "0x1234567890123456789012345678901234567890",
      points: 800,
    },
    {
      rank: 4,
      address: "0x1234567890123456789012345678901234567890",
      points: 700,
    },
    {
      rank: 5,
      address: "0x1234567890123456789012345678901234567890",
      points: 600,
    },
    {
      rank: 6,
      address: "0x1234567890123456789012345678901234567890",
      points: 500,
    },
    {
      rank: 7,
      address: "0x1234567890123456789012345678901234567890",
      points: 400,
    },
    {
      rank: 8,
      address: "0x1234567890123456789012345678901234567890",
      points: 300,
    },
    {
      rank: 9,
      address: "0x1234567890123456789012345678901234567890",
      points: 200,
    },
    {
      rank: 10,
      address: "0x1234567890123456789012345678901234567890",
      points: 100,
    },
    {
      rank: 11,
      address: "0x1234567890123456789012345678901234567890",
      points: 90,
    },
    {
      rank: 12,
      address: "0x1234567890123456789012345678901234567890",
      points: 80,
    },
    {
      rank: 13,
      address: "0x1234567890123456789012345678901234567890",
      points: 70,
    },
    {
      rank: 14,
      address: "0x1234567890123456789012345678901234567890",
      points: 60,
    },
    {
      rank: 15,
      address: "0x1234567890123456789012345678901234567890",
      points: 50,
    },
    {
      rank: 16,
      address: "0x1234567890123456789012345678901234567890",
      points: 40,
    },
    {
      rank: 17,
      address: "0x1234567890123456789012345678901234567890",
      points: 30,
    },
    {
      rank: 18,
      address: "0x1234567890123456789012345678901234567890",
      points: 20,
    },
    {
      rank: 19,
      address: "0x1234567890123456789012345678901234567890",
      points: 10,
    },
    {
      rank: 20,
      address: "0x1234567890123456789012345678901234567890",
      points: 1,
    },
  ]);

  useEffect(() => {
    // TODO: Fetch leaderboard data from the smart contract
    // and update the leaderboard state
    // setLeaderboard([...]);
  }, []);

  return (
    <>
      <Header />
      <h2 className="text-center text-3xl font-bold my-12">Leaderboard</h2>

      <ul className="flex flex-col w-full max-w-5xl mx-auto my-12 space-y-px">
        <li className="w-full bg-slate-800 text-white py-2 rounded">
          <div className="flex">
            <span className="w-24 text-center">Rank</span>
            <span className="flex-1">Address</span>
            <span className="w-32 text-center">Points</span>
          </div>
        </li>
        {leaderboard.map((entry) => (
          <li
            key={entry.rank}
            className="w-full py-2 odd:bg-slate-100 even:white rounded"
          >
            <div className="flex">
              <span className="w-24 text-center">{entry.rank}</span>
              <span className="flex-1">{entry.address}</span>
              <span className="w-32 text-center">{entry.points}</span>
            </div>
          </li>
        ))}
      </ul>

      <Footer />
    </>
  );
}

export default Leaderboard;
