import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const X_API_KEY = import.meta.env.VITE_X_API_KEY;

export const axiosApiInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(X_API_KEY ? { "X-API-Key": X_API_KEY } : {}),
  },
});

function isAuthRefreshRequest(url?: string) {
  return Boolean(url?.includes("/auth/refresh"));
}

function isPublicAuthRequest(url?: string) {
  return Boolean(
    url?.includes("/auth/login") ||
      url?.includes("/auth/register") ||
      url?.includes("/auth/verify-email") ||
      url?.includes("/auth/resend-verification-otp"),
  );
}

axiosApiInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const url = originalRequest.url;

    const shouldRefresh =
      status === 401 &&
      !originalRequest._retry &&
      !isAuthRefreshRequest(url) &&
      !isPublicAuthRequest(url);

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await axiosApiInstance.post("/auth/refresh");
      return axiosApiInstance(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
