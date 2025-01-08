
const key = import.meta.env.VITE_API_URL;

export const authAPIConfig = {
    login: key + '/api/Authentication/token',
    countryList: key + '/api/Authentication/Country',
    checkSponsor: key + '/api/Authentication/ChecKId',
    signup: key + '/api/Authentication/SignUp'
}
export const dashboardAPIConfig = {
    dashboard: key + '/Dashboard',
    currentNFT: key + '/Packages',
    purchasedNFT: key + '/BuyInvestmentHistory',
    news:key+'/News'
}

export const operationAPIConfig = {
    buyPackage: key + '/api/User/BuyPackage',
    sellPackage: key + '/api/User/SellPackage',
    getBuyPackageById: key + '/RidPackages',
    getSellPackageById: key + '/RidBuy',
    buyPackage: key + '/api/User/BuyPackage',
    sellPackage: key + '/api/User/SellPackage'
}

export const depositAPIConfig = {
    deposit: key + '/api/User/DepositeWallet',
    getwalletBalance: key + '/WalletBalance',
    // getWalletAddress: key + '',
    getPaymentMethod: key + '/GetPaymentMode',
    manualDepositeHistory: key + '/ManualDepositeHistory',
    fundSummary: key + '/FundSummary',
    autoDeposite: key + '/api/User/AutoDeposite',
    autoDepositeHistory: key + '/AutoDepositeHistory'
}

export const incomeAPIConfig = {
    income: key + '/IncomeReport'
}
export const affiliateAPIConfig = {
    directTeam: key + '/DirectTeam',
    myTeam: key + '/MyTeam'
}

export const purchasedNFTAPIConfig = {
    purchasedNFTHistory: key + '/SellInvestmentHistory',

}
export const profileAPIConfig = {
    getUserProfile: key + '/GetProfile',
    updateProfile: key + '/api/User/Profile',
    changePassword: key + '/api/User/ChangePassword',
    changeTransactionPassword: key + '/api/User/ChangeTransactionPass',
    supportRaise: key + '/api/User/SupportTicket',
    supportResponseList: key + '/SupportResponse',
    updateProfilePicture: key + '/api/User/UploadProfileImg'
}

export const withdrawAPIConfig = {
    accountSummary: key + '/AccountSummary',
    withdrawSummary: key + '/WithdrawReport',
    getWalletAddress: key + '/GetWalletAddress',
    updateCryptoWallet: key + '/api/User/CryptoWallet',
    updateWithdraw: key + '/api/User/Withdraw'
}
