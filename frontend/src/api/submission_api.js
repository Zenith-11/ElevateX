import axios from "axios";

const API = "http://localhost:8000/api/submissions";

// CREATE
export const createSubmission = async (formData) => {
  return await axios.post(API + "/", formData);
};

// GET ALL
export const getSubmissions = async () => {
  return await axios.get(API + "/");
};

// APPROVE
export const approveSubmission = async (id) => {
  return await axios.put(`${API}/${id}/approve`);
};

// REJECT
export const rejectSubmission = async (id, reason) => {
  return await axios.put(`${API}/${id}/reject?reason=${reason}`);
};