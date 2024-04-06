'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import abi from '@/abis/nft.json'
import { useAccount } from 'wagmi'

const refunds = [
  {
    variant: 1,
    points: 2,
  },
  {
    variant: 2,
    points: 10,
  },
  {
    variant: 3,
    points: 30,
  },
  {
    variant: 4,
    points: 100,
  },
]

function NFT() {
  const account = useAccount()
  // I have deployed a Dummy NFT Contract: 0x7Bd8afD53eDfedAa6417C635083DEf53c5a03825 on Optimism Sepolia
  // https://sepolia-optimism.etherscan.io/address/0x7Bd8afD53eDfedAa6417C635083DEf53c5a03825#code

  const [section, setSection] = useState('purchase')
  const [loadingForVariant, setLoadingForVariant] = useState([
    false,
    false,
    false,
    false,
  ])
  const [loadingForBurningTokenId, setLoadingForBurningTokenId] = useState<
    number[]
  >([])

  const [nfts, setNfts] = useState([
    {
      variant: 1,
      name: 'NFT 1',
      price: '0.00025',
    },
    {
      variant: 2,
      name: 'NFT 2',
      price: '0.0005',
    },
    {
      variant: 3,
      name: 'NFT 3',
      price: '0.00075',
    },
    {
      variant: 4,
      name: 'NFT 4',
      price: '0.001',
    },
  ])

  const [myNfts, setMyNfts] = useState<any>([])

  useEffect(() => {
    if (account.address) {
      fetchMyNfts()
    }
  }, [account.address])

  const fetchMyNfts = async () => {
    // As I have a helper function `getUserOwnedTokens(addr)` defined in the smart contract
    // So I can fetch the tokenIds of the NFTs owned by the user directly

    try {
      const provider = new ethers.BrowserProvider(window.ethereum!)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        '0x7Bd8afD53eDfedAa6417C635083DEf53c5a03825',
        abi,
        signer
      )

      if (signer) {
        const tokenIds = await contract.getUserOwnedTokens(signer.getAddress())

        // fetch variant of each token
        const variants = await Promise.all(
          tokenIds.map((id: number) => contract.tokenVariants(id))
        )

        // map tokenIds to variant
        const nfts = tokenIds.map((id: number, index: number) => ({
          tokenId: Number(id),
          variant: Number(variants[index]),
        }))

        setMyNfts(nfts)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const mint = async (variant: number) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        '0x7Bd8afD53eDfedAa6417C635083DEf53c5a03825',
        abi,
        signer
      )

      if (signer) {
        setLoadingForVariant((prev) => prev.map((_, i) => i === variant - 1))

        // mintNFT1, mintNFT2, mintNFT3, mintNFT4 are the available functions in the smart contract
        const tx = await contract[`mintNFT${variant}`]({
          value: ethers.parseEther(nfts[variant - 1].price),
        })

        await tx.wait()
        fetchMyNfts()
      }
    } catch (e) {
      console.error(e)
    } finally {
      // reset loading state
      const newLoading = [...loadingForVariant]
      newLoading[variant - 1] = false
      setLoadingForVariant(newLoading)
    }
  }

  const burn = async (tokenId: number) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        '0x7Bd8afD53eDfedAa6417C635083DEf53c5a03825',
        abi,
        signer
      )

      if (signer) {
        setLoadingForBurningTokenId((prev) => [...prev, tokenId])

        // burn(tokenId) is the available function in the smart contract
        const tx = await contract.burn(tokenId)

        await tx.wait()
        fetchMyNfts()
      }
    } catch (e) {
      console.error(e)
    } finally {
      // reset loading state
      setLoadingForBurningTokenId((prev) => prev.filter((id) => id !== tokenId))
    }
  }

  return (
    <>
      <Header />
      <h2 className="my-12 text-center text-3xl font-bold">NFT</h2>

      <div className="mx-auto flex max-w-5xl flex-col p-6 md:flex-row">
        <div className="mb-4 flex flex-1 items-center justify-center md:mb-0">
          <h4 className="text-center text-3xl">
            Purchase a Mystery NFT which could be any one of the Polymer Phase 2
            NFT Types
          </h4>
        </div>
        <div className="flex-1 bg-slate-200 py-48 text-center">[Image]</div>
      </div>

      <ul className="mt-12 flex justify-center gap-x-8 p-6">
        <li>
          <button
            className={`border-b-4 py-1 font-bold text-black
          ${section === 'purchase' ? 'border-black' : ''}`}
            onClick={() => setSection('purchase')}
          >
            Purchase NFT
          </button>
        </li>
        <li>
          <button
            className={`border-b-4 py-1 font-bold text-black
          ${section === 'my-nfts' ? 'border-black' : ''}`}
            onClick={() => setSection('my-nfts')}
          >
            My NFTs
          </button>
        </li>
      </ul>

      <div className="mx-auto my-12 mb-24 max-w-5xl p-6">
        <ul className={`nfts grid grid-cols-4 gap-4 visible-${section}`}>
          {nfts.map((nft) => (
            <li key={nft.name} className="nft-mint">
              <div className="nft-card flex w-full items-center justify-center rounded bg-slate-800 text-3xl text-white">
                {nft.name}
              </div>
              <div className="mt-2 flex">
                <div className="flex-1">
                  <h5>{nft.name}</h5>
                  <p className="text-sm">{nft.price} ETH</p>
                </div>
                <div>
                  <button
                    className="rounded-lg bg-black px-4 py-2 text-center text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-400"
                    type="button"
                    disabled={
                      loadingForVariant[nft.variant - 1] ||
                      account.status !== 'connected'
                    }
                    onClick={() => mint(nft.variant)}
                  >
                    {loadingForVariant[nft.variant - 1] ? (
                      <svg
                        className="h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      'Mint'
                    )}
                  </button>
                </div>
              </div>
            </li>
          ))}
          {myNfts.map((nft: any, index: number) => (
            <li key={index} className="nft-own">
              <div className="nft-card flex w-full items-center justify-center rounded bg-slate-800 text-3xl text-white">
                NFT {nft.variant}
              </div>
              <div className="mt-2 flex">
                <div className="flex-1">
                  <h5>NFT #{nft.tokenId}</h5>
                  <p className="text-sm">
                    Get {refunds.find((r) => r.variant === nft.variant)?.points}{' '}
                    points points
                  </p>
                </div>
                <div>
                  <button
                    className="rounded-lg bg-black px-4 py-2 text-center text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-400"
                    type="button"
                    disabled={
                      loadingForBurningTokenId.includes(nft.tokenId) ||
                      account.status !== 'connected'
                    }
                    onClick={() => burn(nft.tokenId)}
                  >
                    {loadingForBurningTokenId.includes(nft.tokenId) ? (
                      <svg
                        className="h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      'Burn'
                    )}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="my-24 rounded bg-slate-100 p-12 text-center">
          <h5 className="mb-4 text-xl">
            Feeling lucky? Try a Randomizer @ 0.0002 ETH
          </h5>
          <button
            className="rounded-lg bg-black px-4 py-2 text-center text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-400"
            type="button"
            disabled={account.status !== 'connected'}
          >
            Randomize
          </button>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default NFT
