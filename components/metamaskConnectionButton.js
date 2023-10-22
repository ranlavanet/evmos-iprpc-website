import { useState } from 'react';
import { useRouter } from 'next/router';
import Web3 from 'web3';

const MetaMaskConnectButton = () => {
  const router = useRouter();
  const [connecting, setConnecting] = useState(false);

  const connectToMetaMask = async () => {
    setConnecting(true);
    if (window.ethereum) {
      try {
        // Request MetaMask permission to connect
        await window.ethereum.enable();

        // Create a Web3 instance using the MetaMask provider
        const web3Instance = new Web3(window.ethereum);

        // Check if the connection is successful
        if (web3Instance.currentProvider.isConnected()) {
          router.push('/sendTxPage'); // Redirect to the sendTxPage upon successful connection
        }
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      } finally {
        setConnecting(false);
      }
    } else {
      console.error('MetaMask is not installed or not detected.');
      setConnecting(false);
    }
  };

  return (
    <button
        onClick={connectToMetaMask}
        disabled={connecting}
        className={`px-8 py-4 text-lg font-medium text-center text-white bg-orange-700 rounded-md ${connecting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
        {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default MetaMaskConnectButton;
