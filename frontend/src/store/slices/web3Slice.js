import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import ComicBookNFTABI from '../../contracts/ComicBookNFT.json';

const initialState = {
  provider: null,
  signer: null,
  contract: null,
  account: null,
  chainId: null,
  isConnected: false,
  isLoading: false,
  error: null,
};

// Connect wallet
export const connectWallet = createAsyncThunk(
  'web3/connectWallet',
  async (_, thunkAPI) => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Initialize contract
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      const contract = new ethers.Contract(
        contractAddress,
        ComicBookNFTABI.abi,
        signer
      );

      return {
        account,
        chainId,
        contractAddress,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Mint NFT
export const mintNFT = createAsyncThunk(
  'web3/mintNFT',
  async ({ title, publisher, issueNumber, condition, uri }, thunkAPI) => {
    try {
      const state = thunkAPI.getState().web3;
      if (!state.contract) {
        throw new Error('Contract not initialized');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        ComicBookNFTABI.abi,
        signer
      );

      const tx = await contract.mintComicNFT(
        state.account,
        title,
        publisher,
        issueNumber,
        condition,
        uri
      );

      const receipt = await tx.wait();

      // Extract token ID from events
      const event = receipt.logs.find(log => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed.name === 'ComicMinted';
        } catch {
          return false;
        }
      });

      let tokenId;
      if (event) {
        const parsed = contract.interface.parseLog(event);
        tokenId = Number(parsed.args.tokenId);
      }

      return {
        transactionHash: receipt.hash,
        tokenId,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Disconnect wallet
export const disconnectWallet = createAsyncThunk(
  'web3/disconnectWallet',
  async () => {
    return {};
  }
);

export const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isConnected = true;
        state.account = action.payload.account;
        state.chainId = action.payload.chainId;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(disconnectWallet.fulfilled, () => initialState)
      .addCase(mintNFT.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(mintNFT.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(mintNFT.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reset } = web3Slice.actions;
export default web3Slice.reducer;
