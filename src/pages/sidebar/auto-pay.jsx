import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsWalletConnected, selectWalletAddress, setWalletAddress } from '@/reducers/walletSlice';
import Web3 from 'web3';
import toast from 'react-hot-toast';
import { USDTContract } from '@/lib/constants';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import metaBullApi from '@/api/game-app';
import { cn } from '@/lib/utils';
import requestApi from '@/service/service';
import { isNonNegativeNumber } from '@/lib/common';

const AutoPay = ({ }) => {
    const [fileImg, setFileImg] = useState(null);
    const [loader, setLoader] = useState(false);
    const [depositData, setDepositData] = useState({
        hashCode: "",
        walletAddress: "122ddwf5456rgfg1212",
    });
    const [totalAmt, setTotalamt] = useState({});

    useEffect(() => {
        getAmount();
        getMetaMaskWallet();
    }, []);

    const getAmount = async () => {
        const response = await requestApi.getWalletBalance();
        if (response && response.fundBalance) {
            setTotalamt(response);
        }
    };
    //for usdt
    const getMetaMaskWallet = async () => {
        try {
            if (!window.ethereum) {
                console.log("Use Metamask!");
                toast.error("Metamask not installed");
                return;
            }

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            if (accounts !== 0) {
                const web3 = new Web3(window.ethereum);
                const usdtContract = new web3.eth.Contract(
                    USDTContract.USDT_ABI_TOKEN_BUSD,
                    USDTContract.USDT_WALLET_ADDRESS
                );

                const usdtBalance = await usdtContract.methods
                    ?.balanceOf(accounts[0])
                    ?.call();
                const cloneData = {
                    ...depositData,
                    walletAddress: accounts[0],
                    balance: usdtBalance.toString() / 1e18,
                };
                setDepositData(cloneData);
                toast.success("Metamask connected");
            } else {
                toast.error(
                    "Could not find an authorized account");
            }
        } catch (error) {
            console.log("User denied account access or other error:", error);
            toast.error(
                "User denied account access or other error");
        }
    };

    const onHandleChange = (e) => {
        const name = e?.target?.name ?? "";
        const value = isNonNegativeNumber(+e?.target?.value)
            ? e?.target?.value
            : "";
        if (+value <= +depositData?.balance) {
            const cloneData = { ...depositData, [name]: value, coinAmount: value };
            setDepositData(cloneData);
        } else {
            toast.error(
                "Amount must be less than or equal to your balance"
            );
        }
    };


    const onSubmit = async (e) => {
        e.preventDefault()
        // debugger
        if (
            depositData?.amount && depositData?.balance
            //   depositData?.walletAddress &&
            //   depositData?.code
        ) {
            setLoader(true);
            if (!window.ethereum) {
                console.log("Use Metamask!");
                toast.error("Metamask not installed");
                return;
            }
            let contract;
            let tokenAddress;
            const recipientAddress = "0xE455e2b30D1b5DA075878E4D192Ca957dFC03757";
            const ownerAddress = depositData?.walletAddress ?? "";
            const web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(
                USDTContract.USDT_ABI_TOKEN_BUSD,
                USDTContract.USDT_WALLET_ADDRESS
            );
            tokenAddress = USDTContract.USDT_WALLET_ADDRESS;
            const amount = depositData?.amount * 1e18;
            const gasPrice = await web3.eth.getGasPrice();
            const gas = await contract.methods
                .transfer(recipientAddress, amount)
                .estimateGas({ from: ownerAddress, value: 0, gasPrice });
            const txReceipt = await contract.methods
                .transfer(recipientAddress, amount)
                .send({ from: ownerAddress, value: 0, gasPrice, gas });
            if (txReceipt?.transactionHash) {
                const body = {
                    // walletAddress: depositData?.walletAddress,
                    hashCode: txReceipt?.transactionHash,
                    amount: depositData?.amount,
                    // coinAmount: depositData?.coinAmount,
                };

                const response = await requestApi.autoDeposite(body)
                if (response?.status === 200) {
                    toast.success("Amount added Successfully");
                    getAmount();
                    getMetaMaskWallet();
                    setDepositData((prev) => ({ ...prev, amount: "" }));
                } else {
                    toast.error("Something Went Wrong, Try Again");
                }

            } else {
                toast.error("Transaction failed");
            }
        } else {
            toast.error("Amount must be less than or euqal to zero", "Error");
        }
    };



    return (
        <div className="w-full bg-[#1d1d1f] rounded-2xl shadow-2xl border border-emerald-500/20 p-6 mx-auto">
            <p className='text-xl text-white my-4 text-center'>Available Balance : {depositData?.balance?.toFixed(2) || "0.00"}</p>
            <form onSubmit={onsubmit} className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-white">
                    Amount (USDT)
                </label>

                <input
                    id="amount"
                    name="amount"
                    type="number"
                    value={depositData?.amount ?? ""}
                    onChange={onHandleChange}
                    // onBlur={formik.handleBlur}
                    placeholder="Enter amount"
                    className={cn('form-input')}
                />

                <label htmlFor="coinAmount" className="text-white">
                    Payout (USD)
                </label>

                <input type="text" value={depositData?.walletAddress ?? ""} onChange={onHandleChange} placeholder="Wallet Address" className={cn('form-input')} readOnly />

                <button
                    className="w-full p-3 rounded-full 
                            bg-emerald-600/20 hover:bg-emerald-600/40 
                            text-emerald-300 font-semibold 
                            transition-all duration-300 
                            active:scale-[0.98]
                            disabled:opacity-50 disabled:cursor-not-allowed mt-5"
                    // disabled={formik.isSubmitting}
                    onClick={onSubmit}
                >
                    Transfer
                </button>
            </form>
        </div>
    );
};

export default AutoPay;
