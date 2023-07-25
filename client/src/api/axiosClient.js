import axios from "axios"


const BASE_URL = "http://localhost:5050/api/v1"

const axiosClient = axios.create({
    baseURL: BASE_URL
})

// JWTはlocalStorageに保存されるので、そこから取得する。
const getToken = () => localStorage.getItem("token")

// APIを叩く前に前処理を行う
// requestの前処理
axiosClient.interceptors.request.use(async (config) => {
    return {
        ...config,
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${getToken()}` // リクエストヘッダーにJWTをつけてサーバーに送信する。
        }
    }
})

// responseの前処理
axiosClient.interceptors.response.use(
    (res) => {
        console.log(res)
        return res.data
    },
    (err) => {
        throw err.response
    }
)

export default axiosClient;

