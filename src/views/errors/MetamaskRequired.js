import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import MetaMaskIcon from '@mui/icons-material/AccountBalanceWallet';

const MetamaskRequired = () => {
  const handleInstallMetaMask = () => {
    window.open('https://metamask.io/download.html', '_blank');
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>
      <Box>
        <MetaMaskIcon style={{ fontSize: 100, color: '#f6851b' }} />
      </Box>
      <Typography variant="h4" component="h1" gutterBottom>
        MetaMask Required
      </Typography>
      <Typography variant="body1" paragraph>
        To continue, please install MetaMask, a crypto wallet extension for your browser.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleInstallMetaMask}
        style={{ marginTop: '20px' }}
      >
        Install MetaMask
      </Button>
    </Container>
  );
};

export default MetamaskRequired;
