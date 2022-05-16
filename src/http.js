import axios from 'axios'
// const baseUrl = ""
const token = JSON.parse(localStorage.getItem('user'))
const baseUrl = 'http://k38j348217.zicp.vip'
const instance = axios.create({
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json'
    }
})
instance.defaults.baseURL = baseUrl;
if (token){
    instance.defaults.headers.common["Authorization"] =  token.token;
}
export default instance