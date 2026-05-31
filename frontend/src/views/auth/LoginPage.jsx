import { useState } from "react"

import AuthLayout from "../../components/layout/AuthLayout"

import { login as apiLogin } from "../../api/auth"

import { authStore } from "../../state/authStore"



function LoginPage({ onAuthenticated }) {



  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })



  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")



  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }



  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)

    setError("")



    try {
      const response =
        await apiLogin(formData)



      console.log(
        "LOGIN SUCCESS:",
        response
      )



      const accessToken =
        response.access ||
        response.access_token ||
        response.token



      authStore.login(
        response.user || {},
        accessToken,
        response.role
      )

      onAuthenticated()
    }



    catch (error) {
      console.error(error)

      setError(
        error.response?.data?.detail ||
        "Invalid username or password"
      )
    }



    finally {
      setLoading(false)
    }
  }



  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Online Voting System
          </h1>

          <p className="text-zinc-400 mt-2">
            Ramon Magsaysay Memorial Colleges
          </p>
        </div>



        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
            />
          </div>



          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
            />
          </div>



          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}



          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
          >
            {
              loading
                ? "Signing In..."
                : "Sign In"
            }
          </button>



          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-400 hover:text-blue-300 transition"
            >
              Forgot Password?
            </button>
          </div>

        </form>
      </div>
    </AuthLayout>
  )
}



export default LoginPage