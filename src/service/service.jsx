import axios from "axios";
import { authAPIConfig } from "@/api/apiConfig";

async function postData(url, body) {
    try {
        let _r = await axios.post(url, body, {
            headers: {
                Authorization: "Bearer ".concat(localStorage.getItem("user_token")),
            },
        });
        return _r.data;
    } catch (res) {
        return res;
    }
}

async function postDataNoHeader(url, body) {
    try {
        let _r = await axios.post(url, body);
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
                Authorization: "Bearer ".concat(localStorage.getItem("user_token")),
            },
        });
        return _r.data;
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
}

export default requestApi;