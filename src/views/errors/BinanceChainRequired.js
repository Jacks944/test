import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';

const BinanceChainRequired = ({ switchToBinanceNetwork }) => {
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>
      <Box>
        <NetworkCheckIcon style={{ fontSize: 100, color: '#f6851b' }} />
      </Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Switch to Binance Smart Chain
      </Typography>
      <Typography variant="body1" paragraph>
        The application only supports the Binance Smart Chain. Please switch your network to continue.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={switchToBinanceNetwork}
        style={{ marginTop: '20px' }}
      >
        Switch to Binance Network
      </Button>
    </Container>
  );
};

export default BinanceChainRequired;
