import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia } from '@mui/material';
import { ChartCandlestick } from 'lucide-react';


const CurrentNFTCarousel = (props) => {
    const { purchasedNFTList } = props
    const navigate = useNavigate()

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
                {purchasedNFTList && purchasedNFTList.map((item, index) => {
                    // Retrieve the corresponding value from the data object
                    // const price = data[item.id] !== undefined ? data[item.id] : 'N/A';

                    return (
                        <div className='px-1'>
                            <Card sx={{ maxWidth: 345 }}>
                                <CardHeader
                                    avatar={
                                        <Avatar sx={{ bgcolor: "red" }} aria-label="NFT">
                                            <ChartCandlestick />
                                        </Avatar>
                                    }

                                    title={item?.packType || ''}
                                    subheader={item?.remark || ''}


                                ></CardHeader>
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={'https://images.unsplash.com/photo-1735437629103-0fac198c7c2e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8'}
                                    alt="Paella dish"
                                />
                                <CardContent>
                                    <div className='w-full flex justify-between'>
                                        <p>Buy Price <div className='text-green-900 font-bold'> ${item?.buyAmount || 0}</div></p>
                                        <p>Sell Price <div className='text-red-500 font-bold'> ${item?.sellAmount || 0}</div></p>
                                    </div>
                                </CardContent>
                                <CardActions disableSpacing>

                                    <button
                                        type="submit"
                                        className="w-full p-2 rounded-full 
                                            bg-gradient-to-r from-[#f539f8] via-[#c342f9] to-[#5356fb]
                                            transition-all duration-300 
                                            active:scale-[0.98]
                                            disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => navigate(`/operation/${item.rid}/Sell`)}
                                    >
                                        Sell
                                    </button>


                                </CardActions>
                            </Card>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
};

export default CurrentNFTCarousel;
