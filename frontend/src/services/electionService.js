import api from "./api"



export const getElections = async () => {
  const response = await api.get(
    "/elections/elections/"
  )

  return response.data
}



export const createElection = async (
  formData
) => {
  const response = await api.post(
    "/elections/elections/",
    formData
  )

  return response.data
}



export const updateElection = async (
  electionId,
  formData
) => {
  const response = await api.put(
    `/elections/elections/${electionId}/`,
    formData
  )

  return response.data
}



export const deleteElection = async (
  electionId
) => {
  const response = await api.delete(
    `/elections/elections/${electionId}/`
  )

  return response.data
}