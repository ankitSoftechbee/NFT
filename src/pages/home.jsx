import BottomBar from '@/components/home/bottom-bar';
import ContentTabs from '@/components/home/content-tabs';
import CurrentNFTCarousel from '@/components/home/current-nft-carousel';
import NavBar from '@/components/home/search-bar';
import WalletWidget from '@/components/home/wallet';
import TradingViewWidget from '@/components/btcusd-widget';
import React, { useEffect, useState } from 'react';
import Announcement from '@/components/announcement';
import { Copy, Key } from 'lucide-react';
import PurchasedNFTCarousel from '@/components/home/purchased-nft-carousel';
import requestApi from '@/service/service';
import Swal from 'sweetalert2';

const Home = ({ }) => {
    const [data, setData] = useState('')
    const [currentNFTList, setCurrentNFTList] = useState('')
    const [purchasedNFTList, setPurchasedNFTList] = useState('')

    useEffect(() => {
        fetchDashboard()
        fetchCurrentNFT()
        fetchPurchasedNFT()
    }, [])

    const fetchDashboard = async () => {
        const response = await requestApi.dashboard()
        if (response.status===200) {
            setData(response.data)
        }
    }

    const fetchCurrentNFT = async () => {
        const response = await requestApi.currentNFT()
        if (response.status===200) {
            setCurrentNFTList(response.data.data)
        }
    }
    const fetchPurchasedNFT = async () => {
        const body = { PageNumber: 1, PageSize: 10 }
        const response = await requestApi.purchasedNFT(body)
        if (response.status===200) {
            setPurchasedNFTList(response.data.data)
        }
    }

    useEffect(()=>{
       if(data){
        if (data.fundWallet<50){
            Swal.fire({
                title: "Warning",
                text: "Fund balance is low",
                icon: "error"
              });
        }
       }
    },[data])

    return (
        <div className="relative flex flex-col overflow-scroll">
            <NavBar />
            <WalletWidget data={data} />
            <Announcement />
            <CurrentNFTCarousel currentNFTList={currentNFTList} />
            <PurchasedNFTCarousel purchasedNFTList={purchasedNFTList} />
            <ContentTabs data={data} />
        </div>
    );
};

export default Home;
