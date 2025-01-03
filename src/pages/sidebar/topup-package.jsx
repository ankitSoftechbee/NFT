import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import metaBullApi from '@/api/game-app';

const TopUpPackage = () => {
    const { data: packages, isLoading, isFetching, isError, error } = metaBullApi.useTopupPackagesQuery();
    const {
        data: walletBalance,
        isLoading: walletBalanceLoading,
        isFetching: walletBalanceFetching,
        isError: walletBalancesisError,
        error: walletBalanceError,
    } = metaBullApi.useGetWalletBalanceQuery();
    const [buyPackageMutation] = metaBullApi.useBuyTopupMutation();

    const [selectedPackage, setSelectedPackage] = useState(null);
    const [amount, setAmount] = useState('');

    // Loading state
    if (isLoading || isFetching || walletBalanceLoading || walletBalanceFetching) {
        return <div className="w-full mx-auto text-center text-white">Loading packages ...</div>;
    }

    // Error state
    if (isError) {
        return <div className="w-full mx-auto text-center text-red-500">Error in loading packages: {error?.message || 'Unknown error'}</div>;
    }

    // Error state
    if (walletBalancesisError) {
        return <div className="w-full mx-auto text-center text-red-500">Error in loading packages: {walletBalanceError?.message || 'Unknown error'}</div>;
    }

    const handlePackageSelect = pkg => {
        setSelectedPackage(pkg);
        setAmount('');
    };

    const handleAmountChange = e => {
        const value = e.target.value;
        setAmount(value);
    };

    const handlePurchase = async () => {
        if (!selectedPackage) {
            toast.error('Please select a package first');
            return;
        }

        const numericAmount = parseFloat(amount);

        // Validate amount
        if (isNaN(numericAmount)) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (numericAmount < selectedPackage.minAmt || numericAmount > selectedPackage.maxAmt) {
            toast.error(`Amount must be between ${selectedPackage.minAmt} and ${selectedPackage.maxAmt}`);
            return;
        }

        if (numericAmount > walletBalance.fundBalance) {
            toast.error('Insufficient wallet balance');
            return;
        }

        try {
            toast.promise(
                buyPackageMutation({
                    packname: selectedPackage.name,
                    amount: numericAmount,
                })
                    .unwrap()
                    .then(payload => {
                        console.log(payload);
                        return payload;
                    })
                    .catch(error => {
                        console.log(error);
                        throw error;
                    }),
                {
                    loading: 'updating...',
                    success: payload => `Package ${selectedPackage.name} purchased successfully!`,
                    error: error => `Buying failed : ${error}`,
                }
            );

            // Reset selection
            setSelectedPackage(null);
            setAmount('');
        } catch (error) {
            toast.error('Unable to purchase package');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-white mb-5">Select Topup</h2>

            <div className="grid grid-cols-1 gap-4">
                {packages?.data?.map(pkg => (
                    <div
                        key={pkg.packid}
                        className={`bg-[#1d1d1f] rounded-2xl border transition-all duration-300 cursor-pointer 
                            ${selectedPackage?.packid === pkg.packid ? 'border-emerald-500 bg-emerald-700/20 text-white' : 'border-emerald-500/20 hover:border-emerald-500/50'} 
                            p-4 shadow-lg`}
                        onClick={() => handlePackageSelect(pkg)}
                    >
                        <div className="flex flex-col space-y-3">
                            <h3 className="text-center text-white font-semibold text-lg">{pkg.name} PACKAGE</h3>

                            <div className="text-sm text-gray-300 space-y-2 border-t border-emerald-500/20 pt-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Min Amount:</span>
                                    <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(pkg.minAmt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Max Amount:</span>
                                    <span>{pkg.maxShowAmt}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">ROI:</span>
                                    <span>
                                        {pkg.fromROI}% - {pkg.toROI}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Non-Working Return:</span>
                                    <span>{pkg.nonWorking}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Working Return:</span>
                                    <span>{pkg.working}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedPackage && (
                <div className="mt-6 sticky -bottom-4 bg-app-bg-secondary p-2">
                    <Label className="text-white">Enter Amount for {selectedPackage.name} Package</Label>
                    <div className="flex space-x-4 mt-2">
                        <Input
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder={`Enter amount b/w ${selectedPackage.minAmt} and ${selectedPackage.maxAmt}`}
                            className="flex-grow bg-[#1d1d1f] border-emerald-500/20 text-white"
                        />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button onClick={handlePurchase} disabled={!amount || isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    {isLoading ? 'Processing...' : 'Buy Package'}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-app-bg-secondary">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Package Purchase</AlertDialogTitle>
                                    <AlertDialogDescription className="text-app-text-primary">
                                        Are you sure you want to purchase the {selectedPackage.name} package for {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}
                                        ?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="text-black bg-neutral-500 border-none">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handlePurchase} className="bg-emerald-700">
                                        Confirm
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopUpPackage;
