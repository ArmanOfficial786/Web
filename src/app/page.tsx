import LoginForm from "@/components/auth/Login";
import NavMarquee from "@/utilis/NavMarquee";
import Box from "@mui/material/Box";

const MARQUEE_HEIGHT = 56;

export default function HomePage() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(to bottom right, #0f172a, #1e3a8a, #581c87)",
      }}
    >
      {/* Navbar at top */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: MARQUEE_HEIGHT,
          zIndex: 50,
        }}
      >
        <NavMarquee />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: `${MARQUEE_HEIGHT + 15}px`,
          pb: 3,
          px: 2,
        }}
      >
        <LoginForm />
      </Box>
    </Box>
  );
}
