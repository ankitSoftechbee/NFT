import React from 'react';
import { ArrowLeftRight, ArrowRightLeft, ArrowUp, BellDot, CreditCard, File, FileChartColumn, HandCoins, Loader2, Plus, RefreshCcw,ShoppingCart,HelpingHand } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfileSheet from './profile-sheet';
import { NavLink } from 'react-router-dom';
import metaBullApi from '@/api/game-app';
import { cn } from '@/lib/utils';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

const WalletWidget = ({ }) => {
    const { data: walletBalance, isLoading, isFetching, refetch } = metaBullApi.useGetWalletBalanceQuery();
    const { data: dashboard } = metaBullApi.useDashboardSummaryQuery();

    return (
        <div className="relative bg-gradient-to-r from-[rgba(2,0,36,1)] via-[rgba(44,131,149,1)] to-[rgba(0,212,255,1)] p-5 flex flex-col gap-2 m-2 overflow-clip h-max rounded-3xl border-emerald-500/30 border min-h-[320px]">
            <div className="absolute -right-10 -bottom-10 bg-emerald-500 rounded-full h-40 w-40 blur-[100px]"></div>
            <div className="flex justify-between mb-5">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 bg-black">
                        <AvatarImage src={dashboard?.photo} />
                        <AvatarFallback className="bg-emerald-700">{dashboard?.name?.toUpperCase().split('')[0]}</AvatarFallback>
                    </Avatar>

                    <div className="font-medium">{dashboard?.name}</div>
                </div>
            </div>
            <div className="grid grid-cols-2 justify-start">
                <div>
                    <div className="flex items-center justify-start gap-3">
                        <div className="text-sm text-app-text-muted">Fund Balance</div>
                        <RefreshCcw size={17} className={cn('text-app-text-muted', { 'animate-spin': isLoading || isFetching })} onClick={() => refetch()} />
                    </div>
                    <div className="text-[30px] font-medium z-10">
                        {isLoading || isFetching ? <Loader2 className="animate-spin" /> : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(walletBalance?.fundBalance)}
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-start gap-3">
                        <div className="text-sm text-app-text-muted">Account Balance</div>
                        <RefreshCcw size={17} className={cn('text-app-text-muted', { 'animate-spin': isLoading || isFetching })} onClick={() => refetch()} />
                    </div>
                    <div className="text-[30px] font-medium z-10">
                        {isLoading || isFetching ? <Loader2 className="animate-spin" /> : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(walletBalance?.withdrawBalance)}
                    </div>
                </div>
            </div>
            {/* <div className="text-app-text-muted">Rate: 1 MBC = {walletBalance?.coinPrice} $</div> */}
            <div className="flex justify-between mt-2 z-10">
                {[
                    ['Add money', Plus, '/deposit'],
                    ['Withdraw', ArrowUp, '/withdraw'],
                    ['Buy', ShoppingCart, '/transfer-p2p'],
                    ['Sell', HelpingHand, '/top-up'],
                ].map(([title, Icon, link], index) => (
                    <NavLink to={link} state={{ title }} key={index} className="flex flex-col items-center gap-2 active:scale-95">
                        <div className="flex flex-col justify-center items-center bg-white/10 rounded-full p-3 md:p-4">
                            <Icon className="h-6 w-6 object-contain" />
                        </div>
                        <div className="text-xs">{title}</div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default WalletWidget;