import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { store } from './api/store';
import AppSidebar from './components/home/app-sidebar';
import './index.css';

import MainLayout from './layouts/main-layout';
import OverlapScreenLayout from './layouts/over-layout';
import Home from './pages/home';
import Login from './pages/login';
import BoosterIncome from './pages/sidebar/booster-income';
import ChangePassword from './pages/sidebar/change-password';
import ChangeTransactionPassword from './pages/sidebar/change-transaction-password';
import DirectAffiliate from './pages/sidebar/direct-affiliate';
import DirectIncome from './pages/sidebar/direct-income';
import EditProfile from './pages/sidebar/edit-profile';
import LevelIncome from './pages/sidebar/level-income';
import RewardIncome from './pages/sidebar/reward-income';
import RoiIncome from './pages/sidebar/roi-income';
import Support from './pages/sidebar/support';
import SupportStatus from './pages/sidebar/support-status';
import TeamAffiliate from './pages/sidebar/team-affiliate';
import TopupHistory from './pages/sidebar/topup-history';
import TopUpPackage from './pages/sidebar/topup-package';
import CryptoWallet from './pages/sidebar/crypto-wallet';
import AccountSummary from './pages/sidebar/account-summary';
import WithdrawHistory from './pages/sidebar/withdraw-history';
import FundSummary from './pages/sidebar/fund-summary';
import DepositHistory from './pages/sidebar/deposit-history';
import Deposit from './pages/sidebar/deposit';
import Withdraw from './pages/sidebar/withdraw';
import TotalBusinessLegwise from './pages/sidebar/total-business-legwise';
import RankList from './pages/sidebar/rank-list';
import TransferHistory from './pages/sidebar/transfer-history';
import IncomeToFundHistory from './pages/sidebar/transfer-to-fund-history';
import TransferToFundHistory from './pages/sidebar/transfer-to-fund-history';
import TransferP2P from './pages/sidebar/transfer-p2p';
import TransferToFund from './pages/sidebar/transfer-to-fund';
import Forget from './pages/forget';
import Register from './pages/register';
import AutoPay from './pages/sidebar/auto-pay';
import Website from './pages/website';
import AutoPayHistory from './pages/sidebar/autopay-history';
import UpdateProfilePic from './pages/sidebar/update-profile-pic';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Operation from './pages/sidebar/operation';
import BuyNFTList from './pages/sidebar/nft-list';

const router = createHashRouter([
    { index: true, element: <Login /> },
    { path: 'forget', element: <Forget /> },
    { path: 'register/:sponsorID/:user/*', element: <Register /> },
    { path: 'website', element: <Website /> },
    {
        element: <MainLayout />,
        children: [
            {
                path: 'home',
                element: <Home />,
            },
        ],
    },
    {
        element: <OverlapScreenLayout />,
        children: [
            {
                path: 'sidebar',
                element: <AppSidebar />,
            },
            {
                path: 'total-business-legwise',
                element: <TotalBusinessLegwise />,
            },
            {
                path: 'rank-list',
                element: <RankList />,
            },
            {
                path: 'edit-profile',
                element: <EditProfile />,
            },
            {
                path: 'update-profile-pic',
                element: <UpdateProfilePic />,
            },
            {
                path: 'change-password',
                element: <ChangePassword />,
            },
            {
                path: 'change-transaction-password',
                element: <ChangeTransactionPassword />,
            },
            {
                path: 'support',
                element: <Support />,
            },
            {
                path: 'support-status',
                element: <SupportStatus />,
            },
            {
                path: 'roi-income',
                element: <RoiIncome />,
            },
            {
                path: 'direct-income',
                element: <DirectIncome />,
            },
            {
                path: 'level-income',
                element: <LevelIncome />,
            },
            {
                path: 'reward-income',
                element: <RewardIncome />,
            },
            {
                path: 'booster-income',
                element: <BoosterIncome />,
            },
            {
                path: 'team-affiliate',
                element: <TeamAffiliate />,
            },
            {
                path: 'direct-affiliate',
                element: <DirectAffiliate />,
            },
            {
                path: 'top-up',
                element: <TopUpPackage />,
            },
            {
                path: 'top-history',
                element: <TopupHistory />,
            },
            {
                path: 'account-summary',
                element: <AccountSummary />,
            },
            {
                path: 'crypto-wallet',
                element: <CryptoWallet />,
            },
            {
                path: 'withdraw',
                element: <Withdraw />,
            },
            {
                path: 'withdraw-history',
                element: <WithdrawHistory />,
            },
            {
                path: 'auto-pay',
                element: <AutoPay />,
            },
            {
                path: 'autopay-history',
                element: <AutoPayHistory />,
            },
            {
                path: 'deposit',
                element: <Deposit />,
            },
            {
                path: 'deposit-history',
                element: <DepositHistory />,
            },
            {
                path: 'fund-summary',
                element: <FundSummary />,
            },
            {
                path: 'transfer-p2p',
                element: <TransferP2P />,
            },
            {
                path: 'transfer-history',
                element: <TransferHistory />,
            },
            {
                path: 'transfer-to-fund',
                element: <TransferToFund />,
            },
            {
                path: 'transfer-to-fund-history',
                element: <TransferToFundHistory />,
            },
            {
                path: 'nft-list/:nftName/*',
                element: <BuyNFTList />,
            },
            {
                path: 'operation/:nftID/:operationName/*',
                element: <Operation />,
            },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
        <Toaster />
    </Provider>
);
