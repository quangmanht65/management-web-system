import api from './axios';

const getContracts = async () => {
  try {
    const response = await api.get('/employee/contracts/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getContractById = async (contractId) => {
  try {
    const response = await api.get(`/employee/contracts/detail/${contractId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const createContract = async (contractData) => {
  try {
    const response = await api.post('/employee/contracts', contractData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const deleteContract = async (contractId) => {
  try {
    const response = await api.delete(`/employee/contracts/${contractId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const updateContract = async (contractId, contractData) => {
  try {
    const response = await api.put(`/employee/contracts/${contractId}`, contractData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const contractService = {
  getContracts,
  getContractById,
  createContract,
  deleteContract,
  updateContract
}; 