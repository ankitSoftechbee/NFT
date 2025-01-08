import React, { useEffect, useState } from 'react';
import {
    CircleDollarSign,
    CircleHelp,
    Clock,
    Coins,
    Copy,
    FileChartColumn,
    FileChartLine,
    FileClock,
    History,
    Key,
    KeyRound,
    KeySquare,
    MoveDownRight,
    NotepadText,
    TrendingUp,
    User,
    UserPen,
    File,
    WalletMinimal,
    ImageUp,
} from 'lucide-react';
import { LuRocket } from 'react-icons/lu';
import { FaEquals, FaFacebook } from 'react-icons/fa6';
import { TiFlowParallel, TiFlowSwitch } from 'react-icons/ti';
import { FaTwitter, FaYoutube } from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';
import { MdChecklistRtl } from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { IoList } from 'react-icons/io5';
import metaBullApi from '@/api/game-app';

const AppSidebar = () => {
    const navigate = useNavigate();
    const [data, setData] = useState('')

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'))
        setData(user)
    }, [])


    console.log(data);

    // Helper function to render sidebar sections
    const renderSidebarSection = (title, items, isClickable = true) => {
        return (
            <>
                <h1 className="font-medium text-lg mx-2 mt-2">{title}</h1>
                <div className="flex flex-col gap-3 bg-[#242427]/50 rounded-lg p-4 border-emerald-500/30 border">
                    {items.map(([itemTitle, link, Icon], index) => (
                        <React.Fragment key={`${title}-${itemTitle}`}>
                            {isClickable ? (
                                <NavLink to={link} state={{ title: itemTitle }} className="flex gap-2 justify-start items-center">
                                    {Icon}
                                    <div className="text-neutral-400">{itemTitle}</div>
                                </NavLink>
                            ) : (
                                <div className="flex gap-2 justify-start items-center">
                                    {Icon}
                                    <div className="text-neutral-400">{itemTitle}</div>
                                </div>
                            )}

                            {index < items.length - 1 && <div className="h-[2px] bg-neutral-800 w-full" />}
                        </React.Fragment>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className="relative flex flex-col gap-2">
            <div className="flex flex-col overflow-scroll gap-2 grow">
                <div className="w-full">
                    <div
                        className="flex justify-between gap-3 items-center text-sm bg-[#242427]/50 p-4 border-yellow-500/30 border rounded-lg text-yellow-100 overflow-hidden"
                        onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/User/#/register/${data?.userName}/${data?.name}`);
                            toast.success('Copied to clipboard');
                        }}
                    >
                        <div className="flex  items-center gap-2">
                            <Key size={30} className="text-neutral-500 flex-shrink-0" />
                            <div className="text-nowrap text-neutral-400">Invite Link</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-nowrap text-white font-medium">{data?.username}</div>
                            <Copy size={30} className="text-neutral-500 flex-shrink-0" />
                        </div>
                    </div>
                </div>
                {renderSidebarSection(
                    'Deposit',
                    [
                        ['Auto Pay', '/auto-pay', <CircleDollarSign className="text-neutral-400" />],
                        ['Auto Pay History', '/autopay-history', <Clock className="text-neutral-400" />],
                        ['Deposit', '/deposit', <CircleDollarSign className="text-neutral-400" />],
                        ['Deposit History', '/deposit-history', <TrendingUp className="text-neutral-400" />],
                        ['Fund Summary', '/fund-summary', <FileChartLine className="text-neutral-400" />],
                    ],
                    true
                )}

                {/* {renderSidebarSection(
                    'Staking',
                    [
                        ['Staking', '/top-up', <User className="text-neutral-400" />],
                        ['Staking History', '/top-history', <History className="text-neutral-400" />],
                    ],
                    true
                )} */}

                {renderSidebarSection(
                    'NFT Market',
                    [
                        ['Buy NFT', '/nft-list/Buy', <User className="text-neutral-400" />],
                        ['Sell NFT', '/nft-list/Sell', <History className="text-neutral-400" />],
                        ['Purchased History', '/top-history', <History className="text-neutral-400" />],
                    ],
                    true
                )}

                {renderSidebarSection(
                    'Withdraw',
                    [
                        ['Account Summary', '/account-summary', <FileChartColumn className="text-neutral-400" />],
                        ['Crypto Wallet', '/crypto-wallet', <WalletMinimal className="text-neutral-400" />],
                        ['Withdraw', '/withdraw', <History className="text-neutral-400" />],
                        ['Withdraw History', '/withdraw-history', <FileClock className="text-neutral-400" />],
                    ],
                    true
                )}

                {renderSidebarSection(
                    'Bonus Report',
                    [
                        ['Trading Profit', '/roi-income', <FileChartColumn className="text-neutral-400" />],
                        // ['Staking Income', '/direct-income', <MoveDownRight className="text-neutral-400" />],
                        ['Trading Level Profit', '/level-income', <FaEquals size={25} className="text-neutral-400" />],
                        ['Rewards Profit', '/reward-income', <Coins size={25} className="text-neutral-400" />],
                        // ['GTO Royalty', '/booster-income', <LuRocket size={25} className="text-neutral-400" />],
                    ],
                    true
                )}

                {/* {renderSidebarSection('Transfer', [
                    ['Transfer P2P', '/transfer-p2p', <UserPen className="text-neutral-400" />],
                    ['Transfer P2P History', '/transfer-history', <KeyRound className="text-neutral-400" />],
                    ['Transfer To Fund', '/transfer-to-fund', <KeySquare className="text-neutral-400" />],
                    ['Transfer To Fund History', '/transfer-to-fund-history', <CircleHelp className="text-neutral-400" />],
                ])} */}

                {/* {renderSidebarSection('Leg Wise / Rank', [
                    ['Total Business Leg Wise', '/total-business-legwise', <IoList size={25} className="text-neutral-400" />],
                    ['Rank List', '/rank-list', <MdChecklistRtl size={25} className="text-neutral-400" />],
                ])} */}

                {renderSidebarSection('Profile', [
                    ['Edit Profile', '/edit-profile', <UserPen className="text-neutral-400" />],
                    ['Edit Profile Picture', '/update-profile-pic', <ImageUp className="text-neutral-400" />],
                    ['Change Password', '/change-password', <KeyRound className="text-neutral-400" />],
                    ['Change Transaction Password', '/change-transaction-password', <KeySquare className="text-neutral-400" />],
                    ['Support', '/support', <CircleHelp className="text-neutral-400" />],
                    ['Support Status', '/support-status', <NotepadText className="text-neutral-400" />],
                ])}

                {renderSidebarSection(
                    'Affiliate',
                    [
                        ['Direct Affiliate', '/direct-affiliate', <TiFlowParallel size={25} className="text-neutral-400" />],
                        ['Team Affiliate', '/team-affiliate', <TiFlowSwitch size={25} className="text-neutral-400" />],
                    ],
                    true
                )}

                <div className="flex flex-col gap-2">
                    <h1 className="font-medium text-lg mx-2 mt-2">Documents</h1>
                    <div className="flex flex-col gap-3 bg-[#242427]/50 rounded-lg p-4 border-emerald-500/30 border">
                        {[
                            ['Plan', './plan.pdf', <File size={25} className="text-neutral-400" />],
                            // ['Whitepaper', './whitepaper.pdf', <File size={25} className="text-neutral-400" />],
                        ].map(([itemTitle, link, Icon], index) => (
                            <React.Fragment key={`${itemTitle}`}>
                                <a href={link} className="flex gap-2 justify-start items-center">
                                    {Icon}
                                    <div className="text-neutral-400">{itemTitle}</div>
                                </a>

                                {index < 2 - 1 && <div className="h-[2px] bg-neutral-800 w-full" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div
                    className="flex flex-col gap-3 bg-[#242427]/50 rounded-lg p-4 border-red-500/30 border text-red-500 mt-2"
                    onClick={() => {
                        window.localStorage.clear();
                        navigate('/');
                        toast.success('logout successful');
                    }}
                >
                    Logout
                </div>
                <div className="flex justify-center gap-10 mt-5">
                    <FaTwitter className="text-[#1d9ceb]" size={25} />
                    <AiFillInstagram className="text-[#ff8848]" size={25} />
                    <FaYoutube className="text-[#ff0808]" size={25} />
                    <FaFacebook className="text-[#116bff]" size={25} />
                </div>
            </div>
        </div>
    );
};

export default AppSidebar;
