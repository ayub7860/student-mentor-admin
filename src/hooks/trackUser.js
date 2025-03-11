import axios from 'axios';
export const trackUser = (name, pathToModule, details, fileName) => {
  axios.post(`${import.meta.env.VITE_API_URL}/api/profileApi/userTracking`, {
    name, pathToModule, details, fileName
  });
}