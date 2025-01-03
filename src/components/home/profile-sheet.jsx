import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const ProfileSheet = ({ children }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="bottom" className="w-full lg:w-[500px] mx-auto h-[calc(100%-4rem)] rounded-t-2xl bg-app-bg-secondary border-slate-700">
                <SheetHeader>
                    <SheetTitle>Are you absolutely sure?</SheetTitle>
                    <SheetDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

export default ProfileSheet;
