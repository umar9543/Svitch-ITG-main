'use client';

import { useState, useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const SEGMENT_COLORS = {
  'Top 80%': '#22C55E',   // green
  '80-95%': '#3B82F6',    // blue
  'Tail 95%+': '#F59E0B', // amber/orange
};

const PIE_DATA = [
  { name: '80-95%',   value: 31.6, count: 124 },
  { name: 'Tail 95%+', value: 43.6, count: 171 },
  { name: 'Top 80%',  value: 24.7, count: 97  },
];

const BAR_DATA = [
  { name: 'Top 80%',  count: 97,  fill: SEGMENT_COLORS['Top 80%']  },
  { name: '80–95%',   count: 124, fill: SEGMENT_COLORS['80-95%']   },
  { name: 'Tail 95%+', count: 171, fill: SEGMENT_COLORS['Tail 95%+'] },
];

const LEGEND_ITEMS = [
  {
    segment: 'Top 80%',
    description: 'Drive 80% of total turnover',
    count: 97,
    color: SEGMENT_COLORS['Top 80%'],
  },
  {
    segment: '80-95%',
    description: 'Contribute next 15%',
    count: 124,
    color: SEGMENT_COLORS['80-95%'],
  },
  {
    segment: 'Tail 95%+',
    description: 'Remaining long tail',
    count: 171,
    color: SEGMENT_COLORS['Tail 95%+'],
  },
];

// Custom label rendered inside each donut slice
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight={700}
    >
      {`${value}%`}
    </text>
  );
};

// Custom bar top label
const renderBarLabel = (props) => {
  const { x, y, width, value } = props;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill="#374151"
      textAnchor="middle"
      fontSize={13}
      fontWeight={700}
    >
      {value}
    </text>
  );
};

// ----------------------------------------------------------------------

export default function SupplierSegmentCharts({ tableData = [] }) {
  const [activeSegment, setActiveSegment] = useState(null);

  const handleBarClick = useCallback((data) => {
    setActiveSegment((prev) => (prev === data.name ? null : data.name));
  }, []);

  const handleSliceClick = useCallback((data) => {
    setActiveSegment((prev) => (prev === data.name ? null : data.name));
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 3,
        bgcolor: '#fff',
        borderRadius: 2,
        border: '1px solid #E5E7EB',
        mb: 3,
        flexWrap: { xs: 'wrap', md: 'nowrap' },
      }}
    >
      {/* ── LEFT: Donut Chart ──────────────────────────────── */}
      <Box sx={{ flex: '1 1 340px', minWidth: 280 }}>
        {/* Title */}
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#111827', mb: 0.25 }}>
          Cumulative Contribution Breakdown
        </Typography>
        <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
          CEI Buying 2025 · Segments by cumulative % share
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#3B82F6',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.5,
            mb: 1,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          ▶ Click a slice to filter the supplier table below
        </Typography>

        {/* Donut */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ResponsiveContainer width={280} height={240}>
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={110}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
                onClick={handleSliceClick}
                style={{ cursor: 'pointer' }}
              >
                {PIE_DATA.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={SEGMENT_COLORS[entry.name]}
                    opacity={activeSegment && activeSegment !== entry.name ? 0.4 : 1}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name) => [`${val}%`, name]}
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Pie legend */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap',
            mt: 1,
          }}
        >
          {PIE_DATA.map((item) => (
            <Box
              key={item.name}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer' }}
              onClick={() => handleSliceClick(item)}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: SEGMENT_COLORS[item.name],
                }}
              />
              <Typography variant="caption" sx={{ color: '#374151', fontSize: 12 }}>
                {item.name} ({item.count})
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Vertical divider */}
      <Box sx={{ width: '1px', bgcolor: '#E5E7EB', mx: 1, display: { xs: 'none', md: 'block' } }} />

      {/* ── RIGHT: Bar Chart + Legend ─────────────────────── */}
      <Box sx={{ flex: '1 1 400px', minWidth: 300 }}>
        {/* Title */}
        <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#111827', mb: 0.25 }}>
          Supplier Count by Segment
        </Typography>
        <Typography variant="caption" sx={{ color: '#6B7280', display: 'block', mb: 2 }}>
          Number of suppliers per cumulative tier · click bar to filter
        </Typography>

        {/* Bar chart */}
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={BAR_DATA}
            margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
            barSize={56}
            onClick={(data) => {
              if (data && data.activePayload) {
                handleBarClick(data.activePayload[0].payload);
              }
            }}
          >
            <CartesianGrid vertical={false} stroke="#F3F4F6" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#374151' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              domain={[0, 180]}
              ticks={[0, 45, 90, 135, 180]}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
              formatter={(val) => [val, 'Suppliers']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} style={{ cursor: 'pointer' }}>
              {BAR_DATA.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.fill}
                  opacity={activeSegment && activeSegment !== entry.name ? 0.35 : 1}
                />
              ))}
              <LabelList dataKey="count" content={renderBarLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Summary legend rows */}
        <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {LEGEND_ITEMS.map((item) => (
            <Box
              key={item.segment}
              onClick={() =>
                setActiveSegment((prev) => (prev === item.segment ? null : item.segment))
              }
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 1,
                borderRadius: 1,
                border: `1px solid ${activeSegment === item.segment ? item.color : '#E5E7EB'}`,
                bgcolor:
                  activeSegment === item.segment ? `${item.color}14` : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': { bgcolor: `${item.color}0D` },
              }}
            >
              {/* Colour dot */}
              <Box
                sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }}
              />

              {/* Segment label */}
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ color: item.color, minWidth: 72, fontSize: 12 }}
              >
                {item.segment}
              </Typography>

              {/* Dash + description */}
              <Typography variant="caption" sx={{ color: '#6B7280', fontSize: 12, flex: 1 }}>
                — {item.description}
              </Typography>

              {/* Count */}
              <Typography
                variant="caption"
                fontWeight={800}
                sx={{ color: item.color, fontSize: 13 }}
              >
                {item.count}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
