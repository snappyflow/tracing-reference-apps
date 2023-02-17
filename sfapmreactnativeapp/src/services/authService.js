
import axiosInstance from "./axiosInstance";

// const baseUrl = 'https://apmmanager.snappyflow.io';
// const axiosInstance = axios.create({ baseURL: baseUrl });

const signIn = async (email, _password) => {
    const url = `/user/login`;
    const payload = {
        username: email,
        password: _password
    }
    const response = await axiosInstance.post(url, payload);
    console.log('response', response.data);
    return response.data;
};

const signOut = async () => {
    const url = `/user/logout`;
    const payload = {
    }
    const response = await axiosInstance.post(url, payload);
    return response.data;
};

  const fetchProjects = async ()  => {
    const url = `/snappyflow/projects?limit=20&offset=0&sort_by=project_name&sort_order=asc`;
    const response = await axiosInstance.get(url);
    return response.data;
  }
  
  export const authService = {
    signIn,
    signOut,
    fetchProjects
  };