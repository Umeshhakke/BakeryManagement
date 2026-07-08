import axios from 'axios';

const API = axios.create({
  baseURL: 'https://bakerymanagement-yjcx.onrender.com/api', // This points to your Django backend
});

export default API;