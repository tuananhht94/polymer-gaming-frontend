'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import xGamingUCAbi from '@/abis/XGamingUC.json'
import baseNftAbi from '@/abis/PolyERC721UC.json'
import polyERC20Abi from '@/abis/PolyERC20.json'
import { useAccount } from 'wagmi'
import { polymer, polymerErc20Address } from '@/config/polymer'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
export interface Nft {
  name: string
  tokenUri: string
  price: number
  points: number
  variant: number
}
export interface MyNft {
  name: string
  tokenUri: string
  tokenId: number
}

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
  const [loadingForByRandomNFT, setLoadingForByRandomNFT] =
    useState<boolean>(false)
  const [nfts, setNfts] = useState<Nft[]>([])
  const [myNfts, setMyNfts] = useState<MyNft[]>([])

  useEffect(() => {
    if (account.address) {
      fetchNfts()
      fetchMyNfts()
    }
  }, [account.address])

  const showToastSuccess = (message: string) =>
    toast.success(message, {
      position: 'top-right',
    })
  const showToastFailed = (message: string) =>
    toast.error(message, {
      position: 'top-right',
    })
  const nftContract = new ethers.Contract(
    polymer.base.portAddr,
    baseNftAbi,
    new ethers.JsonRpcProvider('https://rpc.notadegen.com/base/sepolia')
  )
  const fetchNfts = async () => {
    // const gamingContract = new ethers.Contract(
    //   polymer.optimism.portAddr,
    //   xGamingUCAbi,
    //   new ethers.JsonRpcProvider('https://sepolia.optimism.io')
    // )
    const tokenURIs = await Promise.all([
      await nftContract.tokenURIs(0),
      await nftContract.tokenURIs(1),
      await nftContract.tokenURIs(2),
      await nftContract.tokenURIs(3),
    ])
    // const prices = await Promise.all([await gamingContract.nftPrice(0), await gamingContract.nftPrice(1), await gamingContract.nftPrice(2), await gamingContract.nftPrice(3)])
    // const points = await Promise.all([await gamingContract.nftPoint(0), await gamingContract.nftPoint(1), await gamingContract.nftPoint(2), await gamingContract.nftPoint(3)])
    setNfts([
      {
        name: 'NFT 1',
        tokenUri: tokenURIs[0],
        price: 20,
        points: 10,
        variant: 1,
      },
      {
        name: 'NFT 2',
        tokenUri: tokenURIs[1],
        price: 50,
        points: 50,
        variant: 2,
      },
      {
        name: 'NFT 3',
        tokenUri: tokenURIs[2],
        price: 75,
        points: 150,
        variant: 3,
      },
      {
        name: 'NFT 4',
        tokenUri: tokenURIs[3],
        price: 100,
        points: 500,
        variant: 4,
      },
    ])
    console.log(tokenURIs)
  }

  const fetchMyNfts = async () => {
    // As I have a helper function `getUserOwnedTokens(addr)` defined in the smart contract
    // So I can fetch the tokenIds of the NFTs owned by the user directly
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        polymer.optimism.portAddr,
        xGamingUCAbi,
        signer
      )

      if (signer) {
        const tokenIds = (
          await Promise.all([
            await contract.ownerTokenMap(signer.address, 0),
            await contract.ownerTokenMap(signer.address, 1),
            await contract.ownerTokenMap(signer.address, 2),
            await contract.ownerTokenMap(signer.address, 3),
          ])
        ).flatMap((item) => item)
        //  const nftType1Ids = await contract.ownerTokenMap(signer.address, 0)
        // console.log('NFT Type 1:', tokenIds)
        // // map tokenIds to variant
        const nfts = tokenIds.map(async (tokenId) => {
          // const name = await nftContract.name(tokenId)
          // const tokeUri = await nftContract.tokenURI(tokenId)
          console.log('NFT:', tokenId)
          return {
            name: 'NFT',
            tokenUri: 'tokeUri',
            tokenId: tokenId,
          } as MyNft
        })
        setMyNfts(await Promise.all(nfts))
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
        polymer.optimism.portAddr,
        xGamingUCAbi,
        signer
      )
      const polyERC20Contract = new ethers.Contract(
        polymerErc20Address,
        polyERC20Abi,
        signer
      )

      if (signer) {
        setLoadingForVariant((prev) => prev.map((_, i) => i === variant - 1))
        // Approve NFT price
        console.log('Buy NFt:', variant, nfts[variant - 1].price)
        const txApprove = await polyERC20Contract.approve(
          polymer.optimism.portAddr,
          ethers.parseEther(`${nfts[variant - 1].price}`)
        )
        console.log(`Approve Buy Tx ${txApprove.hash}`)
        await txApprove.wait()
        const tx = await contract.buyNFT(
          polymer.base.portAddr,
          ethers.encodeBytes32String(polymer.optimism.channelId),
          polymer.optimism.timeout,
          variant - 1
        )
        await tx.wait()
        console.log(`Bought Tx ${tx.hash}`)
        showToastSuccess(`Bought NFT Tx ${tx.hash}`)
      }
    } catch (e: Error | any) {
      showToastFailed(e?.message || 'Failed to mint NFT')
      console.error(e)
    } finally {
      // reset loading state
      const newLoading = [...loadingForVariant]
      newLoading[variant - 1] = false
      setLoadingForVariant(newLoading)
    }
  }
  const minRandom = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!)
      const signer = await provider.getSigner()
      const xGamingContract = new ethers.Contract(
        polymer.optimism.portAddr,
        xGamingUCAbi,
        signer
      )
      const polyERC20Contract = new ethers.Contract(
        polymerErc20Address,
        polyERC20Abi,
        signer
      )
      if (signer) {
        setLoadingForByRandomNFT(true)
        console.log(
          'Randomize',
          await xGamingContract.randomPriceBuyNFTAmount()
        )
        const randomByAmount = await xGamingContract.randomPriceBuyNFTAmount()
        const txApprove = await polyERC20Contract.approve(
          polymer.optimism.portAddr,
          ethers.parseEther(randomByAmount.toString())
        )
        console.log(`Approve Buy Tx ${txApprove.hash}`)
        await txApprove.wait()
        const tx = await xGamingContract.buyRandomNFT(
          polymer.base.portAddr,
          ethers.encodeBytes32String(polymer.optimism.channelId),
          polymer.optimism.timeout
        )
        await tx.wait()
        setLoadingForByRandomNFT(false)
        showToastSuccess(`Bought Random Tx ${tx.hash}`)
      }
    } catch (error: Error | any) {
      setLoadingForByRandomNFT(false)
      showToastFailed(error?.message || 'Failed to mint Random NFT')
      console.log(error)
    }
  }
  const burn = async (tokenId: number) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        '0x7Bd8afD53eDfedAa6417C635083DEf53c5a03825',
        xGamingUCAbi,
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
  const Images = () => (
    <div className="relative flex-1 bg-slate-200 py-48 text-center">
      {nfts.map((nft, index) => (
        <div
          key={index}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img src={nft.tokenUri} alt="NFT Image" />
        </div>
      ))}
    </div>
  )

  return (
    <>
      <ToastContainer />
      <Header />
      <h2 className="my-12 text-center text-3xl font-bold">NFT</h2>

      <div className="mx-auto flex max-w-5xl flex-col p-6 md:flex-row">
        <div className="mb-4 flex flex-1 items-center justify-center md:mb-0">
          <h4 className="text-center text-3xl">
            Purchase a Mystery NFT which could be any one of the Polymer Phase 2
            NFT Types
          </h4>
        </div>
        <Images />
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
              <div className="nft-card flex w-full items-center justify-center rounded bg-slate-800 text-white">
                <img
                  className="h-full w-full object-cover object-center"
                  src={nft.tokenUri}
                  alt="image description"
                />
              </div>
              <div className="mt-2 flex">
                <div className="flex-1">
                  <h5>{nft.name}</h5>
                  <p className="text-sm">{nft.price} PolyERC20</p>
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
          {myNfts.map((nft: MyNft, index: number) => (
            <li key={index} className="nft-own">
              <div className="nft-card flex w-full items-center justify-center rounded bg-slate-800 text-3xl text-white">
                {nft.name}
              </div>
              <div className="mt-2 flex">
                <div className="flex-1">
                  <h5>NFT #{Number(nft.tokenId)}</h5>
                  {/* <p className="text-sm">
                    Get {refunds.find((r) => r.variant === nft.variant)?.points}{' '}
                    points points
                  </p> */}
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
            Feeling lucky? Try a Randomizer 30 PolyERC20
          </h5>
          <button
            className="rounded-lg bg-black px-4 py-2 text-center text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-400"
            type="button"
            disabled={loadingForByRandomNFT || account.status !== 'connected'}
            onClick={() => minRandom()}
          >
            {loadingForByRandomNFT ? (
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
              'Randomize'
            )}
          </button>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default NFT
