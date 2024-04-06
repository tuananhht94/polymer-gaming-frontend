import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Header = () => {
  return (
    <header className="flex flex-wrap items-center justify-between p-4">
      <h1 className="text-2xl font-bold tracking-tight">
        <Link href="/">Gaming dApp</Link>
      </h1>
      <ul className="flex flex-wrap gap-x-16">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/points">Points</Link>
        </li>
        <li>
          <Link href="/nft">NFT</Link>
        </li>
        <li>
          <Link href="/leaderboard">Leaderboard</Link>
        </li>
      </ul>
      <div>
        <ConnectButton showBalance={false} />
      </div>
    </header>
  )
}

export default Header
