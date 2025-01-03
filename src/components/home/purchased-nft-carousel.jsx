import React from 'react';
import EthWidget from '../ethusd-widget';
import BtcWidget from '../btcusd-widget';
import SolWidget from '../solusd-widget';
import Slider from 'react-slick';
import { Button } from '../ui/button';


const PurchasedNFTCarousel = () => {
    const content = [
        { id: 'tradingincome', name: 'Trading Profit' },
        { id: 'tradingpassiveincome', name: 'Trading Profit Income' },
        { id: 'directincome', name: 'Direct Income' },
        { id: 'levelincome', name: 'Level Income' },
        { id: 'rewardincome', name: 'Reward Income' },
        { id: 'royaltyincome', name: 'Royalty Income' },
        { id: 'clubincome', name: 'Club Income' },
    ];
    const settings = {
        infinite: true, // Infinite scroll
        speed: 500, // Animation speed
        slidesToShow: 2, // Show 2 items at a time
        slidesToScroll: 1, // Scroll 1 item at a time
        autoplay: true, // Enable autoplay
        autoplaySpeed: 2000, // Set autoplay interval to 2 seconds
        arrows: false, // Disable next/prev arrows
        responsive: [
            {
                breakpoint: 1024, // On desktop and tablets
                settings: {
                    slidesToShow: 2, // Show 2 items
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 640, // On mobile
                settings: {
                    slidesToShow: 1, // Show 1 item
                    slidesToScroll: 1,
                },
            },
        ],
    };
    return (
        <div className="bg-app-bg-secondary p-4 flex flex-col gap-5">
            <div className="text-lg text-app-text-primary font-medium">Purchased NFT</div>
            <Slider {...settings} className="w-full mt-1 px-1">
                {content.map((item, index) => {
                    // Retrieve the corresponding value from the data object
                    // const price = data[item.id] !== undefined ? data[item.id] : 'N/A';

                    return (
                        <div className='px-1'>
                            <div className="max-w-sm mx-auto p-4 bg-gray-500 text-white rounded-xl shadow-lg flex flex-col justify-between">
                                {/* <!-- Header --> */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {/* <!-- Icon --> */}
                                        <div className="bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" className="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01m6.938-6.938a9 9 0 11-12.728 0 9 9 0 0112.728 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h2 className="text-lg font-semibold">BTCUSD</h2>
                                            <p className="text-sm text-gray-400">Bitcoin / U.S. Dollar</p>
                                        </div>
                                    </div>
                                    {/* <!-- Logo --> */}
                                    <div className="flex items-center justify-center bg-gray-800 rounded-full p-1">
                                        <span className="text-xs font-bold text-gray-300">TV</span>
                                    </div>
                                </div>

                                <div className="my-6">
                                    <p className="text-4xl font-bold">$96,459.30</p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-gray-400 flex space-x-2">
                                        <span>Feb</span>
                                        <span>Jun</span>
                                        <span>2025</span>
                                    </div>
                                    <Button className="bg-red-700">Sell</Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
};

export default PurchasedNFTCarousel;
