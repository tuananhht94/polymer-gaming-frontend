'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { polymer } from '@/config/polymer'
import xGamingAbi from '@/abis/XGamingUC.json'
import { useReadContract } from 'wagmi'
import { useEffect, useState } from 'react'
import { optimismSepolia } from 'wagmi/chains'

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<
    {
      rank: number
      address: string
      points: number
    }[]
  >([])
  const { data } = useReadContract({
    abi: xGamingAbi,
    chainId: optimismSepolia.id,
    address: polymer.optimism.portAddr,
    functionName: 'getTopPlayers',
    args: [100],
  })

  useEffect(() => {
    console.log(data)
    if (Array.isArray(data) && data.length === 2) {
      const addresses = data[0]
      const points = data[1]
      setLeaderboard(
        addresses.map((address: string, index: number) => ({
          rank: index + 1,
          address,
          points: Number(points[index]),
        }))
      )
    }
  }, [data])

  return (
    <>
      <Header />
      <h2 className="my-12 text-center text-3xl font-bold">Leaderboard</h2>

      <ul className="mx-auto my-12 flex w-full max-w-5xl flex-col space-y-px px-8">
        <li className="w-full rounded bg-slate-800 py-2 text-white">
          <div className="flex">
            <span className="w-24 text-center">Rank</span>
            <span className="flex-1">Address</span>
            <span className="w-32 text-center">Points</span>
          </div>
        </li>
        {leaderboard.length > 0 &&
          leaderboard.map((entry) => (
            <li
              key={entry.rank}
              className="even:white w-full rounded py-2 odd:bg-slate-100"
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
  )
}

export default Leaderboard
