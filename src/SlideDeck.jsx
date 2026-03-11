import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useRef, useState } from "react";

const defaultTheme = {
  canvasBackground: "linear-gradient(135deg, #dae3f5 0%, #cfdaf1 100%)",
  frameBackground: "linear-gradient(180deg, #ffffff 0%, #f7f8fb 100%)",
  frameBorder: "1px solid rgba(34, 49, 74, 0.14)",
  accent: "#4A6CF7",
  accentSoft: "rgba(74, 108, 247, 0.13)",
  titleColor: "#1A1E2A",
  subtitleColor: "#42506E",
  navBackground: "#f4f6fb",
  buttonAccentEnd: "#6A8BFF",
};

export default function SlideDeck({ slides, onFinish, onSlideChange }) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);

  const hasSlides = !!slides?.length;
  const isFirst = index === 0;
  const isLast = hasSlides ? index === slides.length - 1 : true;
  const slide = hasSlides ? slides[index] : null;
  const theme = slide?.theme ?? defaultTheme;
  const accent = theme.accent ?? defaultTheme.accent;
  const accentSoft = theme.accentSoft ?? defaultTheme.accentSoft;
  const buttonAccentEnd = theme.buttonAccentEnd ?? defaultTheme.buttonAccentEnd;
  const canvasBackground = slide?.backgroundImage
    ? `linear-gradient(135deg, rgba(10, 18, 33, 0.54), rgba(20, 38, 66, 0.42)), url('${slide.backgroundImage}'), ${theme.canvasBackground}`
    : theme.canvasBackground;
  const goPrev = useCallback(() => setIndex((v) => Math.max(0, v - 1)), []);
  const goNext = useCallback(
    () => setIndex((v) => Math.min(slides.length - 1, v + 1)),
    [slides.length],
  );

  // Notify parent when slide changes
  useEffect(() => {
    if (!hasSlides) return;
    onSlideChange?.(index);
  }, [index, onSlideChange, hasSlides]);

  // Reset scroll on slide change
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [index]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const onClickHalfNav = (e) => {
    if (!hasSlides) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) goPrev();
    else isLast ? onFinish?.() : goNext();
  };

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!hasSlides) return null;

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: canvasBackground,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background 300ms ease",
      }}
      onClick={onClickHalfNav}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 14% 16%, rgba(255,255,255,0.24), transparent 28%), radial-gradient(circle at 88% 78%, rgba(255,255,255,0.18), transparent 26%)",
        }}
      />

      {/* Scrollable slide area */}
      <Box
        ref={scrollRef}
        sx={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          minHeight: 0,
          px: { xs: 2, md: 6 },
          py: 0,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Slide Frame */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            my: "auto",
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            border: theme.frameBorder,
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.74), rgba(246, 249, 255, 0.56))",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            boxShadow: "0 12px 34px rgba(10, 20, 40, 0.16)",
            textAlign: "left",
            fontFamily:
              "\"Avenir Next\", \"Segoe UI\", \"Helvetica Neue\", Arial, sans-serif",
            animation: "fadeIn 0.45s ease",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(14px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1.5,
              py: 0.7,
              mb: 2,
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 0.4,
              color: accent,
              background: accentSoft,
              textTransform: "uppercase",
            }}
          >
            Guided Story
          </Box>

          {/* Slide Progress */}
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: theme.subtitleColor,
              mb: 2,
            }}
          >
            Slide {index + 1} / {slides.length}
          </Typography>

          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2.4rem", md: "3.2rem" },
              lineHeight: 1.08,
              letterSpacing: -0.6,
              mb: 2,
              color: theme.titleColor,
            }}
          >
            {slide.title}
          </Typography>

          {/* Subtitle */}
          {slide.subtitle && (
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                lineHeight: 1.45,
                color: theme.subtitleColor,
                fontWeight: 500,
              }}
            >
              {slide.subtitle}
            </Typography>
          )}

          {slide.highlights?.length ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mb: 2.2,
              }}
            >
              {slide.highlights.map((item) => (
                <Box
                  key={item}
                  sx={{
                    px: 1.4,
                    py: 0.8,
                    borderRadius: 999,
                    border: `1px solid ${accent}33`,
                    background: accentSoft,
                    color: theme.titleColor,
                    fontSize: 13,
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box>
          ) : null}

          {/* Optional Image */}
          {slide.image && (
            <Box
              component="img"
              src={slide.image}
              alt=""
              sx={{
                width: "100%",
                borderRadius: 3,
                my: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
            />
          )}

          {/* Body */}
          <Typography
            component="div"
            sx={{
              lineHeight: 1.7,
              fontSize: { xs: 17, md: 18 },
              color: "text.primary",
              mt: 2,
              "& p": {
                mt: 0,
                mb: 1.9,
                fontSize: { xs: 17, md: 18 },
                lineHeight: 1.7,
                color: "rgba(20, 29, 45, 0.95)",
                textWrap: "pretty",
              },
              "& ul": {
                pl: 2.6,
                mt: 0.4,
                mb: 2,
                display: "grid",
                gap: 0.9,
              },
              "& li": {
                mb: 0,
                fontSize: { xs: 17, md: 18 },
                lineHeight: 1.65,
                color: "rgba(20, 29, 45, 0.95)",
                textWrap: "pretty",
              },
              "& li::marker": { color: accent, fontSize: "1.05em" },
              "& b": { color: theme.titleColor, fontWeight: 800 },
            }}
          >
            {slide.body}
          </Typography>
        </Box>
      </Box>

      {/* Navigation Bar */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 3, md: 6 },
          py: 1.2,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: theme.navBackground,
        }}
        onClick={stop}
      >
        <Button
          variant="outlined"
          onClick={goPrev}
          disabled={isFirst}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 700,
            borderColor: `${accent}77`,
            color: accent,
          }}
        >
          ← Back
        </Button>

        {!isLast ? (
          <Button
            variant="contained"
            onClick={goNext}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 700,
              background: `linear-gradient(90deg, ${accent}, ${buttonAccentEnd})`,
            }}
          >
            Next →
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={onFinish}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 700,
              background: `linear-gradient(90deg, ${accent}, ${buttonAccentEnd})`,
            }}
          >
            Start Exploring →
          </Button>
        )}
      </Box>
    </Box>
  );
}
