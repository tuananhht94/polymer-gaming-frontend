import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import { optimismSepolia } from 'wagmi/chains'
import { polymer, polymerErc20Address } from '@/config/polymer'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import xGamingAbi from '@/abis/XGamingUC.json'

const Header = () => {
  const account = useAccount()
  const [polyErc20Balance, setPolyErc20Balance] = useState<string>('0')
  const [points, setPoints] = useState<number>(0)
  const [rank, setRank] = useState<number>(0)
  const { data: polyErc20BalanceData } = useReadContract({
    abi: erc20Abi,
    chainId: optimismSepolia.id,
    address: polymerErc20Address,
    functionName: 'balanceOf',
    args: [account?.address!],
  })
  const { data: pointsData } = useReadContract({
    abi: xGamingAbi,
    chainId: optimismSepolia.id,
    address: `0x${polymer.optimism.portAddr}`,
    functionName: 'players',
    args: [account?.address!],
  })

  useEffect(() => {
    if (polyErc20BalanceData) {
      setPolyErc20Balance(ethers.formatEther(polyErc20BalanceData))
    }
  }, [account, polyErc20BalanceData])

  useEffect(() => {
    if (Array.isArray(pointsData)) {
      setPoints(Number(pointsData[0]))
      setRank(Number(pointsData[1]))
    }
  }, [account, pointsData])

  return (
    <header className="flex flex-wrap items-center justify-between p-4">
      <h1 className="mr-6 text-2xl font-bold tracking-tight">
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
      {account.status === 'connected' && (
        <div className="ml-auto">
          <span className="text-lg text-black">
            PolyErc20: {polyErc20Balance}
          </span>
          <span className="text-lg text-black"> | </span>
          <span className="text-lg text-black">Points: {points}</span>
          <span className="text-lg text-black"> | </span>
          <span className="text-lg text-black">
            Rank: {rank ? rank : 'N/A'}
          </span>
        </div>
      )}
      <div className="ml-auto">
        <ConnectButton showBalance={false} />
      </div>
    </header>
  )
}

export default Header
