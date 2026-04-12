import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

const api = axios.create({
  baseURL: BASE_URL,
})

export const getExercises = () => api.get("/exercises/")
export const createExercise = (data) => api.post("/exercises/", data)
export const updateExercise = (id, data) => api.put("/exercises/" + id, data)
export const deleteExercise = (id) => api.delete("/exercises/" + id)
export const getSessions = () => api.get("/sessions/")
export const getSession = (id) => api.get("/sessions/" + id)
export const createSession = (data) => api.post("/sessions/", data)
export const deleteSession = (id) => api.delete("/sessions/" + id)
export const addExerciseToSession = (sessionId, data) =>
  api.post("/sessions/" + sessionId + "/exercises", data)
export const createSet = (data) => api.post("/sets/", data)
export const deleteSet = (id) => api.delete("/sets/" + id)
export const getRecommendation = () => api.get("/recommend/")

export default api
