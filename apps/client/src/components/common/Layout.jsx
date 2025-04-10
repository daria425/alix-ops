import { AppBar, Box, Tabs, Tab, Container } from "@mui/material";
import { Outlet, useLocation, Link } from "react-router";

export default function Layout() {
  const { pathname } = useLocation();
  const currentPage = pathname.replace("/app/", "");

  const pages = [
    { path: "dashboard", label: "Dashboard" },
    { path: "monitoring", label: "Monitoring" },
  ];

  const containerStyle = {
    "default": {},
    "monitoring": {
      "display": "flex",
      "flexDirection": "column",
      "gap": 2,
    },
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "grid",
        height: "100vh",
        gridTemplateRows: "auto 1fr",
      }}
    >
      <AppBar position="static">
        <Tabs
          value={currentPage}
          textColor="secondary"
          indicatorColor="secondary"
        >
          {pages.map((page, index) => (
            <Tab
              key={index}
              label={page.label}
              value={page.path}
              component={Link}
              to={`/app/${page.path}`}
            />
          ))}
        </Tabs>
      </AppBar>
      <Container
        maxWidth="xl"
        sx={{
          ...(containerStyle[currentPage] || containerStyle["default"]),
          padding: 2,
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
