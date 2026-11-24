import api from '../../../lib/axios'

const linkService = {
  getAll: () => api.get('/links'),
  create: (payload) => api.post('/links', payload),
  remove: (id) => api.delete(`/links/${id}`),
}

export default linkService
