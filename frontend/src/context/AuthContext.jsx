import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"



const AuthContext = createContext()



export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null)

  const [token, setToken] =
    useState(null)

  const [role, setRole] =
    useState(null)

  const [loading, setLoading] =
    useState(true)



  useEffect(() => {
    const storedToken =
      localStorage.getItem("token")

    const storedRole =
      localStorage.getItem("role")

    const storedUser =
      localStorage.getItem("user")



    if (storedToken) {
      setToken(storedToken)
    }



    if (storedRole) {
      setRole(storedRole)
    }



    if (storedUser) {
      setUser(
        JSON.parse(storedUser)
      )
    }



    setLoading(false)
  }, [])



  const login = (
    userData,
    accessToken,
    userRole
  ) => {
    localStorage.setItem(
      "token",
      accessToken
    )

    localStorage.setItem(
      "role",
      userRole
    )

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    )



    setUser(userData)

    setToken(accessToken)

    setRole(userRole)
  }



  const logout = () => {
    localStorage.removeItem("token")

    localStorage.removeItem("role")

    localStorage.removeItem("user")



    setUser(null)

    setToken(null)

    setRole(null)
  }



  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}



export function useAuth() {
  return useContext(AuthContext)
}