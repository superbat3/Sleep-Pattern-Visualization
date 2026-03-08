import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";

export default function SlideDeck({ slides, onFinish, onSlideChange }) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);

  const hasSlides = !!slides?.length;
  const isFirst = index === 0;
  const isLast = hasSlides ? index === slides.length - 1 : true;
  const slide = hasSlides ? slides[index] : null;

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
  }, []);

  const goPrev = () => setIndex((v) => Math.max(0, v - 1));
  const goNext = () => setIndex((v) => Math.min(slides.length - 1, v + 1));

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
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#f0f2f7",
      }}
      onClick={onClickHalfNav}
    >
      {/* Scrollable slide area */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          minHeight: 0,
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 4 },
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Slide Frame */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 900,
            my: "auto",
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: "linear-gradient(180deg, #ffffff 0%, #f7f8fb 100%)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            textAlign: "left",
            animation: "fadeIn 0.45s ease",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(14px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {/* Slide Progress */}
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "text.secondary",
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
              lineHeight: 1.1,
              mb: 2,
              color: "#1a1a1a",
            }}
          >
            {slide.title}
          </Typography>

          {/* Subtitle */}
          {slide.subtitle && (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 3,
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                lineHeight: 1.4,
              }}
            >
              {slide.subtitle}
            </Typography>
          )}

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
              lineHeight: 1.75,
              fontSize: { xs: 17, md: 19 },
              color: "text.primary",
              mt: 2,
            }}
          >
            {slide.body}
          </Typography>
        </Box>
      </Box>

      {/* Navigation Bar */}
      <Box
        sx={{
          px: { xs: 3, md: 6 },
          py: 2.5,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fafafa",
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
              background: "linear-gradient(90deg, #4a6cf7, #6a8bff)",
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
              background: "linear-gradient(90deg, #4a6cf7, #6a8bff)",
            }}
          >
            Start Exploring →
          </Button>
        )}
      </Box>
    </Box>
  );
}
