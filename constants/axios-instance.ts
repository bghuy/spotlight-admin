import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
const isServer = typeof window === 'undefined';


const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_MODE === 'production' ? process.env.NEXT_PUBLIC_SERVER_PRODUCTION_URL : process.env.NEXT_PUBLIC_SERVER_DEVELOPMENT_URL,
  timeout: 10000,
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(


  async (config: InternalAxiosRequestConfig) => {
    let token: string | undefined;

    if (isServer) {
      const { cookies } = await import('next/headers');
      // Server-side: Use Next.js cookies function
      const cookieStore = await cookies();
      token = cookieStore.get('auth_token')?.value;
    } else {
      // Client-side: Use js-cookie
      token = Cookies.get('auth_token');
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  async (response) => {
    return response.data;
  },
  async (error: AxiosError) => {
    // if (error.response) {
    //   console.error('Response error:', error.response.data);
    //   console.error('Status:', error.response.status);
    // } else if (error.request) {
    //   console.error('Request error:', error.request);
    // } else {
    //   console.error('Error:', error.message);
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;

