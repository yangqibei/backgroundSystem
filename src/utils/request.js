import axios from 'axios'

const request = axios.create({
  baseURL: 'http://liufusong.top:8899/api/private/v1/',
  timeout: 5000
})
export default request
