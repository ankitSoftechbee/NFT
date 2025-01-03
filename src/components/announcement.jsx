import React from 'react';
import { Volume2 } from 'lucide-react';
import metaBullApi from '@/api/game-app';

const Announcement = () => {
    const { data, isLoading, isFetching } = metaBullApi.useAnnouncementsQuery();

    // If loading or no data, return null
    if (isLoading || isFetching || !data || data.length === 0) {
        return null;
    }

    // Determine text to display (prefer title, fallback to news)
    const displayText = data?.tittle + ' ' + data?.news || 'No announcement';

    return (
        <div className="p-2">
            <div className="flex gap-3 items-center text-sm bg-[#242427]/50 border-neutral-500/30 border p-2 rounded-full text-yellow-100 overflow-hidden">
                <Volume2 size={30} className="text-neutral-500 flex-shrink-0" />

                <div className="marquee-container w-full overflow-hidden">
                    <div className="marquee-content">{displayText}</div>
                </div>
            </div>
        </div>
    );
};

export default Announcement;
