import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import HomePage from '../components/HomePage'
import Web3Modal from 'web3modal'
import Web3 from 'web3'
import { CHAIN_ID, SITE_ERROR, SMARTCONTRACT_ABI, SMARTCONTRACT_ABI_ERC20, SMARTCONTRACT_ADDRESS, SMARTCONTRACT_ADDRESS_ERC20 } from '../../config'
import Sidebar from '../components/Sidebar'
import MainContent from '../components/MainContent'
import Header from '../components/Header'
import { ethers, providers } from 'ethers'
import { errorAlert, errorAlertCenter ,errors} from '../components/toastGroup'
import Moralis from 'moralis'
import MobileFooter from '../components/MobileFooter'
import { checkNetwork } from '../hook/ethereum'
import { ConnectionContext } from '../context/ConnectionContext'

let web3Modal = undefined

export default function Home({ headerAlert, closeAlert }) {

  const [totalReward, setTotalReward] = useState(0)
  const [loading, setLoading] = useState(false)

  const [stakedCnt, setStakedCnt] = useState(0)
  const [unstakedCnt, setUnstakedCnt] = useState(0)

  const [dbalance, setdBalance] = useState(0)
  const [homeLoading, setHomeloading] = useState(false)
  const [ownerDusty, setTotalOwnerDusty] = useState(false)

  const setStakedNFTs = async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      SMARTCONTRACT_ADDRESS,
      SMARTCONTRACT_ABI,
      signer
    )
    const web3 = new Web3(Web3.givenProvider)
    const accounts = await web3.eth.getAccounts()
    const total = await contract.staked(accounts[0])
    if (parseInt(total.toString()) !== 0) {
      let dd = 0
      let mmm = 0
      for (var i = 0; i < total; i++) {
        const nftData = await contract.activities(accounts[0], i)
        if (nftData.action === 1) {
          dd++
          mmm = mmm + parseFloat(ethers.utils.formatEther(nftData.reward.toString()))
        }
      }
      setStakedCnt(dd)
      setTotalReward(mmm)
    }
    setLoading(false)
  }

  const setPastNFTs = async () => {
    setLoading(true)
    const web3 = new Web3(Web3.givenProvider)
    const accounts = await web3.eth.getAccounts()
    const userNFTs = await Moralis.Web3API.account.getNFTs({ chain: 'bsc', address: accounts[0] })
    setUnstakedCnt(userNFTs.total)
    setLoading(false)
  }
  const getNFTLIST = () => {
    setPastNFTs()
    setStakedNFTs()
  }


  const {
    connected,
    signerAddress,
    signerBalance,
    totalSupply,
    holders,
    earlyRemoved,
    totalDusty,
    staked,
  } = useContext(ConnectionContext);

  return (
    <>
      <Header
        signerAddress={signerAddress || ''}
        connected={connected}
        signerBalance={signerBalance}
        loading={homeLoading}
        headerAlert={headerAlert}
        closeAlert={closeAlert}
      />
      <MainContent>
        <Sidebar
          connected={connected}
          headerAlert={headerAlert}
        />
        <div className="page-content">
          <Head>
            <title>Dusty Vaults | Home</title>
            <meta name="description" content="NFT Bank" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <HomePage
            connected={connected}
            totalSupply={totalSupply}
            staked={staked}
            earlyRemoved={earlyRemoved}
            dbalance={dbalance}
            homeLoading={homeLoading}
            address={signerAddress}
            totalDusty={totalDusty}
            ownerDusty={ownerDusty}
            holders={holders}
            stakedCnt={stakedCnt}
            totalReward={totalReward}
            loading={loading}
            unstakedCnt={unstakedCnt}
          />
        </div>
      </MainContent>

      <MobileFooter connected={connected} />
    </>
  )
}
