
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";


export default function App() {
  return (
    <div>
      <Routes>
        {/* Layout for the entire application */}
        <Route element={<Layout />}>
        {/* Auth Route */}
          <Route path="/signin" element={<AuthPage mode="signin" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />



          <Route path="/" element={<HomePage />} />


          {/* fallback page when user go on any other page that doen't exists */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </div>
  );
}
