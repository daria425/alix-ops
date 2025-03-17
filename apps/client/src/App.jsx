import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./services/AuthProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import Index from "./components/common/Index";
import LoginForm from "./components/auth/LoginForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
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
          path: "",
          element: <Layout />,
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "monitoring", element: <div>Monitoring</div> },
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
