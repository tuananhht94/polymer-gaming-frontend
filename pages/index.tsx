'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

function App() {
  return (
    <>
      <Header />

      <div className="flex h-96 items-center justify-center bg-slate-100 p-12">
        <div className="flex-1 text-center">
          <Link
            href="/points"
            className="rounded-lg bg-black px-4 py-2 text-lg text-white"
          >
            Spin Wheel
          </Link>
        </div>
        <div className="flex-1">
          <h4 className="text-3xl">
            Earn PolyERC20 Tokens through Wheel Spinning
          </h4>
        </div>
      </div>

      <div className="flex h-96 items-center justify-center p-12">
        <div className="flex-1">
          <h4 className="text-3xl">Purchase NFTs with PolyERC20 Tokens</h4>
        </div>
        <div className="flex-1 text-center">
          <Link
            href="/nft"
            className="rounded-lg bg-black px-4 py-2 text-lg text-white"
          >
            Try now
          </Link>
        </div>
      </div>

      <div className="flex h-96 items-center justify-center bg-slate-100 p-12">
        <div className="flex-1 text-center">
          <Link
            href="/leaderboard"
            className="rounded-lg bg-black px-4 py-2 text-lg text-white"
          >
            Check Leaderboard
          </Link>
        </div>
        <div className="flex-1">
          <h4 className="text-3xl">
            Collect NFTs to earn Points and Climb the Leaderboard
          </h4>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default App
