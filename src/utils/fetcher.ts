import Axios, { type AxiosResponse } from 'axios';

const axios = Axios.create({
  baseURL: 'https://www.googleapis.com/books/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const fetcher = {
  get: <R = unknown>(url: string, query?: { [key: string]: unknown }): Promise<R> =>
    axios<R>(url, { method: 'GET', params: { query } }).then(handleResponse),
  post: <R = unknown, D = {}>(url: string, body: D): Promise<R> =>
    axios<R>(url, { method: 'POST', params: { body } }).then(handleResponse),
};

async function handleResponse(res: AxiosResponse) {
  const result = res.data;
  return result;
}
