import { Navigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"



function RoleProtectedRoute({
  children,
  allowedRoles,
}) {
  const {
    token,
    role,
    loading,
  } = useAuth()



  if (loading) {
    return null
  }



  if (!token) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }



  if (
    !role ||
    !allowedRoles.includes(role)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }



  return children
}



export default RoleProtectedRoute