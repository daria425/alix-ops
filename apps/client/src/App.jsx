import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./services/AuthProvider";
import Index from "./components/Index";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      path: "/app",
      element: <ProtectedRoute />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
