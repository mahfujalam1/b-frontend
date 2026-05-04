import api from './api';

export const getExpensesAction = async (query = '') => {
  try {
    const response = await api.get(`/expenses${query}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const createExpenseAction = async (data: any) => {
  try {
    const response = await api.post('/expenses', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updateExpenseAction = async (id: string, data: any) => {
  try {
    const response = await api.patch(`/expenses/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const deleteExpenseAction = async (id: string) => {
  try {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getStatsAction = async () => {
  try {
    const response = await api.get('/expenses/stats');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getPartnerStatsAction = async () => {
  try {
    const response = await api.get('/expenses/partner-stats');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
