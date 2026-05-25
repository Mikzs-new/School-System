import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"



import LoginPage from "./pages/auth/LoginPage.jsx"

import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx"

import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx"



import FacilitatorLayout from "./layouts/FacilitatorLayout.jsx"



import FacilitatorDashboardPage from "./pages/facilitator/DashboardPage.jsx"

import ElectionsPage from "./pages/facilitator/ElectionsPage.jsx"

import CandidatesPage from "./pages/facilitator/CandidatesPage.jsx"

import StudentsPage from "./pages/facilitator/StudentsPage.jsx"

import ResultsPage from "./pages/facilitator/ResultsPage.jsx"



import StudentDashboardPage from "./pages/student/DashboardPage.jsx"



import RoleProtectedRoute from "./routes/RoleProtectedRoute.jsx"



function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<LoginPage />}
        />



        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />



        <Route
          path="/password_reset/:uid/:token"
          element={<ResetPasswordPage />}
        />



        {/* Facilitator Routes */}

        <Route
          path="/facilitator"
          element={
            <RoleProtectedRoute
              allowedRoles={["school_staff"]}
            >
              <FacilitatorLayout />
            </RoleProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={
              <FacilitatorDashboardPage />
            }
          />



          <Route
            path="elections"
            element={<ElectionsPage />}
          />



          <Route
            path="candidates"
            element={<CandidatesPage />}
          />



          <Route
            path="students"
            element={<StudentsPage />}
          />



          <Route
            path="results"
            element={<ResultsPage />}
          />
        </Route>



        {/* Student Routes */}

        <Route
          path="/student/dashboard"
          element={
            <RoleProtectedRoute
              allowedRoles={["student"]}
            >
              <StudentDashboardPage />
            </RoleProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}



export default App