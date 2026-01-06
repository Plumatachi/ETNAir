import axios from 'axios'

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/connexion'
        }
        return Promise.reject(error)
    }
)

export default {
    getHomes() {
        return apiClient.get('/homes')
    },
    getHome(id) {
        return apiClient.get(`/homes/${id}`)
    },
    createHome(data) {
        return apiClient.post('/home', data)
    },

    login(credentials) {
        return apiClient.post('/auth/login', credentials)
    },
    register(userData) {
        return apiClient.post('/auth/register', userData)
    },

    getCurrentUser() {
        return apiClient.get('/user/profile')
    }
}