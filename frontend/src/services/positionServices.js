import api from "./api"



export const getPositions = async (
  electionId
) => {
  const response = await api.get(
    `/elections/${electionId}/positions/`
  )

  return response.data
}



export const createPosition = async (
  electionId,
  formData
) => {
  const response = await api.post(
    `/elections/${electionId}/positions/`,
    formData
  )

  return response.data
}



export const updatePosition = async (
  positionId,
  formData
) => {
  const response = await api.put(
    `/positions/${positionId}/`,
    formData
  )

  return response.data
}



export const deletePosition = async (
  positionId
) => {
  const response = await api.delete(
    `/positions/${positionId}/`
  )

  return response.data
}