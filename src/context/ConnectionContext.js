import React, { createContext, useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { providers, ethers } from 'ethers';
import { SMARTCONTRACT_ADDRESS, SMARTCONTRACT_ABI, SMARTCONTRACT_ADDRESS_ERC20, SMARTCONTRACT_ABI_ERC20, CHAIN_ID, SITE_ERROR } from '../../config';
import MetamaskRequired from '../views/errors/MetamaskRequired';
import BinanceChainRequired from '../views/errors/BinanceChainRequired';
import switchToBinanceNetwork from '../utils/binanceSwitch';
import { checkNetwork } from '../hook/ethereum';
import { providerOptions } from '../hook/connectWallet';
import { Box, CircularProgress } from '@mui/material';

export const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [signerAddress, setSignerAddress] = useState(null);
  const [signerBalance, setSignerBalance] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [holders, setHolders] = useState(null);
  const [earlyRemoved, setEarlyRemoved] = useState(null);
  const [totalDusty, setTotalDusty] = useState(null);
  const [totalOwnerDusty, setTotalOwnerDusty] = useState(0.0);
  const [staked, setStaked] = useState(null);
  const [homeloading, setHomeloading] = useState(false);
  const [metamaskFound, setMetamaskFound] = useState(true);
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
        providerOptions,
      });
      setHomeloading(true); // loading start

      const provider = await web3Modal.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      const chainId = await web3Provider.getNetwork().then(network => network.chainId);
      if (chainId !== parseInt(CHAIN_ID, 10)) {
        setCorrectNetwork(false);
        return;
      }

      setConnected(true);
      setSignerAddress(address);
      setCorrectNetwork(true);

      const contract = new ethers.Contract(
        SMARTCONTRACT_ADDRESS,
        SMARTCONTRACT_ABI,
        signer
      );
      const contract_20 = new ethers.Contract(
        SMARTCONTRACT_ADDRESS_ERC20,
        SMARTCONTRACT_ABI_ERC20,
        signer
      );

      const bal = await contract_20.balanceOf(address);
      setSignerBalance(ethers.utils.formatEther(bal));

      const totalS = await contract_20.totalSupply();
      setTotalSupply(ethers.utils.formatEther(totalS));

      const totlass = await contract_20.holders();
      setHolders(totlass.toString());

      const early = await contract.earlyRemoved();
      setEarlyRemoved(early.toString());

      const totalN = await contract_20.balanceOf(SMARTCONTRACT_ADDRESS);
      setTotalDusty(totalN.toString());

      const Obal = await contract.bonusPool();
      setTotalOwnerDusty(parseFloat(Obal.toString()) + parseFloat(1114));

      const sta = await contract.totalStaked();
      setStaked(sta.toString());

      setHomeloading(false); // loading off

      // Subscribe to accounts change
      provider.on("accountsChanged", (accounts) => {
        setSignerAddress(accounts[0]);
      });

      // Subscribe to chainId change
      provider.on("chainChanged", (chainId) => {
        if (parseInt(chainId) === parseInt(CHAIN_ID, 10)) {
          connectWallet();
        }
        else {

        }
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setHomeloading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (typeof window.ethereum !== 'undefined') {
        if (await checkNetwork("no-alert")) {
          await connectWallet();
          ethereum.on('accountsChanged', () => {
            window.location.reload();
          });
          if (ethereum.selectedAddress !== null) {
            setSignerAddress(ethereum.selectedAddress);
            setConnected(true);
          }
          ethereum.on('chainChanged', (chainId) => {
            if (parseInt(chainId) === parseInt(CHAIN_ID, 10)) {
              connectWallet();
              setCorrectNetwork(true);
            } else {
              setCorrectNetwork(false);
            }
          });
        }
      } else {
        setMetamaskFound(false);
      }
    }
    fetchData();
  }, []);


  if (homeloading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (!metamaskFound) return <MetamaskRequired />;

  if (!correctNetwork) {
    return <BinanceChainRequired switchToBinanceNetwork={switchToBinanceNetwork} />;
  }

  return (
    <ConnectionContext.Provider
      value={{
        connected,
        signerAddress,
        signerBalance,
        totalSupply,
        holders,
        earlyRemoved,
        totalDusty,
        totalOwnerDusty,
        staked,
        homeloading,
        connectWallet,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
