import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsWalletConnected, selectWalletAddress, setWalletAddress } from '@/reducers/walletSlice';
import Web3 from 'web3';
import toast from 'react-hot-toast';
import { constants } from '@/lib/constants';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import metaBullApi from '@/api/game-app';
import { cn } from '@/lib/utils';

const AutoPay = ({ }) => {
    const [autoPayMutation] = metaBullApi.useAutoPayMutation();
    const { data: walletBalance, isLoading, isFetching, refetch } = metaBullApi.useGetWalletBalanceQuery();
    const walletAddress = useSelector(selectWalletAddress);
    const isConnected = useSelector(selectIsWalletConnected);
    const dispatch = useDispatch();

    console.log('walletAddress', walletAddress);
    console.log('isConnected', isConnected);

    useEffect(() => {
        const walletConnect = async () => {
            try {
                // Check if MetaMask (or another Ethereum provider) is available
                if (window.ethereum) {
                    const web3 = new Web3(window.ethereum);

                    try {
                        const accounts = await window.ethereum.request({
                            method: 'eth_requestAccounts',
                        });

                        if (accounts.length > 0) {
                            const userAddr = accounts[0];
                            dispatch(setWalletAddress(userAddr));
                            console.log('Connected account:', userAddr);
                        } else {
                            toast.error('No accounts found. Please connect your wallet.');
                        }
                    } catch (error) {
                        console.error('Error occurred while connecting wallet:', error);
                        toast.error('Failed to connect wallet. Please try again.');
                    }
                } else {
                    toast.error('Ethereum provider not found. Please install MetaMask.');
                    console.warn('MetaMask or other Web3 provider is required.');
                }
            } catch (error) {
                console.error('Error occurred while connecting to MetaMask or fetching data:', error);
                toast.error('An error occurred while fetching wallet data.');
            }
        };

        walletConnect();
    }, []);

    const formik = useFormik({
        initialValues: {
            amount: '',
            hashCode: '',
            coinAmount: '',
        },
        validationSchema: Yup.object().shape({
            amount: Yup.number().positive().required('Amount is required'),
        }),
        onSubmit: async (values, action) => {
            console.log(values);
            if (!window.ethereum) {
                console.log('Use Metamask!');
                toast.error('Metamask not installed');
                return;
            }
            if (!isConnected) {
                toast.error('Wallet is not connected');
                return;
            }
            action.setSubmitting(true);
            await handleBuyCrypt();
            action.setSubmitting(false);
        },
    });

    if (isLoading || isFetching) return <div>Loading...</div>;
    const handleBuyCrypt = async () => {
        console.log(formik.values);

        if (!window.ethereum) {
            toast.error('Ethereum wallet not found');
            return;
        }

        if (!isConnected) {
            toast.error('Wallet not connected');
            return;
        }

        try {
            const recipientAddress = '0x3CC92CfD43E07cD81f6918b8e9BA60179f2a9725';
            const ownerAddress = walletAddress;

            const web3 = new Web3(window.ethereum);

            const contract = new web3.eth.Contract(constants.USDT_ABI, constants.USDT_CONTRACT_ADDRESS);
            const tokenAddress = constants.USDT_CONTRACT_ADDRESS;
            const amount = formik.values.amount * 1e18;

            const gasPrice = await web3.eth.getGasPrice();
            const gas = await contract.methods.transfer(recipientAddress, amount).estimateGas({ from: ownerAddress, value: 0, gasPrice });
            const txReceipt = await contract.methods.transfer(recipientAddress, amount).send({ from: ownerAddress, value: 0, gasPrice, gas });

            console.log(txReceipt);

            await autoPayMutation({
                amount: formik.values.amount,
                coinAmount: formik.values.coinAmount,
                hashCode: txReceipt.transactionHash,
            })
                .unwrap()
                .then(payload => {
                    if (payload === -1) {
                        throw new Error('Deposit registration failed');
                    }
                    toast.success('Deposit registered');
                    return payload;
                })
                .catch(err => {
                    // Ensure you're passing a string to toast.error()
                    toast.error(err.message || 'An error occurred');
                });

            console.log('Buy Transaction Hash:', txReceipt.transactionHash);
            toast.success('Deposit successful');
            formik.resetForm();
        } catch (error) {
            console.error('Error:', error);
            // Ensure you're passing a string to toast.error()
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    return (
        <div className="w-full bg-[#1d1d1f] rounded-2xl shadow-2xl border border-emerald-500/20 p-6 mx-auto">
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-white">
                    Amount (MBC)
                </label>

                <input
                    id="amount"
                    name="amount"
                    type="number"
                    onChange={e => {
                        formik.setFieldValue('amount', e.target.value);
                        formik.setFieldValue('coinAmount', e.target.value * walletBalance?.coinPrice);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.amount}
                    placeholder="Enter amount"
                    className={cn('form-input', formik.errors.amount && formik.touched.amount && 'focus:ring-0 ring-2 ring-red-600')}
                />
                {formik.errors.amount && formik.touched.amount && <div className="text-red-500">{formik.errors.amount}</div>}

                <label htmlFor="coinAmount" className="text-white">
                    Payout (USD)
                </label>

                <input id="coinAmount" name="coinAmount" type="text" onBlur={formik.handleBlur} value={formik.values.coinAmount} placeholder="payout" className={cn('form-input')} readOnly />

                <button
                    type="submit"
                    className="w-full p-3 rounded-full 
                            bg-emerald-600/20 hover:bg-emerald-600/40 
                            text-emerald-300 font-semibold 
                            transition-all duration-300 
                            active:scale-[0.98]
                            disabled:opacity-50 disabled:cursor-not-allowed mt-5"
                    disabled={formik.isSubmitting}
                >
                    Transfer
                </button>
            </form>
        </div>
    );
};

export default AutoPay;
