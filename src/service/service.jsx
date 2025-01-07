import axios from "axios";
import { affiliateAPIConfig, authAPIConfig, dashboardAPIConfig, depositAPIConfig, incomeAPIConfig, operationAPIConfig } from "@/api/apiConfig";

async function postData(url, body) {
    try {
        let _r = await axios.post(url, body, {
            headers: {
                Authorization: "Bearer ".concat(localStorage.getItem("access_token")),
            },
        });

        return _r.data;
    } catch (res) {
        return res;
    }
}
async function postDataWithFormData(url, body) {
    try {
        let _r = await axios.post(url, body, {
            headers: {
                "Content-Type": 'multipart/form-data',
                Authorization: "Bearer ".concat(localStorage.getItem("access_token")),
            },
        });

        return _r;
    } catch (res) {
        return res;
    }
}

async function postDataNoHeader(url, body) {
    try {
        let _r = await axios.post(url, body);
        return _r.data;
    } catch (res) {
        return res;
    }
}
async function getDataWithoutHeader(url) {
    try {
        let _r = await axios.get(url);
        return _r.data;
    } catch (res) {
        console.log(res);
        return res;
    }
}

async function getData(url) {
    try {
        let _r = await axios.get(url, {
            headers: {
                Authorization: "Bearer ".concat(localStorage.getItem("access_token")),
            },
        });
        return _r.data;
    } catch (res) {
        return res;
    }
}

async function getDataWithParams(url, body) {
    try {
        let _r = await axios.get(url, {
            params: body,
            headers: {
                Authorization: "Bearer ".concat(localStorage.getItem("access_token")),
            },
        });
        return _r;
    } catch (res) {
        return res;
    }
}

const requestApi = {
    loginReq: async (body) => {
        const url = authAPIConfig.login;
        let r = await postDataNoHeader(url, body);
        return r;
    },
    countryList: async () => {
        const url = authAPIConfig.countryList;
        let r = await getDataWithoutHeader(url);
        return r;
    },
    dashboard: async () => {
        const url = dashboardAPIConfig.dashboard;
        let r = await getData(url);
        return r;
    },
    currentNFT: async () => {
        const url = dashboardAPIConfig.currentNFT;
        let r = await getData(url);
        return r;
    },
    purchasedNFT: async (body) => {
        const url = dashboardAPIConfig.purchasedNFT;
        let r = await getDataWithParams(url, body);
        return r;
    },
    getBuyPackageById: async (body) => {
        const url = operationAPIConfig.getBuyPackageById;
        let r = await getDataWithParams(url, body);
        return r;
    },
    getSellPackageById: async (body) => {
        const url = operationAPIConfig.getSellPackageById;
        let r = await getDataWithParams(url, body);
        return r;
    },
    buyPackage: async (body) => {
        const url = operationAPIConfig.buyPackage;
        let r = await postData(url, body);
        return r;
    },
    sellPackage: async (body) => {
        const url = operationAPIConfig.sellPackage;
        let r = await postData(url, body);
        return r;
    },
    getWalletBalance: async () => {
        const url = depositAPIConfig.getwalletBalance;
        let r = await getData(url);
        return r;
    },
    getPaymentMethod: async () => {
        const url = depositAPIConfig.getPaymentMethod;
        let r = await getData(url);
        return r;
    },
    deposite: async (body) => {
        const url = depositAPIConfig.deposit;
        let r = await postDataWithFormData(url, body);
        return r;
    },
    manualDepositeHistory: async (body) => {
        const url = depositAPIConfig.manualDepositeHistory;
        let r = await getDataWithParams(url, body);
        return r;
    },
    fundSummary: async (body) => {
        const url = depositAPIConfig.fundSummary;
        let r = await getDataWithParams(url, body);
        return r;
    },
    autoDeposite: async (body) => {
        const url = depositAPIConfig.autoDeposite;
        let r = await postData(url, body);
        return r;
    },
    autoDepositeHistory: async (body) => {
        const url = depositAPIConfig.autoDepositeHistory;
        let r = await getDataWithParams(url, body);
        return r;
    },
    income: async (body) => {
        const url = incomeAPIConfig.income;
        let r = await getDataWithParams(url, body);
        return r;
    },
    directTeam: async (body) => {
        const url = affiliateAPIConfig.directTeam;
        let r = await getDataWithParams(url, body);
        return r;
    },
    myTeam: async (body) => {
        const url = affiliateAPIConfig.myTeam;
        let r = await getDataWithParams(url, body);
        return r;
    },
    


}

export default requestApi;