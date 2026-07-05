"use client";

import { useState } from "react";

// 1. Type definitions
export interface ChartDataItem {
  label: string;
  value: number;
}

interface CompanyResearchChartProps {
  data?: ChartDataItem[];
}

interface JobsFoundChartProps {
  data?: ChartDataItem[];
}

interface MatchScoreChartProps {
  data?: ChartDataItem[];
}

// Helper to calculate coordinates
const CHART_HEIGHT = 205;
const TOP_MARGIN = 15;
const DRAWING_HEIGHT = CHART_HEIGHT; // 205px
const BOTTOM_Y = TOP_MARGIN + DRAWING_HEIGHT; // 220px

// Shared Empty State Component
function ChartEmptyState({ message, description }: { message: string; description: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-[0.5px] rounded-2xl p-4 text-center z-10">
      <div className="w-12 h-12 rounded-full bg-border/20 flex items-center justify-center mb-3">
        <svg
          className="w-6 h-6 text-text-secondary/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-text-primary">{message}</h3>
      <p className="text-xs text-text-secondary mt-1 max-w-[200px]">{description}</p>
    </div>
  );
}

// ==========================================
// 1. Company Research Activity Chart (Bar)
// ==========================================
export function CompanyResearchChart({ data }: CompanyResearchChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const defaultData: ChartDataItem[] = [
    { label: "Mon", value: 2 },
    { label: "Tue", value: 5 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 8 },
    { label: "Fri", value: 11 },
    { label: "Sat", value: 4 },
    { label: "Sun", value: 1 },
  ];

  const chartData = data || defaultData;
  const isMock = !data;
  const allZeros = !isMock && chartData.every((d) => d.value === 0);

  // Dynamic scaling (minimum scale of 4 to ensure integer ticks)
  const maxVal = Math.max(...chartData.map((d) => d.value), 4);
  const yTicks = [
    0,
    Math.round(maxVal * 0.25),
    Math.round(maxVal * 0.5),
    Math.round(maxVal * 0.75),
    maxVal,
  ];

  // Render SVG bars
  const columnWidth = 450 / chartData.length;
  const barWidth = Math.min(24, columnWidth * 0.5);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[448px] relative">
      <h2 className="text-base font-semibold text-text-primary mb-6">Company Research Activity</h2>
      
      <div className="flex-grow w-full h-[250px] relative">
        {allZeros && (
          <ChartEmptyState
            message="No research activity yet"
            description="Run the Research Agent on any job posting to see metrics here."
          />
        )}

        {/* Custom Hover Tooltip */}
        {!allZeros && activeIndex !== null && (
          <div
            className="absolute bg-surface border border-border rounded-xl p-3 shadow-md pointer-events-none z-20 flex flex-col items-center min-w-[100px] transition-all duration-100 ease-out"
            style={{
              left: `${((35 + columnWidth * activeIndex + columnWidth / 2) / 500) * 100}%`,
              top: `${((BOTTOM_Y - (chartData[activeIndex].value / maxVal) * DRAWING_HEIGHT - 10) / 250) * 100}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <span className="text-xs font-semibold text-text-primary mb-1">
              {chartData[activeIndex].label}
            </span>
            <span className="text-xs font-medium" style={{ color: "#61A8FF" }}>
              count : {chartData[activeIndex].value}
            </span>
          </div>
        )}

        <svg
          viewBox="0 0 500 250"
          className="w-full h-full overflow-visible"
          style={{ minHeight: "220px" }}
        >
          {/* Grid lines */}
          {yTicks.map((tick, idx) => {
            const y = TOP_MARGIN + DRAWING_HEIGHT * (1 - tick / maxVal);
            return (
              <g key={`y-${tick}-${idx}`}>
                {/* Dashed grid line */}
                <line
                  x1="35"
                  y1={y}
                  x2="485"
                  y2={y}
                  stroke="#E7EAF3"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {/* Y-axis tick label */}
                <text
                  x="20"
                  y={y + 4}
                  fill="#9CA3AF"
                  fontSize="12"
                  fontFamily="Inter, sans-serif"
                  textAnchor="end"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Background column hover band */}
          {!allZeros && activeIndex !== null && (
            <rect
              x={35 + columnWidth * activeIndex}
              y={TOP_MARGIN}
              width={columnWidth}
              height={DRAWING_HEIGHT}
              fill="#000000"
              fillOpacity={0.03}
              rx={4}
            />
          )}

          {/* Bars */}
          {!allZeros &&
            chartData.map((d, i) => {
              const colCenter = 35 + columnWidth * i + columnWidth / 2;
              const barX = colCenter - barWidth / 2;
              const barHeight = (d.value / maxVal) * DRAWING_HEIGHT;
              const barY = BOTTOM_Y - barHeight;

              return (
                <g key={`bar-${i}`} className="group">
                  {/* Rounded Top Bar */}
                  <path
                    d={`
                      M ${barX},${BOTTOM_Y}
                      V ${barY + 4}
                      A 4,4 0 0 1 ${barX + 4},${barY}
                      H ${barX + barWidth - 4}
                      A 4,4 0 0 1 ${barX + barWidth},${barY + 4}
                      V ${BOTTOM_Y}
                      Z
                    `}
                    fill="#61A8FF"
                    className="transition-all duration-300 group-hover:fill-info-medium"
                  />
                </g>
              );
            })}

          {/* X-axis Line */}
          <line
            x1="35"
            y1={BOTTOM_Y}
            x2="485"
            y2={BOTTOM_Y}
            stroke="#E7EAF3"
            strokeWidth="1"
          />

          {/* X-axis Labels */}
          {chartData.map((d, i) => {
            const colCenter = 35 + columnWidth * i + columnWidth / 2;
            return (
              <text
                key={`x-label-${i}`}
                x={colCenter}
                y={BOTTOM_Y + 20}
                fill="#9CA3AF"
                fontSize="12"
                fontFamily="Inter, sans-serif"
                textAnchor="middle"
              >
                {d.label}
              </text>
            );
          })}

          {/* Column Hover Detectors */}
          {!allZeros &&
            chartData.map((d, i) => {
              const colX = 35 + columnWidth * i;
              return (
                <rect
                  key={`detector-${i}`}
                  x={colX}
                  y={TOP_MARGIN}
                  width={columnWidth}
                  height={DRAWING_HEIGHT}
                  fill="transparent"
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className="cursor-pointer"
                />
              );
            })}
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 2. Jobs Found Over Time Chart (Area/Line)
// ==========================================
export function JobsFoundChart({ data }: JobsFoundChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const defaultData: ChartDataItem[] = [
    { label: "Mon", value: 18 },
    { label: "Tue", value: 42 },
    { label: "Wed", value: 32 },
    { label: "Thu", value: 58 },
    { label: "Fri", value: 82 },
    { label: "Sat", value: 48 },
    { label: "Sun", value: 18 },
  ];

  const chartData = data || defaultData;
  const isMock = !data;
  const allZeros = !isMock && chartData.every((d) => d.value === 0);

  // Dynamic scaling (minimum scale of 4 to ensure integer ticks)
  const maxVal = Math.max(...chartData.map((d) => d.value), 4);
  const yTicks = [
    0,
    Math.round(maxVal * 0.25),
    Math.round(maxVal * 0.5),
    Math.round(maxVal * 0.75),
    maxVal,
  ];

  // Calculate coordinates
  const points = chartData.map((d, i) => {
    const x = 35 + (450 / Math.max(chartData.length - 1, 1)) * i;
    const y = TOP_MARGIN + DRAWING_HEIGHT * (1 - d.value / maxVal);
    return { x, y };
  });

  // Create smooth bezier curve path
  let linePath = "";
  let areaPath = "";

  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp1y = p0.y;
      const cp2x = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cp2y = p1.y;
      linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    areaPath = `${linePath} L ${points[points.length - 1].x} ${BOTTOM_Y} L ${points[0].x} ${BOTTOM_Y} Z`;
  }

  // Determine label step to avoid overlapping when length is high (e.g. 30 days)
  const labelStep = Math.max(1, Math.ceil(chartData.length / 6));
  const colWidth = 450 / Math.max(chartData.length - 1, 1);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[384px] relative">
      <h2 className="text-base font-semibold text-text-primary mb-6">Jobs Found Over Time</h2>

      <div className="flex-grow w-full h-[210px] relative">
        {allZeros && (
          <ChartEmptyState
            message="No jobs found yet"
            description="Use the Find Jobs page to search and save jobs to see matching trends."
          />
        )}

        {/* Custom Hover Tooltip */}
        {!allZeros && activeIndex !== null && points[activeIndex] && (
          <div
            className="absolute bg-surface border border-border rounded-xl p-3 shadow-md pointer-events-none z-20 flex flex-col items-center min-w-[100px] transition-all duration-100 ease-out"
            style={{
              left: `${(points[activeIndex].x / 500) * 100}%`,
              top: `${((points[activeIndex].y - 10) / 250) * 100}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <span className="text-xs font-semibold text-text-primary mb-1">
              {chartData[activeIndex].label}
            </span>
            <span className="text-xs font-medium" style={{ color: "#7C5CFC" }}>
              count : {chartData[activeIndex].value}
            </span>
          </div>
        )}

        <svg
          viewBox="0 0 500 250"
          className="w-full h-full overflow-visible"
          style={{ minHeight: "220px" }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFC" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7C5CFC" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick, idx) => {
            const y = TOP_MARGIN + DRAWING_HEIGHT * (1 - tick / maxVal);
            return (
              <g key={`y-${tick}-${idx}`}>
                <line
                  x1="35"
                  y1={y}
                  x2="485"
                  y2={y}
                  stroke="#E7EAF3"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x="20"
                  y={y + 4}
                  fill="#9CA3AF"
                  fontSize="12"
                  fontFamily="Inter, sans-serif"
                  textAnchor="end"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Hover highlight vertical line */}
          {!allZeros && activeIndex !== null && points[activeIndex] && (
            <line
              x1={points[activeIndex].x}
              y1={TOP_MARGIN}
              x2={points[activeIndex].x}
              y2={BOTTOM_Y}
              stroke="#7C5CFC"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Area Fill */}
          {!allZeros && points.length > 0 && (
            <path d={areaPath} fill="url(#chartGradient)" />
          )}

          {/* Smooth Line */}
          {!allZeros && points.length > 0 && (
            <path
              d={linePath}
              fill="none"
              stroke="#7C5CFC"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Interactive dots on line */}
          {!allZeros &&
            points.map((pt, i) => (
              <g key={`dot-${i}`} className="group">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#ffffff"
                  stroke="#7C5CFC"
                  strokeWidth="2.5"
                  className="transition-all duration-300 group-hover:r-[6]"
                />
              </g>
            ))}

          {/* Highlighted active circle */}
          {!allZeros && activeIndex !== null && points[activeIndex] && (
            <circle
              cx={points[activeIndex].x}
              cy={points[activeIndex].y}
              r="6"
              fill="#7C5CFC"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          )}

          {/* X-axis Line */}
          <line
            x1="35"
            y1={BOTTOM_Y}
            x2="485"
            y2={BOTTOM_Y}
            stroke="#E7EAF3"
            strokeWidth="1"
          />

          {/* X-axis Labels */}
          {chartData.map((d, i) => {
            const shouldRenderLabel =
              i === 0 || i === chartData.length - 1 || i % labelStep === 0;

            if (!shouldRenderLabel) return null;

            const x = 35 + colWidth * i;
            return (
              <text
                key={`x-label-${i}`}
                x={x}
                y={BOTTOM_Y + 20}
                fill="#9CA3AF"
                fontSize="12"
                fontFamily="Inter, sans-serif"
                textAnchor="middle"
              >
                {d.label}
              </text>
            );
          })}

          {/* Hover Detector Columns */}
          {!allZeros &&
            chartData.map((d, i) => {
              const x = 35 + colWidth * i;
              const xStart = x - colWidth / 2;
              return (
                <rect
                  key={`detector-${i}`}
                  x={xStart}
                  y={TOP_MARGIN}
                  width={colWidth}
                  height={DRAWING_HEIGHT}
                  fill="transparent"
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className="cursor-pointer"
                />
              );
            })}
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 3. Match Score Distribution Chart (Bar)
// ==========================================
export function MatchScoreChart({ data }: MatchScoreChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const defaultData: ChartDataItem[] = [
    { label: "50-60%", value: 5 },
    { label: "60-70%", value: 12 },
    { label: "70-80%", value: 45 },
    { label: "80-90%", value: 82 },
    { label: "90-100%", value: 32 },
  ];

  const chartData = data || defaultData;
  const isMock = !data;
  const allZeros = !isMock && chartData.every((d) => d.value === 0);

  // Dynamic scaling (minimum scale of 4 to ensure integer ticks)
  const maxVal = Math.max(...chartData.map((d) => d.value), 4);
  const yTicks = [
    0,
    Math.round(maxVal * 0.25),
    Math.round(maxVal * 0.5),
    Math.round(maxVal * 0.75),
    maxVal,
  ];

  // Render SVG bars
  const columnWidth = 450 / chartData.length;
  const barWidth = Math.min(28, columnWidth * 0.6);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[384px] relative">
      <h2 className="text-base font-semibold text-text-primary mb-6">Match Score Distribution</h2>

      <div className="flex-grow w-full h-[210px] relative">
        {allZeros && (
          <ChartEmptyState
            message="No score metrics yet"
            description="Score distribution will appear here once jobs have been found."
          />
        )}

        {/* Custom Hover Tooltip */}
        {!allZeros && activeIndex !== null && (
          <div
            className="absolute bg-surface border border-border rounded-xl p-3 shadow-md pointer-events-none z-20 flex flex-col items-center min-w-[100px] transition-all duration-100 ease-out"
            style={{
              left: `${((35 + columnWidth * activeIndex + columnWidth / 2) / 500) * 100}%`,
              top: `${((BOTTOM_Y - (chartData[activeIndex].value / maxVal) * DRAWING_HEIGHT - 10) / 250) * 100}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <span className="text-xs font-semibold text-text-primary mb-1">
              {chartData[activeIndex].label}
            </span>
            <span className="text-xs font-medium" style={{ color: "#10B981" }}>
              count : {chartData[activeIndex].value}
            </span>
          </div>
        )}

        <svg
          viewBox="0 0 500 250"
          className="w-full h-full overflow-visible"
          style={{ minHeight: "220px" }}
        >
          {/* Grid lines */}
          {yTicks.map((tick, idx) => {
            const y = TOP_MARGIN + DRAWING_HEIGHT * (1 - tick / maxVal);
            return (
              <g key={`y-${tick}-${idx}`}>
                <line
                  x1="35"
                  y1={y}
                  x2="485"
                  y2={y}
                  stroke="#E7EAF3"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x="20"
                  y={y + 4}
                  fill="#9CA3AF"
                  fontSize="12"
                  fontFamily="Inter, sans-serif"
                  textAnchor="end"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Background column hover band */}
          {!allZeros && activeIndex !== null && (
            <rect
              x={35 + columnWidth * activeIndex}
              y={TOP_MARGIN}
              width={columnWidth}
              height={DRAWING_HEIGHT}
              fill="#000000"
              fillOpacity={0.03}
              rx={4}
            />
          )}

          {/* Bars */}
          {!allZeros &&
            chartData.map((d, i) => {
              const colCenter = 35 + columnWidth * i + columnWidth / 2;
              const barX = colCenter - barWidth / 2;
              const barHeight = (d.value / maxVal) * DRAWING_HEIGHT;
              const barY = BOTTOM_Y - barHeight;

              return (
                <g key={`bar-${i}`} className="group">
                  {/* Rounded Top Bar */}
                  <path
                    d={`
                      M ${barX},${BOTTOM_Y}
                      V ${barY + 4}
                      A 4,4 0 0 1 ${barX + 4},${barY}
                      H ${barX + barWidth - 4}
                      A 4,4 0 0 1 ${barX + barWidth},${barY + 4}
                      V ${BOTTOM_Y}
                      Z
                    `}
                    fill="#10B981"
                    className="transition-all duration-300 group-hover:fill-success-alt"
                  />
                </g>
              );
            })}

          {/* X-axis Line */}
          <line
            x1="35"
            y1={BOTTOM_Y}
            x2="485"
            y2={BOTTOM_Y}
            stroke="#E7EAF3"
            strokeWidth="1"
          />

          {/* X-axis Labels */}
          {chartData.map((d, i) => {
            const colCenter = 35 + columnWidth * i + columnWidth / 2;
            return (
              <text
                key={`x-label-${i}`}
                x={colCenter}
                y={BOTTOM_Y + 20}
                fill="#9CA3AF"
                fontSize="12"
                fontFamily="Inter, sans-serif"
                textAnchor="middle"
              >
                {d.label}
              </text>
            );
          })}

          {/* Column Hover Detectors */}
          {!allZeros &&
            chartData.map((d, i) => {
              const colX = 35 + columnWidth * i;
              return (
                <rect
                  key={`detector-${i}`}
                  x={colX}
                  y={TOP_MARGIN}
                  width={columnWidth}
                  height={DRAWING_HEIGHT}
                  fill="transparent"
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className="cursor-pointer"
                />
              );
            })}
        </svg>
      </div>
    </div>
  );
}
