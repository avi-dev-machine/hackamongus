import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://avi-dev-machine-hackamongus.hf.space/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add interceptor for auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// Add interceptor to handle 401 Unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const leaderboardAPI = {
  getLeaderboard: () => api.get('/leaderboard'),
  getTeamDetails: (id: string) => api.get(`/teams/${id}`),
  searchTeams: (query: string) => api.get(`/teams/search?q=${query}`),
};

export const adminAPI = {
  verify: () => api.get('/admin/verify'),
  login: (credentials: any) => api.post('/admin/login', credentials),
  addTeam: (team: any) => api.post('/admin/team', team),
  deleteTeam: (id: number) => api.delete(`/admin/team/${id}`),
  addScore: (score: any) => api.post('/admin/score', score),
  exportExcel: () => api.get('/admin/export', { responseType: 'blob' }),
};

export default api;
