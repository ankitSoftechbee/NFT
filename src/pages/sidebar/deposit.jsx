import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import metaBullApi from '@/api/game-app';
import { Copy, DivideCircle, QrCode, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import requestApi from '@/service/service';

const DepositSchema = Yup.object().shape({
    amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
    paymentMode: Yup.string().required('Payment Mode is required'),
    hashCode: Yup.string().required('Hash Code is required'),
    file: Yup.mixed().required('The file field is required.'),
});

const Deposit = () => {
    const [copied, setCopied] = useState(false);
    const [qrDialogOpen, setQrDialogOpen] = useState(false);
    const [receiptFile, setReceiptFile] = useState(null);
    const [walletBalance, setWalletBalance] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')



    // // API Hooks
    // const [depositMutation] = metaBullApi.useDepositMutation();
    // const { data: paymentModes, isLoading: modesLoading, isFetching: modesFetching } = metaBullApi.usePaymentModeQuery();
    // const { data: walletBalance, isLoading: wbLoading, isFetching: wbFetching } = metaBullApi.useGetWalletBalanceQuery();
    // const { data: depositAddress, isFetching, isLoading } = metaBullApi.useDepositAddressQuery({ mode: selectedMode }, { skip: !selectedMode });

    useEffect(() => {
        fetchWalletBalance()
        fetchPaymentMode()
        // fetchWalletAddredd()
    }, [])

    const fetchWalletBalance = async () => {
        const response = await requestApi.getWalletBalance()
        if (response && response.fundBalance) {
            setWalletBalance(response)
        } else {
            setWalletBalance('')
        }
    }
    const fetchPaymentMode = async () => {
        const response = await requestApi.getPaymentMethod()
        console.log(response)
        if (response && response.data.length > 0) {
            setPaymentMethod(response.data[0])
        } else {
            setWalletBalance('')
        }
    }

    // Deposit submission handler
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        const body = { Amount: values.amount, PaymentMode: values.paymentMode, Hashcode: values.hashCode, file: values.file }
        const response = await requestApi.deposite(body);
        if (response.status === 200) {
            toast.success('Deposite Successfully')
            formik.resetForm()
            fetchWalletBalance()
            fetchPaymentMode()
            setCopied(false)
            setQrDialogOpen(false)
            setReceiptFile(null)
        } else {
            toast.error('Deposite Failed')
        }
    };


    const formik = useFormik({
        initialValues: {
            amount: '',
            paymentMode: 'USDT',
            file: '',
            hashCode: '',
        },
        validationSchema: DepositSchema,
        onSubmit: handleSubmit,
    });

    // if (wbLoading || wbFetching) return <div>Loading...</div>;

    // Copy address to clipboard
    const handleCopyAddress = () => {
        if (paymentMethod?.address) {
            navigator.clipboard.writeText(paymentMethod.address).then(() => {
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



    return (
        <div className="w-full mx-auto p-4 bg-[#1d1d1f] rounded-lg">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white mb-4">Deposit</h2>
                <div className="text-yellow-500">Fund Balance = {walletBalance?.fundBalance || ''} USDT</div>
            </div>


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
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4 bg-[#2a2a2c] mt-4 p-6 rounded-2xl border border-emerald-500/20">
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
                            }}
                        />
                        {formik.errors.amount && formik.touched.amount && <div className="text-red-500 text-sm mt-1">{formik.errors.amount}</div>}
                    </div>

                    <div>
                        <label className="block text-white mb-2">Payment Mode (USDT)</label>
                        <Input name="paymentMode" type="text" placeholder="Payment mode" className="bg-[#1d1d1f] border-emerald-500/20" value={formik.values.paymentMode} readOnly />
                        {formik.errors.paymentMode && formik.touched.paymentMode && <div className="text-red-500 text-sm mt-1">{formik.errors.paymentMode}</div>}
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
                    {formik.errors.file && formik.touched.file && <div className="text-red-500 text-sm mt-1">{formik.errors.file}</div>}
                </div>

                <Button type="submit" disabled={formik.isSubmitting} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                    {formik.isSubmitting ? 'Submitting...' : 'Submit Deposit'}
                </Button>
            </form>

            {/* QR Code Dialog */}
            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
                <DialogContent className="bg-[#1d1d1f] border-emerald-500/20">
                    <DialogHeader>
                        <DialogTitle className="text-white">Deposit QR Code</DialogTitle>
                    </DialogHeader>
                    {paymentMethod?.qrCode && (
                        <div className="flex justify-center">
                            <img src={paymentMethod.qrCode} alt="Deposit QR Code" className="max-w-full h-auto rounded-lg" />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Deposit;
