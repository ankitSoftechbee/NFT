import BottomBar from '@/components/home/bottom-bar';
import ContentTabs from '@/components/home/content-tabs';
import CurrentNFTCarousel from '@/components/home/current-nft-carousel';
import NavBar from '@/components/home/search-bar';
import WalletWidget from '@/components/home/wallet';
import TradingViewWidget from '@/components/btcusd-widget';
import React from 'react';
import Announcement from '@/components/announcement';
import { Copy, Key } from 'lucide-react';
import PurchasedNFTCarousel from '@/components/home/purchased-nft-carousel';

const Home = ({ }) => {
    return (
        <div className="relative flex flex-col overflow-scroll">
            <NavBar />
            <WalletWidget />
            <Announcement />
            <CurrentNFTCarousel />
            <PurchasedNFTCarousel/>
            <ContentTabs />
        </div>
    );
};

export default Home;
