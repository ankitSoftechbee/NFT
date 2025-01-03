import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import metaBullApi from '@/api/game-app';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const TransferToFund = ({}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [checkSponsorId] = metaBullApi.useLazyCheckSponsorIdQuery();
    const [transferMutation] = metaBullApi.useTransferToFundMutation();
    const [emailMutation] = metaBullApi.useEmailAfterSignupMutation();
    const [getUserDetail] = metaBullApi.useLazyUserDetailQuery();
    const [sponsorName, setSponsorName] = useState('');

    const formik = useFormik({
        initialValues: {
            amount: '',
            transactionPassword: '',
        },
        validationSchema: Yup.object().shape({
            amount: Yup.number().positive('Amount cant be negative').required('Amount is required').min(1),
            transactionPassword: Yup.string().min(3, 'Transaction Password must be at least 3 characters').required('Transaction Password is required'),
        }),
        onSubmit: (values, action) => {
            action.setSubmitting(false);

            toast.promise(
                transferMutation({
                    amount: values.amount,
                    transPassword: values.transactionPassword,
                })
                    .unwrap()
                    .then(async payload => {
                        console.log(payload);
                        if (payload === -1) {
                            throw new Error('Insufficient balance');
                        }

                        action.setSubmitting(false);
                        action.resetForm();

                        return payload;
                    })
                    .catch(error => {
                        action.setSubmitting(false);
                        console.error('Error in transfer or other operations:', error);
                        throw error;
                    }),
                {
                    loading: 'transferring...',
                    success: payload => `transfer successful`,
                    error: error => `transfer failed: ${error.message}`,
                }
            );
        },
    });

    return (
        <div className="w-full bg-[#1d1d1f] rounded-2xl shadow-2xl border border-emerald-500/20 p-6 mx-auto">
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-white">
                    Amount
                </label>

                <input
                    id="amount"
                    name="amount"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.amount}
                    placeholder="Enter amount"
                    className={cn('form-input', formik.errors.amount && formik.touched.amount && 'focus:ring-0 ring-2 ring-red-600')}
                />
                {formik.errors.amount && formik.touched.amount && <div className="text-red-500">{formik.errors.amount}</div>}

                <label htmlFor="transactionPassword" className="text-white">
                    Transaction Password
                </label>
                <div className="flex items-center relative">
                    <input
                        id="transactionPassword"
                        name="transactionPassword"
                        type={showPassword ? 'text' : 'password'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.transactionPassword}
                        placeholder="Transaction Password"
                        className={cn('form-input w-full', formik.errors.transactionPassword && formik.touched.transactionPassword && 'focus:ring-0 ring-2 ring-red-600')}
                    />
                    {showPassword ? (
                        <EyeOff onClick={() => setShowPassword(!showPassword)} className="text-gold cursor-pointer absolute right-3 hover:text-emerald-500" />
                    ) : (
                        <Eye onClick={() => setShowPassword(!showPassword)} className="text-gold cursor-pointer absolute right-3 hover:text-emerald-500" />
                    )}
                </div>
                {formik.errors.transactionPassword && formik.touched.transactionPassword && <div className="text-red-500">{formik.errors.transactionPassword}</div>}

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

export default TransferToFund;
