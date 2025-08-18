import axios, { AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from 'axios';

type axiosCustomProps = {
    url: string;
    method?: 'get' | 'post' | 'put' | 'delete';
    contentType?: 'application/x-www-form-urlencoded' | 'application/json' | 'multipart/form-data' | null;
    responseType?: 'json';
    timeout?: number;
    data?: any;
};

export async function axiosCustom({
    url,
    method = 'get',
    contentType = 'application/json',
    responseType = 'json',
    timeout = 30000,
    data = null,
}: axiosCustomProps): Promise<AxiosResponse<any, any>> {
    const headers: RawAxiosRequestHeaders = {};

    if (!contentType) {
        headers['Content-Type'] = contentType; // application/x-www-form-urlencoded
    }

    return axios.request({
        url: url,
        method: method,
        headers: headers,
        responseType: responseType,
        timeout: timeout,
        validateStatus() {
            return true;
        },
        data: data,
    } as AxiosRequestConfig);
}
