const switchToBinanceNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x38' }], // Chain ID for Binance Smart Chain Mainnet
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x38',
              chainName: 'Binance Smart Chain',
              rpcUrls: ['https://bsc-dataseed.binance.org/'],
              nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18,
              },
              blockExplorerUrls: ['https://bscscan.com'],
            },
          ],
        });

        // refresh the page
        window.location.reload();
      } catch (addError) {
        console.error('Failed to add Binance Smart Chain:', addError);
      }
    }
  }
};


module.exports = switchToBinanceNetwork;
