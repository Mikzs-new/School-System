import { useState } from "react"

import apiClient from "../../api/apiClient"

import AuthLayout from "../../components/layout/AuthLayout"



function ResetPasswordPage({ uid, token, onResetComplete }) {



  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })



  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
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

    setError("")
    setSuccess("")



    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match")

      return
    }



    try {
      setLoading(true)

      const response = await apiClient.post(
        "/auth/reset_password/",
        {
          uid,
          token,
          password: formData.password,
        }
      )



      setSuccess(
        response.data.message
      )



      setTimeout(() => {
        onResetComplete()
      }, 2000)
    }

    catch (error) {
      console.error(error)

      setError(
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        "Unable to reset password"
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
            Reset Password
          </h1>

          <p className="text-zinc-400 mt-2">
            Enter your new password
          </p>
        </div>



        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              New Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
            />
          </div>



          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
            />
          </div>



          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}



          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm">
              {success}
            </div>
          )}



          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
          >
            {
              loading
                ? "Resetting..."
                : "Reset Password"
            }
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}



export default ResetPasswordPage