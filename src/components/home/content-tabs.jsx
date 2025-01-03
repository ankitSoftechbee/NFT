import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import metaBullApi from '@/api/game-app';
import moment from 'moment';
import toast from 'react-hot-toast';
import { Copy, Key, HelpingHand } from 'lucide-react';
import PersonIcon from '@mui/icons-material/Person';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';

const ContentTabs = () => {
    const { data, isLoading, isFetching } = metaBullApi.useDashboardSummaryQuery();

    console.log(data);

    if (isLoading || isFetching) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-2 bg-app-bg-secondary p-5">
            <div className="text-lg text-app-text-primary font-medium">Summary</div>
            <Tabs defaultValue="Me" className="w-full">
                <TabsList className="p-0 bg-[#242427]/50 rounded-full h-fit w-full overflow-x-auto justify-start flex-nowrap whitespace-nowrap scrollbar-none">
                    {[
                        { text: 'Me', icon: PersonIcon },
                        { text: 'Investment', icon: HelpingHand },
                        { text: 'Business', icon: BusinessIcon },
                        { text: 'Income', icon: CurrencyExchangeIcon },
                        { text: 'Team', icon: GroupsIcon }
                    ].map((curr) => (
                        <TabsTrigger
                            key={curr.text}
                            value={curr.text}
                            className="px-8 py-3 flex-shrink-0 text-base border-none font-medium rounded-full bg-transparent data-[state=active]:bg-[#36363b] data-[state=active]:text-app-text-active"
                        >
                            <div className="flex items-center">
                                <curr.icon className="h-6 w-6 mr-2 object-contain" />
                                {curr.text}
                            </div>
                        </TabsTrigger>
                    ))}

                </TabsList>
                <TabsContent value="Me" className="bg-[#1d1d1f] p-2 rounded-md">
                    <div className="grid grid-cols-1 gap-3">
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Username</div>
                            <div className="text-xl text-purple-500">{data?.username}</div>
                            <div className="absolute w-1 h-6 bg-purple-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Name</div>
                            <div className="text-xl text-purple-500">{data?.name}</div>
                            <div className="absolute w-1 h-6 bg-purple-500 top-2 left-0 rounded-full"></div>
                        </div>
                        {/* <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Package</div>
                            <div className="text-xl text-purple-500">{data?.packtype}</div>
                            <div className="absolute w-1 h-6 bg-purple-500 top-2 left-0 rounded-full"></div>
                        </div> */}
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Rank</div>
                            <div className="text-xl text-purple-500">{data?.currentReward}</div>
                            <div className="absolute w-1 h-6 bg-purple-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Date of Join</div>
                            <div className="text-xl text-purple-500">{moment(data?.dateofjoin).format('L')}</div>
                            <div className="absolute w-1 h-6 bg-purple-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Status</div>
                            <div className="text-xl text-purple-500">{data?.status}</div>
                            <div className="absolute w-1 h-6 bg-purple-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg">
                            <div className="w-full">
                                <div
                                    className="flex justify-between gap-3 items-center text-sm bg-[#242427]/50 p-4 border-purple-500/30 border rounded-lg text-yellow-100 overflow-hidden"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/User/#/register?sponsorId=${data?.username}`);
                                        toast.success('Copied to clipboard');
                                    }}
                                >
                                    <div className="flex  items-center gap-2">
                                        <Key size={30} className="text-neutral-500 flex-shrink-0" />
                                        <div className="text-nowrap text-neutral-400">Invite Link</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-nowrap text-white font-medium">{data?.username}</div>
                                        <Copy size={25} className="text-neutral-500 flex-shrink-0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="Investment" className="bg-[#1d1d1f] p-2 rounded-md">
                    <div className="grid grid-cols-1 gap-3">
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Self Investment</div>
                            <div className="text-xl text-emerald-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.totalInvestment)}</div>
                            <div className="absolute w-1 h-6 bg-emerald-500 top-2 left-0 rounded-full"></div>
                        </div>
                        {/* <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">MBC Self Investment</div>
                            <div className="text-xl text-emerald-500">MBC {data?.mbcInvestment}</div>
                            <div className="absolute w-1 h-6 bg-emerald-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Daily Staking Reward</div>
                            <div className="text-xl text-emerald-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.dailyStakingReward)}</div>
                            <div className="absolute w-1 h-6 bg-emerald-500 top-2 left-0 rounded-full"></div>
                        </div> */}
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Total Withdraw</div>
                            <div className="text-xl text-emerald-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.withdrawApproved)}</div>
                            <div className="absolute w-1 h-6 bg-emerald-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Withdraw Pending</div>
                            <div className="text-xl text-emerald-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.withdrawPending)}</div>
                            <div className="absolute w-1 h-6 bg-emerald-500 top-2 left-0 rounded-full"></div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="Income" className="bg-[#1d1d1f] p-2 rounded-md">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Direct Sponsor Income</div>
                            <div className="text-xl text-indigo-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.directsponsorincome)}</div>
                            <div className="absolute w-1 h-6 bg-indigo-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Staking Income</div>
                            <div className="text-xl text-indigo-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.roistakingincome)}</div>
                            <div className="absolute w-1 h-6 bg-indigo-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Staking Level Income</div>
                            <div className="text-xl text-indigo-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.directlevelincome)}</div>
                            <div className="absolute w-1 h-6 bg-indigo-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Rewards Bonus</div>
                            <div className="text-xl text-indigo-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.leadershipbonus)}</div>
                            <div className="absolute w-1 h-6 bg-indigo-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">GTO Royalty</div>
                            <div className="text-xl text-indigo-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.gtoroyaltyincome)}</div>
                            <div className="absolute w-1 h-6 bg-indigo-500 top-2 left-0 rounded-full"></div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="Business" className="bg-[#1d1d1f] p-2 rounded-md">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Total Earnings</div>
                            <div className="text-xl text-pink-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.totalEarnings)}</div>
                            <div className="absolute w-1 h-6 bg-pink-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Total Investment</div>
                            <div className="text-xl text-pink-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.totalInvestment)}</div>
                            <div className="absolute w-1 h-6 bg-pink-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Team Business</div>
                            <div className="text-xl text-pink-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.teamBusiness)}</div>
                            <div className="absolute w-1 h-6 bg-pink-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Today Earnings</div>
                            <div className="text-xl text-pink-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.todayEarnings)}</div>
                            <div className="absolute w-1 h-6 bg-pink-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Power Leg</div>
                            <div className="text-xl text-pink-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.todayEarnings)}</div>
                            <div className="absolute w-1 h-6 bg-pink-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Weak Leg</div>
                            <div className="text-xl text-pink-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.todayEarnings)}</div>
                            <div className="absolute w-1 h-6 bg-pink-500 top-2 left-0 rounded-full"></div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="Team" className="bg-[#1d1d1f] p-2 rounded-md">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">My Direct</div>
                            <div className="text-xl text-cyan-500">{data?.totaldirect}</div>
                            <div className="absolute w-1 h-6 bg-cyan-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">InActive Direct</div>
                            <div className="text-xl text-cyan-500">{data?.inActiveDirect}</div>
                            <div className="absolute w-1 h-6 bg-cyan-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Total Team</div>
                            <div className="text-xl text-cyan-500">{data?.totalTeam}</div>
                            <div className="absolute w-1 h-6 bg-cyan-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Active Team</div>
                            <div className="text-xl text-cyan-400">{data?.activeTeam}</div>
                            <div className="absolute w-1 h-6 bg-cyan-400 top-2 left-0 rounded-full"></div>
                        </div>

                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">InActive Team</div>
                            <div className="text-xl text-cyan-400">{data?.inActiveTeam}</div>
                            <div className="absolute w-1 h-6 bg-cyan-400 top-2 left-0 rounded-full"></div>
                        </div>
                    </div>
                </TabsContent>
                {/* <TabsContent value="Capping" className="bg-[#1d1d1f] p-2 rounded-md">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Total Self Investment</div>
                            <div className="text-xl text-yellow-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.totalInvestment)}</div>
                            <div className="absolute w-1 h-6 bg-yellow-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Total Capping</div>
                            <div className="text-xl text-yellow-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.totalCappingInvestment)}</div>
                            <div className="absolute w-1 h-6 bg-yellow-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Received Income</div>
                            <div className="text-xl text-yellow-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.receivedIncome)}</div>
                            <div className="absolute w-1 h-6 bg-yellow-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Remaining Capping</div>
                            <div className="text-xl text-yellow-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.remainingCapping)}</div>
                            <div className="absolute w-1 h-6 bg-yellow-500 top-2 left-0 rounded-full"></div>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-lg py-2 px-5 bg-[#242427]">
                            <div className="text-app-text-muted">Today Capping</div>
                            <div className="text-xl text-yellow-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data?.todayEarnings)}</div>
                            <div className="absolute w-1 h-6 bg-yellow-500 top-2 left-0 rounded-full"></div>
                        </div>
                    </div>
                </TabsContent> */}
            </Tabs>
        </div>
    );
};

export default ContentTabs;
