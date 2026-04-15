import axios, { AxiosError, AxiosInstance } from "axios";

const BASE_URL = "https://k8s.mectest.ru/test-app";

// Token provider — injected from AuthStore after init
let _tokenProvider: (() => string | null) | null = null;

export function setTokenProvider(fn: () => string | null) {
  _tokenProvider = fn;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = _tokenProvider?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(new Error("NETWORK_ERROR"));
    }
    return Promise.reject(error);
  },
);
