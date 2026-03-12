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

export default function BarChart({ data }) {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const { width } = useResizeObserver(wrapRef);

  const grouped = useMemo(() => {
    if (!Array.isArray(data)) return [];

    

  const focus = new Set([
    "Construction_Extraction",
    "Transportation_Material_Moving",
    "Sales",
    "Food_Preparation_Serving",
    "Management"
  ]);

  const groups = d3.group(
    data.filter(d => focus.has(d.occupation)),
    d => d.occupation
  );

    return Array.from(groups, ([occ, rows]) => {
      const avg = d3.mean(rows, (d) => d.sleepDuration);
      return { occupation: occ, avgSleep: avg ?? 0 };
    }).sort((a, b) => d3.descending(a.avgSleep, b.avgSleep));
  }, [data]);

  const height = 200;
  const pad = { top: 36, right: 16, bottom: 56, left: 64 };

  const innerW = Math.max(0, (width || 0) - pad.left - pad.right);
  const innerH = height - pad.top - pad.bottom;

  const x = d3
    .scaleBand()
    .domain(grouped.map((d) => d.occupation))
    .range([0, innerW])
    .padding(0.45);

  const y = d3
    .scaleLinear()
    .domain([5.5, 7.5])
    .nice()
    .range([innerH, 0]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const bars = svg
      .selectAll("rect.bar")
      .data(grouped, (d) => d.occupation);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => pad.left + x(d.occupation))
      .attr("width", x.bandwidth())
      .attr("fill", "#00008B")
      .attr("opacity", 0.9)
      .attr("y", pad.top + innerH)
      .attr("height", 0)
      .transition()
      .duration(700)
      .ease(d3.easeCubicOut)
      .delay((_, i) => i * 40)
      .attr("y", (d) => pad.top + y(d.avgSleep))
      .attr("height", (d) => innerH - y(d.avgSleep));

    bars
      .transition()
      .duration(700)
      .attr("x", (d) => pad.left + x(d.occupation))
      .attr("width", x.bandwidth())
      .attr("y", (d) => pad.top + y(d.avgSleep))
      .attr("height", (d) => innerH - y(d.avgSleep));

    bars.exit().remove();
  }, [grouped, innerH, x, y]);

  const ticks = y.ticks(5);

  return (
    <div ref={wrapRef} style={{ width: "100%", height: "100%" }}>
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${Math.max(1, width || 1)} ${height}`}
      >
        <text x={pad.left} y={10} fontSize="14" fontWeight="700" opacity="0.9">
          Average Sleep Duration by Occupation
        </text>

        <line
          x1={pad.left}
          y1={pad.top}
          x2={pad.left}
          y2={pad.top + innerH}
          stroke="currentColor"
          opacity="0.35"
        />

        <line
          x1={pad.left}
          y1={pad.top + innerH}
          x2={pad.left + innerW}
          y2={pad.top + innerH}
          stroke="currentColor"
          opacity="0.35"
        />

        {ticks.map((tick) => {
          const yPos = pad.top + y(tick);
          return (
            <g key={tick}>
              <line
                x1={pad.left}
                y1={yPos}
                x2={pad.left + innerW}
                y2={yPos}
                stroke="currentColor"
                opacity="0.12"
              />
              <text
                x={pad.left - 10}
                y={yPos + 4}
                fontSize="11"
                textAnchor="end"
                opacity="0.75"
              >
                {tick}h
              </text>
            </g>
          );
        })}

        {grouped.map((d, i) => {
          const xPos = pad.left + x(d.occupation) + x.bandwidth() / 2;
          const yPos = pad.top + y(d.avgSleep);

          return (
            <g key={i}>
              <text
                x={xPos}
                y={yPos - 8}
                fontSize="11"
                textAnchor="middle"
                fontWeight="600"
                opacity="0.85"
              >
                {d.avgSleep.toFixed(1)}h
              </text>

              <text
                transform={`translate(${15 + xPos}, ${pad.top + innerH + 18}) rotate(0)`}
                fontSize="11"
                textAnchor="end"
                opacity="0.75"
              >
                {d.occupation.replaceAll("_", " ")}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}