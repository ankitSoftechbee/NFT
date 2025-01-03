import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import metaBullApi from '@/api/game-app';
import { Copy, DivideCircle, QrCode, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import toast from 'react-hot-toast';

const DepositSchema = Yup.object().shape({
    amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
    paidAmount: Yup.number().required('Paid Amount is required'),
    receipt: Yup.string(),
    hashCode: Yup.string().required('Hash Code is required'),
    file: Yup.mixed().required('The file field is required.'),
});

const Deposit = () => {
    const [selectedMode, setSelectedMode] = useState(null);
    const [copied, setCopied] = useState(false);
    const [qrDialogOpen, setQrDialogOpen] = useState(false);
    const [receiptFile, setReceiptFile] = useState(null);

    // API Hooks
    const [depositMutation] = metaBullApi.useDepositMutation();
    const { data: paymentModes, isLoading: modesLoading, isFetching: modesFetching } = metaBullApi.usePaymentModeQuery();
    const { data: walletBalance, isLoading: wbLoading, isFetching: wbFetching } = metaBullApi.useGetWalletBalanceQuery();
    const { data: depositAddress, isFetching, isLoading } = metaBullApi.useDepositAddressQuery({ mode: selectedMode }, { skip: !selectedMode });

    const formik = useFormik({
        initialValues: {
            amount: '',
            paidAmount: '',
            receipt: '',
            hashCode: '',
        },
        validationSchema: DepositSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            handleDeposit(values, { setSubmitting, resetForm });
        },
    });

    if (wbLoading || wbFetching) return <div>Loading...</div>;

    // Copy address to clipboard
    const handleCopyAddress = () => {
        if (depositAddress?.address) {
            navigator.clipboard.writeText(depositAddress.address).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    // File upload handler
    const handleFileUpload = event => {
        const file = event.target.files[0];
        if (file) {
            setReceiptFile(file);
            formik.setFieldValue('file', file);
        }
    };

    // Deposit submission handler
    const handleDeposit = async (values, { setSubmitting, resetForm }) => {
        console.log(values);
        const formData = new FormData();
        formData.append('file', receiptFile);

        setSubmitting(true);
        toast.promise(
            depositMutation({ body: formData, amount: values.amount, paidAmount: values.paidAmount, receipt: 'receipt', paymentMode: selectedMode, hashCode: values.hashCode })
                .unwrap()
                .then(payload => {
                    console.log(payload);
                    resetForm();
                    setSubmitting(false);
                    setReceiptFile(null);
                    setSelectedMode(null);
                })
                .catch(error => {
                    console.log(error);
                    setSubmitting(false);
                    throw error;
                }),
            {
                loading: 'depositing...',
                success: payload => `deposit successful`,
                error: error => `deposit failed : ${error}`,
            }
        );
    };

    return (
        <div className="w-full mx-auto p-4 bg-[#1d1d1f] rounded-lg">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white mb-4">Deposit</h2>
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

            {/* Deposit Address Section */}
            {selectedMode && (
                <div className="bg-[#2a2a2c] rounded-2xl p-6 border border-emerald-500/20 mb-6">
                    {isFetching || isLoading ? (
                        <div className="text-white text-center">Loading deposit address...</div>
                    ) : depositAddress ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-semibold">Deposit Address</h3>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={handleCopyAddress} className="bg-[#1d1d1f] border-emerald-500/20 hover:bg-emerald-500/10">
                                        <Copy className="h-4 w-4 mr-2" />
                                        {copied ? 'Copied!' : 'Copy'}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setQrDialogOpen(true)} className="bg-[#1d1d1f] border-emerald-500/20 hover:bg-emerald-500/10">
                                        <QrCode className="h-4 w-4 mr-2" />
                                        QR Code
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-[#1d1d1f] rounded-lg p-3 border border-emerald-500/20">
                                <p className="text-white break-all">{depositAddress.address}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-white text-center">No deposit address available</div>
                    )}
                </div>
            )}

            {/* Deposit Form */}
            {selectedMode && (
                <form onSubmit={formik.handleSubmit} className="space-y-4 bg-[#2a2a2c] p-6 rounded-2xl border border-emerald-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white mb-2">Amount (MBC)</label>
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
                                        const paidAmount = amount * walletBalance?.coinPrice;
                                        formik.setFieldValue('paidAmount', paidAmount);
                                    } else {
                                        // For other modes, set paid amount same as amount
                                        formik.setFieldValue('paidAmount', amount);
                                    }
                                }}
                            />
                            {formik.errors.amount && formik.touched.amount && <div className="text-red-500 text-sm mt-1">{formik.errors.amount}</div>}
                        </div>

                        <div>
                            <label className="block text-white mb-2">Paid Amount (USDT)</label>
                            <Input name="paidAmount" type="number" placeholder="Paid Amount" className="bg-[#1d1d1f] border-emerald-500/20" value={formik.values.paidAmount} readOnly />
                            {formik.errors.paidAmount && formik.touched.paidAmount && <div className="text-red-500 text-sm mt-1">{formik.errors.paidAmount}</div>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-white mb-2">Hash Code</label>
                        <Input name="hashCode" placeholder="Enter Hash Code" className="bg-[#1d1d1f] border-emerald-500/20" value={formik.values.hashCode} onChange={formik.handleChange} />
                        {formik.errors.hashCode && formik.touched.hashCode && <div className="text-red-500 text-sm mt-1">{formik.errors.hashCode}</div>}
                    </div>

                    <div>
                        <label className="block text-white mb-2">Receipt</label>
                        <div className="flex items-center space-x-2">
                            <input type="file" id="receipt" name="receipt" onChange={handleFileUpload} className="hidden" />
                            <label
                                htmlFor="receipt"
                                className="flex items-center justify-center w-full p-4 border-2 border-dashed border-emerald-500/20 rounded-lg cursor-pointer hover:bg-emerald-500/10 transition"
                            >
                                <Upload className="mr-2 h-5 w-5 text-white" />
                                <span className="text-white">{receiptFile ? receiptFile.name : 'Upload Receipt'}</span>
                            </label>
                        </div>
                        {formik.errors.receipt && formik.touched.receipt && <div className="text-red-500 text-sm mt-1">{formik.errors.receipt}</div>}
                    </div>

                    <Button type="submit" disabled={formik.isSubmitting} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                        {formik.isSubmitting ? 'Submitting...' : 'Submit Deposit'}
                    </Button>
                </form>
            )}

            {/* QR Code Dialog */}
            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
                <DialogContent className="bg-[#1d1d1f] border-emerald-500/20">
                    <DialogHeader>
                        <DialogTitle className="text-white">Deposit QR Code</DialogTitle>
                    </DialogHeader>
                    {depositAddress?.qrCode && (
                        <div className="flex justify-center">
                            <img src={depositAddress.qrCode} alt="Deposit QR Code" className="max-w-full h-auto rounded-lg" />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Deposit;
