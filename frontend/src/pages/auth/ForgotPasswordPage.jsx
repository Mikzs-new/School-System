import { useState } from "react"

import AuthLayout from "../../layouts/AuthLayout"

import api from "../../services/api"



function ForgotPasswordPage() {
  const [email, setEmail] = useState("")

  const [loading, setLoading] = useState(false)

  const [success, setSuccess] = useState("")

  const [error, setError] = useState("")



  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)

    setError("")

    setSuccess("")



    try {
      const response = await api.post(
        "/auth/forgot_password/",
        {
          email,
        }
      )



      setSuccess(
        response.data.message
      )
    }



    catch (error) {
      console.error(error)

      setError(
        "Unable to process request."
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
            Forgot Password
          </h1>

          <p className="text-zinc-400 mt-2">
            Enter your email to receive a reset link
          </p>
        </div>



        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
            />
          </div>



          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm">
              {success}
            </div>
          )}



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
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}

export default ForgotPasswordPage