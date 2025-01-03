import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import metaBullApi from '@/api/game-app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const WithdrawSchema = Yup.object().shape({
    amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
    paidAmount: Yup.number().required('Paid Amount is required'),
    transPassword: Yup.string().required('Transaction Password is required'),
});

const Withdraw = () => {
    const [selectedMode, setSelectedMode] = useState(null);

    // API Hooks
    const [withdrawMutation] = metaBullApi.useWithdrawMutation();
    const { data: paymentModes, isLoading: modesLoading, isFetching: modesFetching, isError: modesIsError, error: modesError } = metaBullApi.usePaymentModeQuery();
    const { data: walletBalance, isLoading: wbLoading, isFetching: wbFetching, isError: wbIsError, error: wbError } = metaBullApi.useGetWalletBalanceQuery();
    const { data: walletAddress, isFetching, isLoading } = metaBullApi.useDepositAddressQuery({ mode: selectedMode }, { skip: !selectedMode });
    const { data: wallet, isLoading: userWalletLoading, isFetching: userWalletFetching } = metaBullApi.useGetWalletAddressQuery();

    const formik = useFormik({
        initialValues: {
            amount: '',
            paidAmount: '',
            transPassword: '',
        },
        validationSchema: WithdrawSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            if (!walletAddress?.address) {
                return;
            } else {
                setSubmitting(true);

                toast.promise(
                    withdrawMutation({
                        amount: values.amount,
                        paymentMode: selectedMode,
                        wallet: walletAddress.address,
                        paidAmount: values.paidAmount,
                        transPassword: values.transPassword,
                    })
                        .unwrap()
                        .then(payload => {
                            console.log(payload);
                            resetForm();
                            setSubmitting(false);
                            setSelectedMode(null);
                        })
                        .catch(error => {
                            console.log(error);
                            setSubmitting(false);
                            throw error;
                        }),
                    {
                        loading: 'Processing withdrawal...',
                        success: payload => `Withdrawal successful`,
                        error: error => `Withdrawal failed: ${error}`,
                    }
                );
            }
        },
    });

    if (wbLoading || wbFetching || userWalletLoading || userWalletFetching || modesLoading || modesFetching) return <div>Loading...</div>;

    if (wbIsError) {
        return <div className="w-full mx-auto text-center text-red-500">Error loading wallet: {wbError?.message || 'Unknown error'}</div>;
    }

    if (modesIsError) {
        return <div className="w-full mx-auto text-center text-red-500">Error loading payment modes: {modesError?.message || 'Unknown error'}</div>;
    }

    return (
        <>
            {/* <div className="relative bg-[#242427]/50 p-5 flex flex-col gap-2 overflow-clip h-max rounded-lg border-emerald-500/30 border min-h-[120px] mb-5">
                <div className="grid grid-cols-2">
                    <div className="flex flex-col items-start justify-start gap-3">
                        <div className="text-sm text-app-text-muted">Fund Balance</div>
                        <div className="text-[30px] font-medium z-10">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(walletBalance?.fundBalance)}</div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-3">
                        <div className="text-sm text-app-text-muted">Account Balance</div>
                        <div className="text-[30px] font-medium z-10">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(walletBalance?.withdrawBalance)}</div>
                    </div>
                </div>
                <div className="absolute -right-10 -bottom-10 bg-emerald-500 rounded-full h-40 w-40 blur-[100px]"></div>
            </div> */}
            <div className="w-full mx-auto p-4 bg-[#1d1d1f] rounded-lg">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white mb-4">Withdraw</h2>
                    <div className="text-yellow-500">1 MBC = {walletBalance?.coinPrice} USDT</div>
                </div>

                {/* Payment Mode Selection */}
                <div className="flex space-x-2 mb-6">
                    {modesLoading || modesFetching ? (
                        <div className="text-white">Loading payment modes...</div>
                    ) : (
                        paymentModes?.data?.map(mode => (
                            <button
                                key={mode.paymentMode}
                                onClick={() => {
                                    setSelectedMode(mode.paymentMode);
                                    formik.resetForm();
                                }}
                                className={`
                                px-4 py-2 rounded-lg transition-all duration-300
                                ${selectedMode === mode.paymentMode ? 'bg-emerald-500 text-white' : 'bg-[#2a2a2c] text-gray-400 hover:bg-[#3a3a3c]'}
                            `}
                            >
                                {mode.paymentMode}
                            </button>
                        ))
                    )}
                </div>

                {/* Withdraw Form */}
                {selectedMode && (
                    <form onSubmit={formik.handleSubmit} className="space-y-4 bg-[#2a2a2c] p-6 rounded-2xl border border-emerald-500/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">Amount (USDT)</label>
                                <Input
                                    name="amount"
                                    type="number"
                                    placeholder="Enter Amount"
                                    className="bg-[#1d1d1f] border-emerald-500/20"
                                    value={formik.values.amount}
                                    onChange={e => {
                                        const amount = e.target.value;
                                        formik.setFieldValue('amount', amount);

                                        // Calculate paid amount based on mode
                                        if (selectedMode === 'MBC') {
                                            // For MB mode, calculate paid amount using wallet balance
                                            const paidAmount = amount / walletBalance?.coinPrice;
                                            formik.setFieldValue('paidAmount', paidAmount);
                                        } else {
                                            // For other modes, set paid amount same as amount
                                            formik.setFieldValue('paidAmount', amount);
                                        }
                                    }}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.amount && formik.touched.amount && <div className="text-red-500 text-sm mt-1">{formik.errors.amount}</div>}
                            </div>

                            <div>
                                <label className="block text-white mb-2">Paid Amount (MBC)</label>
                                <Input name="paidAmount" type="number" placeholder="Paid Amount" className="bg-[#1d1d1f] border-emerald-500/20" value={formik.values.paidAmount} readOnly />
                                {formik.errors.paidAmount && formik.touched.paidAmount && <div className="text-red-500 text-sm mt-1">{formik.errors.paidAmount}</div>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-white mb-2">Transaction Password</label>
                            <Input
                                name="transPassword"
                                type="password"
                                placeholder="Enter Transaction Password"
                                className="bg-[#1d1d1f] border-emerald-500/20"
                                value={formik.values.transPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.transPassword && formik.touched.transPassword && <div className="text-red-500 text-sm mt-1">{formik.errors.transPassword}</div>}
                        </div>

                        <Button type="submit" disabled={formik.isSubmitting} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                            {formik.isSubmitting ? 'Processing...' : 'Submit Withdrawal'}
                        </Button>
                    </form>
                )}
            </div>
            <div className="w-full mx-auto p-4 bg-[#1d1d1f] rounded-lg mt-5 text-neutral-400">
                <h2 className="font-semibold text-red-600 mb-4">Points to remember</h2>
                <ol className="list-disc ml-3">
                    <li>A 5% withdrawal fee will be applied to each withdrawal transaction.</li>
                </ol>
            </div>
        </>
    );
};

export default Withdraw;
