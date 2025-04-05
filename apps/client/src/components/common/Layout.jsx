import { AppBar, Box, Tabs, Tab } from "@mui/material";
import { Outlet, useLocation, Link } from "react-router";

export default function Layout() {
  const { pathname } = useLocation();
  const currentPage = pathname.replace("/app/", "");

  const pages = [
    { path: "dashboard", label: "Dashboard" },
    { path: "monitoring", label: "Monitoring" },
  ];

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
      <Outlet />
    </Box>
  );
}
