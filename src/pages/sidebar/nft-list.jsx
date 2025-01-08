import requestApi from "@/service/service"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"

const BuyNFTList = () => {
    const routParams = useParams()
    const navigate = useNavigate()
    const [nftName, setNftName] = useState('')
    const [data, setData] = useState('')

    useEffect(() => {
        if (routParams) {
            setNftName(routParams.nftName)
            if (routParams.nftName === 'Buy') {
                fetchBuyList()
            } else {
                fetchSellList()
            }
        }
    }, [])

    const fetchBuyList = async () => {
        const response = await requestApi.currentNFT()
        if (response && response.data.length > 0) {
            setData(response.data)
        }
    }
    const fetchSellList = async () => {
        const body = { PageNumber: 1, PageSize: 100 }
        const response = await requestApi.purchasedNFT(body)
        if (response && response?.data?.data?.length > 0) {
            setData(response.data.data)
        }
    }

    const handleClick = (id) => {
        if (nftName === 'Buy') {
            navigate(`/operation/${id}/Buy`)

        } else if (nftName === 'Sell') {
            navigate(`/operation/${id}/Sell`)
        } else {
            toast.error('Something went wrong')
        }
    }

    console.log(data)

    return <>
        <nav class="flex" aria-label="Breadcrumb" className='mt-2 mb-4'>
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li class="inline-flex items-center">
                    <a href="#" class="inline-flex items-center text-lg font-bold text-white-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                        Trading / {nftName} NFT
                    </a>
                </li>
            </ol>
        </nav>
        {data ? <div className="grid grid-cols-1 md:grid-cols-2">
            {data.map((item) => {
                return <div className='relative bg-[#1d1d1f] p-2 m-1 rounded-md'>
                    <div className='bg-[#1d1d1f] rounded-md'>
                        <img src={item?.img || ''} className='w-[100%] h-[180px]' />
                    </div>
                    <div className="my-2">
                        <p className="text-xl">{item?.name || item?.packType || ''}</p>
                    </div>
                    <div className="flex justify-between my-2">
                        <p className="text-xl">Buy Price <div className="text-green-500">${item?.buyAmount || 0}</div></p>
                        <p className="text-xl">Sell Price <div className="text-red-500">${item?.sellAmount || 0}</div></p>
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="w-[100px] p-2 rounded-lg 
                             bg-gradient-to-r from-[#f539f8] via-[#c342f9] to-[#5356fb]
                             transition-all duration-300 
                             active:scale-[0.98]
                             disabled:opacity-50 disabled:cursor-not-allowed m-2"
                            onClick={() => handleClick(nftName === 'Buy' ? item.packid : item.rid)}
                        >
                            {nftName}
                        </button>
                    </div>

                </div>
            })}
        </div> : <div className="w-full text-center my-4">No record found</div>}
    </>
}
export default BuyNFTList