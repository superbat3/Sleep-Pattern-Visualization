import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";

function useResizeObserver(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    const ro = new ResizeObserver(update);
    ro.observe(el);

    window.addEventListener("resize", update);
    update();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return size;
}

function deterministicJitter(index, amt, offset = 0) {
  const seed = Math.sin((index + 1) * 12.9898 + offset * 78.233) * 43758.5453;
  const frac = seed - Math.floor(seed);
  return (frac - 0.5) * amt;
}

export default function ScatterPlot({ data }) {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  const { width } = useResizeObserver(wrapRef);

  const height = 220;
  const pad = { top: 8, right: 16, bottom: 34, left: 60 };

  const innerW = Math.max(0, (width || 0) - pad.left - pad.right);
  const innerH = height - pad.top - pad.bottom;

  const points = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((d, i) => ({
      sleep: +d.sleepDuration + deterministicJitter(i, 0.25, 1),
      stress: +d.stress + deterministicJitter(i, 0.25, 2),
    }));
  }, [data]);

  const dotColor = "#4A6CF7";

  const maxStress = (d3.max(points, (d) => d.stress) ?? 10) + 0.5;
  const minStress = (d3.min(points, (d) => d.stress) ?? 0) - 0.5;

  const maxSleep = (d3.max(points, (d) => d.sleep) ?? 10) + 0.5;
  const minSleep = (d3.min(points, (d) => d.sleep) ?? 0) - 0.5;

  const x = d3.scaleLinear().domain([minStress, maxStress]).range([0, innerW]);

  const y = d3.scaleLinear().domain([minSleep, maxSleep]).range([innerH, 0]);

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;
    if (!width || width === 0) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    const dots = svg.selectAll("circle.dot").data(points, (_, i) => i);

    dots
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", () => pad.left + innerW / 2)
      .attr("cy", () => pad.top + innerH / 2)
      .attr("r", 0)
      .attr("fill", dotColor)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("opacity", 0.85)
      .on("mousemove", function (event, d) {
        tooltip
          .style("opacity", 1)
          .style("left", `${event.offsetX + 12}px`)
          .style("top", `${event.offsetY + 12}px`)
          .html(`
            <div>Sleep: ${d.sleep.toFixed(1)} hrs</div>
            <div>Stress: ${d.stress.toFixed(1)}</div>
          `);
      })
      .on("mouseleave", () => tooltip.style("opacity", 0))
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr("cx", (d) => pad.left + x(d.stress))
      .attr("cy", (d) => pad.top + y(d.sleep))
      .attr("r", 4);

    dots
      .on("mousemove", function (event, d) {
        tooltip
          .style("opacity", 1)
          .style("left", `${event.offsetX + 12}px`)
          .style("top", `${event.offsetY + 12}px`)
          .html(`
            <div>Sleep: ${d.sleep.toFixed(1)} hrs</div>
            <div>Stress: ${d.stress.toFixed(1)}</div>
          `);
      })
      .on("mouseleave", () => tooltip.style("opacity", 0))
      .transition()
      .duration(600)
      .attr("cx", (d) => pad.left + x(d.stress))
      .attr("cy", (d) => pad.top + y(d.sleep));

    dots.exit().remove();
  }, [points, width, innerW, innerH, x, y]);

  if (!width || width === 0) {
    return (
      <div
        ref={wrapRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          minWidth: 0,
        }}
      />
    );
  }

  return (
    <div
      ref={wrapRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          pointerEvents: "none",
          background: "rgba(0,0,0,0.75)",
          color: "white",
          padding: "6px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          opacity: 0,
          transition: "opacity 0.15s",
          maxWidth: "140px",
          zIndex: 2,
        }}
      />

      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${Math.max(1, width || 1)} ${height}`}
      >
        <line
          x1={pad.left}
          y1={pad.top + innerH}
          x2={pad.left + innerW}
          y2={pad.top + innerH}
          stroke="currentColor"
          opacity="0.35"
        />
        <text
          x={pad.left + innerW / 2}
          y={pad.top + innerH + 28}
          fontSize="11"
          textAnchor="middle"
          opacity="0.75"
        >
          Stress Level
        </text>

        <line
          x1={pad.left}
          y1={pad.top}
          x2={pad.left}
          y2={pad.top + innerH}
          stroke="currentColor"
          opacity="0.35"
        />

        <text
          x={pad.left - 10}
          y={pad.top + 2}
          fontSize="11"
          textAnchor="end"
          opacity="0.75"
        >
          Sleep
        </text>
        <text
          x={pad.left - 10}
          y={pad.top + 14}
          fontSize="10"
          textAnchor="end"
          opacity="0.65"
        >
          (hrs)
        </text>

        {x.ticks(5).map((t, i) => (
          <text
            key={i}
            x={pad.left + x(t)}
            y={pad.top + innerH + 16}
            fontSize="10"
            textAnchor="middle"
            opacity="0.6"
          >
            {t}
          </text>
        ))}

        {y.ticks(5).map((t, i) => (
          <text
            key={i}
            x={pad.left - 8}
            y={pad.top + y(t) + 4}
            fontSize="10"
            textAnchor="end"
            opacity="0.6"
          >
            {t}
          </text>
        ))}
      </svg>
    </div>
  );
}