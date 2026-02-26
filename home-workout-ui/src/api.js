import axios from 'axios';

axios.defaults.withCredentials = true;

// ====== Přepínání prostředí ======
// Pro lokální vývoj: 'https://localhost:44341/'
// Pro produkci: 'https://homeworkoutwebapp.runasp.net/'
const BASE_URL = 'https://homeworkoutwebapp.runasp.net/';

// Zpracování chyb Axios
const handleError = error => {
  const msg = error.response?.data?.errors
    ? Object.values(error.response.data.errors)[0]
    : error.response?.data?.message || error.message || 'Neznámá chyba';

  if (error.response?.status === 404 && error.config.url.includes('AccessDenied')) return;
  if (error.response?.status === 405 && error.config.url.includes('Account/Login')) return;
  alert(`Chyba: ${msg}`);
  console.error(`Chyba: ${msg}`);
};

// Bezpečné získání dat – pokud server vrátí HTML (302 redirect), vrátí undefined
const safeData = (res) => {
  if (typeof res.data === 'string' && res.data.includes('<!DOCTYPE')) return undefined;
  return res.data;
};

// === Auth ===
export const authApi = {
  getUserInfo: () => axios.get(`${BASE_URL}Account/UserInfo`),
  login: (data) => axios.post(`${BASE_URL}Account/Login`, data, { withCredentials: true }),
  logout: () => axios.post(`${BASE_URL}Account/Logout`, {}, { withCredentials: true }),
};

// === Body Parts ===
export const bodyPartApi = {
  getAll: () => axios.get(`${BASE_URL}BodyParts`).then(safeData).catch(handleError),
  create: (data) => axios.post(`${BASE_URL}BodyParts`, data).catch(handleError),
  update: (id, data) => axios.put(`${BASE_URL}BodyParts/${id}`, data).catch(handleError),
  delete: (id) => axios.delete(`${BASE_URL}BodyParts/${id}`).catch(handleError),
};

// === Exercises ===
export const exerciseApi = {
  getAll: () => axios.get(`${BASE_URL}exercises`).then(safeData).catch(handleError),
  create: (data) => axios.post(`${BASE_URL}exercises`, data).catch(handleError),
  update: (id, data) => axios.put(`${BASE_URL}exercises/${id}`, data).catch(handleError),
  delete: (id) => axios.delete(`${BASE_URL}exercises/${id}`).catch(handleError),
};

// === Workout Plans ===
export const planApi = {
  getAll: () => axios.get(`${BASE_URL}WorkoutPlan`).then(safeData).catch(handleError),
  create: (data) => axios.post(`${BASE_URL}WorkoutPlan`, data).catch(handleError),
  update: (id, data) => axios.put(`${BASE_URL}WorkoutPlan/${id}`, data).catch(handleError),
  delete: (id) => axios.delete(`${BASE_URL}WorkoutPlan/${id}`).catch(handleError),
};

// === Workout Exercises ===
export const planExerciseApi = {
  getAll: () => axios.get(`${BASE_URL}WorkoutExercise`).then(safeData).catch(handleError),
  create: (data) => axios.post(`${BASE_URL}WorkoutExercise`, data).catch(handleError),
  update: (id, data) => axios.put(`${BASE_URL}WorkoutExercise/${id}`, data).catch(handleError),
  delete: (id) => axios.delete(`${BASE_URL}WorkoutExercise/${id}`).catch(handleError),
};

// === Users ===
export const userApi = {
  getAll: () => axios.get(`${BASE_URL}Users`).then(safeData).catch(handleError),
  create: (data) => axios.post(`${BASE_URL}Users/Create`, data).catch(handleError),
  update: (id, data) => axios.put(`${BASE_URL}Users/${id}`, data).catch(handleError),
  delete: (id) => axios.delete(`${BASE_URL}Users/${id}`).catch(handleError),
};

// === Roles ===
export const roleApi = {
  getAll: () => axios.get(`${BASE_URL}Roles`).then(res => { const d = safeData(res); return d?.roles; }).catch(handleError),
  getById: (id) => axios.get(`${BASE_URL}Roles/${id}`).then(res => res.data),
  create: (roleName) =>
    axios.post(`${BASE_URL}Roles/create`, roleName, { headers: { 'Content-Type': 'application/json' } }).catch(handleError),
  update: (data) => axios.post(`${BASE_URL}Roles`, data).catch(handleError),
  delete: (id) => axios.delete(`${BASE_URL}Roles/${id}`).catch(handleError),
};
