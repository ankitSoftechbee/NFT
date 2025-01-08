import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import metaBullApi from '@/api/game-app';
import requestApi from '@/service/service';

const Announcement = () => {
    const [news, setNews] = useState('')

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        const response = await requestApi.getNews()
        if (response.status === 200) {
            setNews(response.data)
        } else {
            setNews('No update')
        }
    }

    return (
        <div className="p-2">
            <div className="flex gap-3 items-center text-sm bg-[#242427]/50 border-neutral-500/30 border p-2 rounded-full text-yellow-100 overflow-hidden">
                <Volume2 size={30} className="text-neutral-500 flex-shrink-0" />

                <div className="marquee-container w-full overflow-hidden">
                    <div className="marquee-content">{news ? `${news.tittle} : ${news.news}` : ''}</div>
                </div>
            </div>
        </div>
    );
};

export default Announcement;
