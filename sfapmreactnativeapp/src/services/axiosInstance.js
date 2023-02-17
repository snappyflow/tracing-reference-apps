import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const axiosInstance = () => {
  const defaultOptions = {
    baseURL: 'https://apmmanager.snappyflow.io',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Create instance
  let instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  instance.interceptors.request.use(async(config) => {
    const authData = JSON.parse(await AsyncStorage.getItem('@AuthData'));
    const token = authData ? authData.token : null;
    config.headers.Authorization =  token ? token : '';
    return config;
  });

  instance.interceptors.response.use(response => {
    return response
  }, async (error) => {
    if (error.response.status === 401) {
        await AsyncStorage.removeItem('@AuthData');
    }
    return error;
  });

  return instance;
};

export default axiosInstance();