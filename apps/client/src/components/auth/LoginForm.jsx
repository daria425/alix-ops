import { useReducer, useContext } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { deepOrange } from "@mui/material/colors";
import { formReducer } from "../../reducers/formReducer";
import { useNavigate } from "react-router";
import { AuthContext } from "../../services/AuthProvider";
const initialState = {
  email: "",
  password: "",
};

function LargeScreenLogin({ state, handleInputChange, handleLogin }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(300px, 40%) 1fr",
        height: "100vh",
        bgcolor: deepOrange[50],
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <Box
          component="form"
          onSubmit={async (e) => {
            handleLogin(e, "email");
          }}
          sx={{
            mt: 2,
            width: "100%",

            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 500 }}>
            Log in
          </Typography>
          <div className="auth__field">
            <TextField
              required
              type="text"
              id="email"
              label="Email"
              name="email"
              variant="outlined"
              value={state.email}
              onChange={(e) => {
                handleInputChange(e);
              }}
              sx={{
                width: "100%",
              }}
              className="auth__input"
            ></TextField>
          </div>
          <TextField
            label="Password"
            required
            type="password"
            id="password"
            name="password"
            value={state.password}
            className="auth__input"
            sx={{
              width: "100%",
            }}
            onChange={(e) => {
              handleInputChange(e);
            }}
          ></TextField>
          <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
            <Button variant="outlined" color="primary" type="submit">
              Log In
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={(e) => {
                handleLogin(e, "google");
              }}
              sx={{ display: "flex", gap: 1, alignItems: "center" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                height={"1em"}
                width={"1em"}
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Log in with Google
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundImage: `url("/login-bg.svg")`,
          width: "100%",
          height: "100%",
          backgroundSize: "cover", // Optional: This ensures the image covers the container
          backgroundRepeat: "no-repeat",
        }}
      ></Box>
    </Box>
  );
}

function MobileLogin({ state, handleInputChange, handleLogin }) {
  return (
    <Box
      sx={{
        backgroundImage: `url("/login-bg.svg")`,
        width: "100%",
        height: "100vh",
        backgroundSize: "cover", // Optional: This ensures the image covers the container
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="form"
        sx={{
          mt: 2,
          width: "100%",

          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: 3,
        }}
        onSubmit={async (e) => {
          handleLogin(e, "email");
        }}
      >
        <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 400 }}>
          Log in
        </Typography>
        <div className="auth__field">
          <TextField
            required
            type="text"
            id="email"
            label="Email"
            name="email"
            variant="outlined"
            value={state.email}
            onChange={(e) => {
              handleInputChange(e);
            }}
            sx={{
              width: "100%",
            }}
            className="auth__input"
          ></TextField>
        </div>

        <TextField
          label="Password"
          required
          type="password"
          id="password"
          name="password"
          value={state.password}
          className="auth__input"
          sx={{
            width: "100%",
          }}
          onChange={(e) => {
            handleInputChange(e);
          }}
        ></TextField>
        <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
          <Button variant="outlined" color="white" type="submit">
            Log In
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={(e) => {
              handleLogin(e, "google");
            }}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height={"1em"}
              width={"1em"}
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Log in with Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
export default function LoginForm() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { login, loginWithGoogle } = useContext(AuthContext);
  const nav = useNavigate();
  const handleInputChange = (e) => {
    dispatch({
      type: "USER_INPUT",
      field: e.target.name,
      payload: e.target.value,
    });
  };

  const handleLogin = async (e, provider) => {
    e.preventDefault();
    try {
      switch (provider) {
        case "email":
          await login(state.email, state.password);
          break;
        case "google":
          await loginWithGoogle();
          break;
      }
      nav("/app/dashboard");
    } catch (err) {
      console.error("Signup error", err);
    }
  };
  return isMobile ? (
    <MobileLogin
      state={state}
      handleInputChange={handleInputChange}
      handleLogin={handleLogin}
    />
  ) : (
    <LargeScreenLogin
      state={state}
      handleInputChange={handleInputChange}
      handleLogin={handleLogin}
    />
  );
}
