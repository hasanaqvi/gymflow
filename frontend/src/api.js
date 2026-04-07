import axios from "axios"

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
})

export const getExercises = () => api.get("/exercises/")
export const getSessions = () => api.get("/sessions/")
export const getSession = (id) => api.get(`/sessions/${id}`)
export const createSession = (data) => api.post("/sessions/", data)
export const deleteSession = (id) => api.delete(`/sessions/${id}`)
export const addExerciseToSession = (sessionId, data) =>
  api.post(`/sessions/${sessionId}/exercises`, data)
export const createSet = (data) => api.post("/sets/", data)
export const deleteSet = (id) => api.delete(`/sets/${id}`)
export const getRecommendation = () => api.get("/recommend/")