const key = import.meta.env.VITE_API_URL;

export const authAPIConfig = {
    login: key + '/auth/login',
}