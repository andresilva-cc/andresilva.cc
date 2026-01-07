import axios from 'axios';

export const ForemClient = axios.create({
  baseURL: process.env.FOREM_API_URL,
  headers: {
    'accept': 'application/vnd.forem.api-v1+json',
    'api-key': process.env.FOREM_API_KEY,
  },
});
