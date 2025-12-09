import axios from 'axios';

const API_URL = 'https://ml-pipeline-demo.onrender.com';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_URL}/upload`, formData);
  return response.data;
};

export const runPipeline = async (formData) => {
  const data = new FormData();
  for (const key in formData) {
    data.append(key, formData[key]);
  }
  const response = await axios.post(`${API_URL}/run`, data);
  return response.data;
};