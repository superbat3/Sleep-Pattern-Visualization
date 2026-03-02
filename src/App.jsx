import { useState } from "react";
import SleepProfile from "./SleepProfile.jsx";
import SlideDeck from "./SlideDeck.jsx";
import { slides } from "./slides.jsx";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useDataset } from "./hooks/loadData.js";

const theme = createTheme({
  palette: {
    primary: { main: grey[800] },
    secondary: { main: grey[700] },
    background: { default: "#ffffff" },
  },
});

export default function App() {
  const [mode, setMode] = useState("slides");
  const [slideIndex, setSlideIndex] = useState(0);
  
  const data = useDataset();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: "100vh", width: "100vw", overflow: "hidden", bgcolor: "background.default" }}>
        <Stack sx={{ height: "100%" }}>
          <Box
            sx={{
              flex: "0 0 auto",
              px: 2,
              py: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {mode === "slides" ? "Guided Mode" : "Explore Mode"}
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              {mode === "slides" ? (
                <Button variant="outlined" onClick={() => setMode("dashboard")}>
                  Skip to Dashboard
                </Button>
              ) : (
                <Button variant="outlined" onClick={() => setMode("slides")}>
                  Back to Slides
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ flex: "1 1 auto", minHeight: 0 }}>
            {mode === "slides" ? (
              <SlideDeck
                slides={slides}
                onFinish={() => setMode("dashboard")}
                onSlideChange={setSlideIndex}
              />
            ) : data ? (
              <SleepProfile 
                data={data}
                guidedContent={slides[slideIndex]}
              />
            ) : (
              <div style={{ padding: 20 }}>Loading dataset...</div>
            )}

          </Box>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}