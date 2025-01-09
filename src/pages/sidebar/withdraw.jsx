import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import metaBullApi from '@/api/game-app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import requestApi from '@/service/service';

const WithdrawSchema = Yup.object().shape({
    amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
    paidAmount: Yup.number().required('Paid Amount is required'),
    transPassword: Yup.string().required('Transaction Password is required'),
});

const Withdraw = () => {
    // const [selectedMode, setSelectedMode] = useState(null);

    // API Hooks
    // const [withdrawMutation] = metaBullApi.useWithdrawMutation();
    // const { data: paymentModes, isLoading: modesLoading, isFetching: modesFetching, isError: modesIsError, error: modesError } = metaBullApi.usePaymentModeQuery();
    // const { data: walletBalance, isLoading: wbLoading, isFetching: wbFetching, isError: wbIsError, error: wbError } = metaBullApi.useGetWalletBalanceQuery();
    // const { data: walletAddress, isFetching, isLoading } = metaBullApi.useDepositAddressQuery({ mode: selectedMode }, { skip: !selectedMode });
    // const { data: wallet, isLoading: userWalletLoading, isFetching: userWalletFetching } = metaBullApi.useGetWalletAddressQuery();

    useEffect(()=>{
        fetchWallet()
    },[])
    const fetchWallet = async () => {
        const response = await requestApi.getWalletAddress()
        if (response.status === 200) {
            formik.setFieldValue('wallet',response.data.usdtWallet)
        }
    }
    const formik = useFormik({
        initialValues: {
            amount: '',
            paymentMode: 'USDT',
            wallet: '',
            paidAmount: '',
            transPassword: '',
        },
        validationSchema: WithdrawSchema,
        onSubmit:async (values, { setSubmitting, resetForm }) => {
            // if (!walletAddress?.address) {
            //     return;
            // } else {
                setSubmitting(true);

                // toast.promise(
                //     withdrawMutation({
                //         amount: values.amount,
                //         paymentMode: selectedMode,
                //         wallet: walletAddress.address,
                //         paidAmount: values.paidAmount,
                //         transPassword: values.transPassword,
                //     })
                //         .unwrap()
                //         .then(payload => {
                //             console.log(payload);
                //             resetForm();
                //             setSubmitting(false);
                //             setSelectedMode(null);
                //         })
                //         .catch(error => {
                //             console.log(error);
                //             setSubmitting(false);
                //             throw error;
                //         }),
                //     {
                //         loading: 'Processing withdrawal...',
                //         success: payload => `Withdrawal successful`,
                //         error: error => `Withdrawal failed: ${error}`,
                //     }
                // );
                const response=await requestApi.updateWithdraw(values)
                if(response.status===200){
                    toast.success('Withdrawal successful')
                } else{
                    toast.error('Withdrawal failed')
                }
            // }
        },
    });


    return (
        <>
            <div className="w-full mx-auto p-4 bg-[#1d1d1f] rounded-lg">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white mb-4">Withdraw</h2>
                </div>

            

                {/* Withdraw Form */}
                
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
                                        formik.setFieldValue('paidAmount', (amount*0.9).toString());

                                    }}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.amount && formik.touched.amount && <div className="text-red-500 text-sm mt-1">{formik.errors.amount}</div>}
                            </div>
                            <div>
                                <label className="block text-white mb-2">Payment mode</label>
                                <Input name="paymentMode" type="text" placeholder="Payment mode" className="bg-[#1d1d1f] border-emerald-500/20" value={formik.values.paymentMode} readOnly />
                                {formik.errors.paymentMode && formik.touched.paymentMode && <div className="text-red-500 text-sm mt-1">{formik.errors.paymentMode}</div>}
                            </div>
                            <div>
                                <label className="block text-white mb-2">Wallet</label>
                                <Input name="wallet" type="text" placeholder="wallet" className="bg-[#1d1d1f] border-emerald-500/20" value={formik.values.wallet} readOnly />
                                {formik.errors.wallet && formik.touched.wallet && <div className="text-red-500 text-sm mt-1">{formik.errors.wallet}</div>}
                            </div>

                            <div>
                                <label className="block text-white mb-2">Final Amount</label>
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
