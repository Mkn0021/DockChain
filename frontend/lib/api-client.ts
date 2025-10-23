import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface SuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
}

export interface ErrorResponse {
    success: false;
    error: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export class ApiClient {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        if (!baseURL) {
            throw new Error('Environment variable: NEXT_PUBLIC_API_URL is not set.');
        }

        this.client = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.client.interceptors.request.use(
            (config) => {
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.data) {
                    return Promise.reject(error.response.data);
                }
                return Promise.reject({
                    success: false,
                    error: error.message || 'An unexpected error occurred'
                });
            }
        );
    }

    private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
        const apiResponse = response.data;
        if (apiResponse.success) {
            return apiResponse.data;
        }
        throw new Error((apiResponse as ErrorResponse).error);
    }

    async get<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.client.get<ApiResponse<T>>(url, config);
        return this.handleResponse(response);
    }

    async post<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.client.post<ApiResponse<T>>(url, data, config);
        return this.handleResponse(response);
    }

    async put<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.client.put<ApiResponse<T>>(url, data, config);
        return this.handleResponse(response);
    }

    async patch<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.client.patch<ApiResponse<T>>(url, data, config);
        return this.handleResponse(response);
    }

    async delete<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.client.delete<ApiResponse<T>>(url, config);
        return this.handleResponse(response);
    }

    async upload<T>(
        url: string,
        formData: FormData,
        onProgress?: (progress: number) => void
    ): Promise<T> {
        const response = await this.client.post<ApiResponse<T>>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    onProgress(progress);
                }
            },
        });
        return this.handleResponse(response);
    }

    setAuthToken(token: string | null) {
        if (token) {
            this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.client.defaults.headers.common['Authorization'];
        }
    }
}

export default new ApiClient(
    process.env.NEXT_PUBLIC_API_BASE_URL!
);