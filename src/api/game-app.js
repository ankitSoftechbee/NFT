import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const staggeredBaseQuery = async (args, api, extraOptions) => {
    try {
        const result = await fetchBaseQuery({
            baseUrl: 'https://metabullcoin.com/API',
            prepareHeaders: () => {
                const token = window.localStorage.getItem('metabull-token');
                const myHeaders = new Headers();

                if (token) {
                    myHeaders.append('Authorization', `Bearer ` + token);
                    myHeaders.append('Application', 'application/json');
                }

                return myHeaders;
            },
        })(args, api, extraOptions);

        return result;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
};

export const metaBullApi = createApi({
    reducerPath: 'metaBullApi',
    baseQuery: staggeredBaseQuery,
    keepUnusedDataFor: 240,
    tagTypes: ['news', 'dashboard-summary', 'profile', 'roi-income', 'my-team', 'direct-team', 'wallet-address', 'withdraw-history', 'account-summary', 'topup-history'],
    endpoints: builder => ({
        totalBusinessLegWise: builder.query({
            query: ({ pageNumber, fromDate, toDate }) => `/TotalBuisnessLegWise?PageNumber=${pageNumber}&PageSize=10&FromDate=${fromDate}&Todate=${toDate}`,
            providesTags: (result, error, { pageNumber, fromDate, todate }) => (result ? [{ type: 'total-business-legwise', pageNumber, fromDate, todate }] : null),
        }),
        rankList: builder.query({
            query: ({ pageNumber, fromDate, toDate }) => `/RANKList?PageNumber=${pageNumber}&PageSize=10&FromDate=${fromDate}&Todate=${toDate}`,
            providesTags: (result, error, { pageNumber, fromDate, todate }) => (result ? [{ type: 'rank-list', pageNumber, fromDate, todate }] : null),
        }),
        totalBusinessMonthWise: builder.query({
            query: ({ pageNumber, fromDate, toDate }) => `/TotalBuisnessMonthWise?PageNumber=${pageNumber}&PageSize=10&FromDate=${fromDate}&Todate=${toDate}`,
            providesTags: (result, error, { pageNumber, fromDate, todate }) => (result ? [{ type: 'total-business-monthwise', pageNumber, fromDate, todate }] : null),
        }),
        // TRANSFER
        incomeToFundHistory: builder.query({
            query: ({ pageNumber, fromDate, toDate }) => `/IncomeTofundHistory?PageNumber=${pageNumber}&PageSize=10&FromDate=${fromDate}&Todate=${toDate}`,
            providesTags: (result, error, { pageNumber, fromDate, todate }) => (result ? [{ type: 'income-to-fund-history', pageNumber, fromDate, todate }] : null),
        }),
        transferHistory: builder.query({
            query: ({ pageNumber, fromDate, toDate }) => `/TransferHistory?PageNumber=${pageNumber}&PageSize=10&FromDate=${fromDate}&Todate=${toDate}`,
            providesTags: (result, error, { pageNumber, fromDate, todate }) => (result ? [{ type: 'transfer-history', pageNumber, fromDate, todate }] : null),
        }),
        transferP2P: builder.mutation({
            query: body => {
                return {
                    url: `/api/User/P2PTransfer`,
                    method: 'POST',
                    body: body,
                };
            },
            invalidatesTags: ['income-to-fund-history', 'transfer-history'],
        }),
        transferToFund: builder.mutation({
            query: body => {
                return {
                    url: `/api/User/IncomeToFund`,
                    method: 'POST',
                    body: body,
                };
            },
            invalidatesTags: ['income-to-fund-history', 'transfer-history'],
        }),
        // MASTER
        announcements: builder.query({
            query: () => `/News`,
            providesTags: ['news'],
        }),
        dashboardSummary: builder.query({
            query: () => `/Dashboard`,
            providesTags: ['dashboard-summary'],
        }),
        userDetail: builder.query({
            query: ({ userName }) => `/api/Authentication/MSG?UserName=${userName}`,
            keepUnusedDataFor: 0,
        }),
        // AUTH
        login: builder.mutation({
            query: body => {
                return {
                    url: `/api/Authentication/token`,
                    method: 'POST',
                    body: body,
                };
            },
        }),

        dailyClosing: builder.mutation({
            query: body => {
                return {
                    url: `/api/Authentication/DailyClosing`,
                    method: 'POST',
                    body: body,
                };
            },
        }),

        signup: builder.mutation({
            query: body => {
                return {
                    url: `/api/Authentication/SignUp`,
                    method: 'POST',
                    body: body,
                };
            },
        }),

        checkSponsorId: builder.query({
            query: UserName => `/api/Authentication/ChecKId?UserName=${UserName}`,
            keepUnusedDataFor: 0,
        }),

        getCountryCodes: builder.mutation({
            query: () => {
                return {
                    url: `/api/Authentication/Country`,
                    method: 'POST',
                };
            },
        }),

        emailAfterSignup: builder.mutation({
            query: ({ userName }) => {
                return {
                    url: `/api/Authentication/MSGEMAIL?userName=${userName}`,
                    method: 'POST',
                };
            },
        }),

        checkPreForgetDetails: builder.query({
            query: ({ username, email }) => `/api/Authentication/ForgetPassword?UserName=${username}&Email=${email}`,
            keepUnusedDataFor: 0,
        }),

        sendOtp: builder.mutation({
            query: ({ username }) => {
                return {
                    url: `/api/Authentication/OtpOnForgetEmail?userName=${username}`,
                    method: 'POST',
                };
            },
        }),

        verifyOtp: builder.query({
            query: ({ username, otp }) => `/api/Authentication/CheckForgetOTP?UserName=${username}&OTP=${otp}`,
            keepUnusedDataFor: 0,
        }),

        generatePassword: builder.mutation({
            query: body => {
                return {
                    url: `/api/Authentication/GeneratePassword`,
                    method: 'POST',
                    body: body,
                };
            },
        }),

        // MENU - Profile
        profile: builder.query({
            query: ({ UserName }) => `/GetProfile?UserName=${UserName}`,
            providesTags: ['profile'],
        }),

        updateProfilePic: builder.mutation({
            query: body => {
                return {
                    url: `/api/User/UploadProfileImg`,
                    method: 'POST',
                    body: body,
                };
            },
            providesTags: ['profile'],
        }),

        editProfile: builder.mutation({
            query: ({ name, email, mobile, address }) => {
                return {
                    url: `/api/User/Profile?Name=${name}&Email=${email}&Mobile=${mobile}&address=${address}`,
                    method: 'POST',
                };
            },
            invalidatesTags: ['profile'],
        }),

        changePassword: builder.mutation({
            query: ({ currentPassword, newPassword }) => {
                return {
                    url: `/api/User/ChangePassword?OldPassword=${currentPassword}&NewPassword=${newPassword}`,
                    method: 'POST',
                };
            },
        }),

        changeTransactionPassword: builder.mutation({
            query: ({ currentPassword, newPassword }) => {
                return {
                    url: `/api/User/ChangeTransactionPass?OldPassword=${currentPassword}&NewPassword=${newPassword}`,
                    method: 'POST',
                };
            },
        }),

        support: builder.mutation({
            query: ({ subject, message }) => {
                return {
                    url: `/api/User/SupportTicket?Subject=${subject}&Message=${message}`,
                    method: 'POST',
                };
            },
        }),

        supportStatus: builder.mutation({
            query: body => {
                return {
                    url: `/SupportResponse`,
                    method: 'POST',
                    body: body,
                };
            },
        }),

        // MENU - Bonus Report

        bonusReport: builder.query({
            query: ({ pageNumber, keyword, fromDate, toDate }) => `/IncomeReport?pageNumber=${pageNumber}&pageSize=10&keyword=${keyword}&fromDate=${fromDate}&todate=${toDate}`,
            providesTags: (result, error, { keyword, pageNumber, fromDate, todate }) => (result ? [{ type: 'roi-income', keyword, pageNumber, fromDate, todate }] : null),
        }),

        // MENU - Affiliate

        teamAffiliate: builder.query({
            query: ({ pageNumber, fromDate, toDate }) => `/MyTeam?pageNumber=${pageNumber}&pageSize=10&fromDate=${fromDate}&todate=${toDate}`,
            providesTags: (result, error, { pageNumber, fromDate, todate }) => (result ? [{ type: 'my-team', pageNumber, fromDate, todate }] : null),
        }),

        directAffiliate: builder.query({
            query: ({ pageNumber, fromDate, toDate }) => `/DirectTeam?pageNumber=${pageNumber}&pageSize=10&fromDate=${fromDate}&todate=${toDate}`,
            providesTags: (result, error, { pageNumber, fromDate, todate }) => (result ? [{ type: 'direct-team', pageNumber, fromDate, todate }] : null),
        }),

        // MENU - Withdraw
        withdraw: builder.mutation({
            query: body => {
                return {
                    url: `/api/User/Withdraw`,
                    method: 'POST',
                    body: body,
                };
            },
            invalidatesTags: ['withdraw-history', 'accountSummary'],
        }),

        accountSummary: builder.query({
            query: ({ pageNumber, fromDate, toDate }) => `/MainWalletSummary?PageNumber=${pageNumber}&PageSize=10&FromDate=${fromDate}&Todate=${toDate}`,
            providesTags: (result, error, { pageNumber, fromDate, todate }) => (result ? [{ type: 'account-summary', pageNumber, fromDate, todate }] : null),
        }),

        getWalletAddress: builder.query({
            query: () => `/GetWalletAddress`,
            providesTags: ['wallet-address'],
        }),

        editWalletAddress: builder.mutation({
            query: body => {
                return {
                    url: `/api/User/CryptoWallet`,
                    method: 'POST',
                    body: body,
                };
            },
            invalidatesTags: ['wallet-address'],
        }),

        withdrawHistory: builder.query({
            query: ({ pageNumber, fromDate, toDate }) => `/WithdrawReport?PageNumber=${pageNumber}&PageSize=10&FromDate=${fromDate}&Todate=${toDate}`,
            providesTags: (result, error, { pageNumber, fromDate, todate }) => (result ? [{ type: 'withdraw-history', pageNumber, fromDate, todate }] : null),
        }),

        // MENU - Topup Packages

        topupPackages: builder.query({
            query: () => `/Packages`,
        }),

        buyTopup: builder.mutation({
            query: body => {
                return {
                    url: `/api/User/InvestmentPackage`,
                    method: 'POST',
                    body: body,
                };
            },
            invalidatesTags: ['topup-history'],
        }),

        topupHistory: builder.query({
            query: ({ pageNumber }) => `/InvestmentHistory?PageNumber=${pageNumber}&PageSize=10`,
            providesTags: (result, error, { pageNumber }) => (result ? [{ type: 'topup-history', pageNumber }] : null),
        }),

        getWalletBalance: builder.query({
            query: () => `/WalletBalance`,
            keepUnusedDataFor: 0,
        }),

        // MENU - Topup Funding

        autoPay: builder.mutation({
            query: body => {
                return {
                    url: `/api/User/AutoDepositeToken`,
                    method: 'POST',
                    body: body,
                };
            },
            invalidatesTags: ['deposit-history'],
        }),

        autoPayHistory: builder.query({
            query: ({ pageNumber, fromDate, toDate }) => `/AutoDepositeHistory?PageNumber=${pageNumber}&PageSize=10&FromDate=${fromDate}&Todate=${toDate}`,
            providesTags: (result, error, { pageNumber, fromDate, todate }) => (result ? [{ type: 'autopay-history', pageNumber, fromDate, todate }] : null),
        }),

        paymentMode: builder.query({
            query: () => `/GetPaymentMode`,
        }),

        depositAddress: builder.query({
            query: ({ mode }) => `/GetDepositetAddress?Mode=${mode}`,
        }),

        deposit: builder.mutation({
            query: ({ body, amount, paidAmount, receipt, paymentMode, hashCode }) => {
                return {
                    url: `/api/User/DepositeWallet?Amount=${amount}&PaidAmount=${paidAmount}&Receipt=${receipt}&PaymentMode=${paymentMode}&Hashcode=${hashCode}`,
                    method: 'POST',
                    body: body,
                };
            },
            invalidatesTags: ['deposit-history'],
        }),

        depositHistory: builder.query({
            query: ({ pageNumber, fromDate, toDate }) => `/ManualDepositeHistory?PageNumber=${pageNumber}&PageSize=10&FromDate=${fromDate}&Todate=${toDate}`,
            providesTags: (result, error, { pageNumber, fromDate, todate }) => (result ? [{ type: 'deposit-history', pageNumber, fromDate, todate }] : null),
        }),

        fundSummary: builder.query({
            query: ({ pageNumber, fromDate, toDate }) => `/FundSummary?PageNumber=${pageNumber}&PageSize=10&FromDate=${fromDate}&Todate=${toDate}`,
            providesTags: (result, error, { pageNumber, fromDate, todate }) => (result ? [{ type: 'fund-summary', pageNumber, fromDate, todate }] : null),
        }),
    }),
});

export default metaBullApi;
