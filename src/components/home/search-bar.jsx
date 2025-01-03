import React, { useRef, useState } from 'react';
import { BellDot, CircleX, Menu, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useNavigate } from 'react-router-dom';
import LOGO from '../../assets/logo.png';

const SearchBar = () => {
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <div className="flex items-center justify-between gap-3 mx-2 mt-2">
            <div className="flex flex-col items-center gap-2 active:scale-95">
                <div className="relative">
                    <div className="flex flex-col justify-center items-center bg-[#242427]/50 rounded-full p-3 md:p-4" onClick={() => navigate('/sidebar', { state: { title: 'Menu' } })}>
                        <Menu className="h-6 w-6 object-contain" />
                    </div>
                </div>
            </div>
            <div
                className={cn(
                    'relative bg-[#242427]/50 py-3 px-4 flex items-center gap-2 overflow-clip h-max rounded-3xl transition-all duration-300 grow',
                    isFocused ? 'border-white border-2' : 'border-transparent border-2'
                )}
            >
                {!isFocused && <Search size={25} className="text-neutral-400" />}
                <input
                    ref={inputRef}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-transparent text-app-text-primary w-full focus:outline-none text-center focus:text-left transition-transform duration-300 placeholder:-translate-x-3 focus:placeholder:-translate-x-0"
                    placeholder="Search"
                />
                {search && <CircleX size={25} className="text-neutral-400 cursor-pointer hover:text-neutral-200" onClick={() => setSearch('')} />}
            </div>
            <div className="flex flex-col items-center gap-2 active:scale-95">
                <img src={LOGO} className="h-14 w-14 object-contain" />
            </div>
        </div>
    );
};

export default SearchBar;
