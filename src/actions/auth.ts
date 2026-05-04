import api from './api';

export const loginAction = async (data: any) => {
  try {
    const response = await api.post('/auth/signin', data);
    if (response.data.success) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      // Decode JWT or use returned data to save user role
      const base64Url = response.data.data.accessToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      localStorage.setItem('user', JSON.stringify(payload));
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const logoutAction = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const changePasswordAction = async (data: any) => {
  try {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
