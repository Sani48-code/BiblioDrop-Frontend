import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

export const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`${API_URL}/api/auth/me`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await axios.post(
      `${API_URL}/api/auth/login`,
      { email, password },
      { withCredentials: true }
    )
    setUser(res.data.user || res.data)
    return res.data
  }

  const logout = async () => {
    await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true }).catch(() => {})
    setUser(null)
  }

  const register = async (data) => {
    const res = await axios.post(`${API_URL}/api/auth/register`, data, {
      withCredentials: true,
    })
    setUser(res.data.user || res.data)
    return res.data
  }

  const googleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`
  }

  const updateProfile = async (data) => {
    const res = await axios.patch(`${API_URL}/api/auth/profile`, data, {
      withCredentials: true,
    })
    setUser(res.data.user || res.data)
    return res.data
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, googleLogin, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
