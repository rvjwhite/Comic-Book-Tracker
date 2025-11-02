import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import collectionReducer from './slices/collectionSlice';
import web3Reducer from './slices/web3Slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    collection: collectionReducer,
    web3: web3Reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore ethers objects in Redux
        ignoredActions: ['web3/connectWallet/fulfilled', 'web3/setProvider'],
        ignoredPaths: ['web3.provider', 'web3.signer', 'web3.contract'],
      },
    }),
});
