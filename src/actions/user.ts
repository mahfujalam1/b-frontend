import api from './api';

export const getAllUsersAction = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const deleteUserAction = async (id: string) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
