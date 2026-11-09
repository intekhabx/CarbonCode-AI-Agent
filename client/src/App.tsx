
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import { useRenewToken, useUserProfile } from "./hooks/useAuth";
import Loading from "./components/Loading";
import BuilderPage from "./pages/BuilderPage";


export default function App() {

  // calling on every refresh
  const {isPending} = useRenewToken();
  const {user, isLoading} = useUserProfile();
  
  // Return the loading UI on pending call
  if(isPending || isLoading) return <Loading />;


  return (
    <div>
      <Routes>
        {/* Layout for the entire application */}
        <Route element={<Layout />}>
        {/* Auth Route */}
          <Route path="/signin" element={user ? <Navigate to="/" replace /> : <AuthPage mode="signin" />} />
          <Route path="/signup" element={user ? <Navigate to="/" replace /> : <AuthPage mode="signup" />} />



          <Route path="/" element={<HomePage />} />
          <Route path="/builder" element={ user ? <BuilderPage /> : <Navigate to="/signin" replace /> } />


          {/* fallback page when user go on any other page that doen't exists */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </div>
  );
}
