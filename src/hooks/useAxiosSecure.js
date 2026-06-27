import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

export const useAxiosSecure = () => {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  axiosSecure.interceptors.response.use(
    (res) => res,
    async (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        await logout()
        navigate('/login')
      }
      return Promise.reject(error)
    }
  )

  return axiosSecure
}
