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
    purchasedNFT: key + '/BuyInvestmentHistory'
}

export const operationAPIConfig = {
    buyPackage: key + '/api/User/BuyPackage',
    sellPackage: key + '/api/User/SellPackage',
    getBuyPackageById: key + '/RidPackages',
    getSellPackageById: key + '/RidBuy'
}