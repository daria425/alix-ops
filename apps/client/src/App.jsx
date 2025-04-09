import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./services/AuthProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import {
  ApplicationError,
  AuthenticationError,
} from "./components/common/ErrorElements";
import Index from "./components/common/Index";
import LoginForm from "./components/auth/LoginForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Monitor from "./components/monitoring/Monitor";
import Dashboard from "./components/dashboard/Dashboard";
import Layout from "./components/common/Layout";
const theme = createTheme({
  palette: {
    primary: {
      main: "#ee6d4d",
    },

    secondary: {
      main: "#0e1614",
    },
  },
});
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
      errorElement: <ApplicationError />,
    },
    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      path: "/403",
      element: <AuthenticationError />,
      errorElement: <ApplicationError />,
    },
    {
      path: "/app",
      element: <ProtectedRoute />,
      errorElement: <ApplicationError />,
      children: [
        {
          path: "",
          element: <Layout />,
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "monitoring", element: <Monitor /> },
          ],
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
