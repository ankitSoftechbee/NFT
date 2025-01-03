import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    address: null,
    isConnected: false,
};

export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setWalletAddress: (state, action) => {
            state.address = action.payload;
            state.isConnected = true;
        },
        disconnectWallet: state => {
            state.address = null;
            state.isConnected = false;
        },
    },
});

export const { setWalletAddress, disconnectWallet } = walletSlice.actions;
export const selectWalletAddress = state => state.wallet.address;
export const selectIsWalletConnected = state => state.wallet.isConnected;
