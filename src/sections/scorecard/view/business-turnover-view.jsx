'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  Table,
  Button,
  MenuItem,
  Select,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Tooltip,
  Typography,
  InputAdornment,
  TableContainer,
  TablePagination,
  TableSortLabel,
  CircularProgress,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const API_BASE = 'https://srv1850710.hstgr.cloud/scorecard/api/conrad';
const API_KEY = '2ef655d9d41812035e1ac0ea3850561e5c44e4bb54f3aa15d4ea292e80f95bfd';

// Correct order: Top 80% (green) → 80–95% (blue) → Tail 95%+ (orange)
const SEGMENTS = [
  { label: 'Top 80%', color: '#22C55E', desc: 'Drive 80% of total turnover' },
  { label: '80–95%', color: '#3B82F6', desc: 'Contribute next 15%' },
  { label: 'Tail 95%+', color: '#F59E0B', desc: 'Remaining long tail' },
];

const VALUE_BUCKETS = [
  { label: '≥ 1M', color: '#1B3FBD', desc: 'High turnover' },
  { label: '1K–1M', color: '#3B82F6', desc: 'Standard range' },
  { label: '< 1K', color: '#F59E0B', desc: 'Low turnover' },
];

const PILLARS = [
  { key: 'turnoverMargin', short: 'Turnover', max: 30, color: '#22C55E' },
  { key: 'assortmentInnovation', short: 'Assortment', max: 30, color: '#3B82F6' },
  { key: 'quality', short: 'Quality', max: 25, color: '#F59E0B' },
  { key: 'fulfillment', short: 'Fulfillment', max: 25, color: '#8B5CF6' },
  { key: 'terms', short: 'Terms', max: 15, color: '#22C55E' },
];

const CLASS_COLOR = { A: '#22C55E', B: '#3B82F6', C: '#F59E0B', D: '#E53935' };

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const cleanName = (raw = '') => raw.replace(/^\d+_/, '');

function fmtVal(v) {
  if (v == null || Number.isNaN(v)) return '–';
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toFixed(0);
}

function getSegment(cumPct) {
  if (cumPct == null) return null;
  if (cumPct <= 80) return 'Top 80%';
  if (cumPct <= 95) return '80–95%';
  return 'Tail 95%+';
}

function getValueBucket(val) {
  if (val >= 1_000_000) return '≥ 1M';
  if (val >= 1_000) return '1K–1M';
  return '< 1K';
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────
function ClassBadge({ cls }) {
  const color = CLASS_COLOR[cls] ?? '#9E9E9E';
  return (
    <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: `${color}22`, border: `1.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto' }}>
      <Typography variant="caption" fontWeight={700} sx={{ color, lineHeight: 1 }}>{cls ?? '–'}</Typography>
    </Box>
  );
}

function PillarCell({ score, max, color, isTotal }) {
  if (score == null || score === '-') {
    return <Typography variant="body2" sx={{ color: 'text.disabled', textAlign: 'center' }}>–</Typography>;
  }
  const pct = max ? Math.min((Number(score) / max) * 100, 100) : 0;
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="body2" fontWeight={isTotal ? 700 : 600} sx={{ color: isTotal ? 'text.primary' : 'inherit', mb: 0.5 }}>{score}</Typography>
      <Box sx={{ height: 3, borderRadius: 1.5, bgcolor: `${color}33`, mx: 'auto', width: '65%', overflow: 'hidden' }}>
        <Box sx={{ height: '100%', borderRadius: 1.5, bgcolor: color, width: `${pct}%` }} />
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────
// MAIN VIEW
// ─────────────────────────────────────────────
export default function BusinessTurnoverView() {
  const theme = useTheme();
  const router = useRouter();
  const [turnoverData, setTurnoverData] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [percentileData, setPercentileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [metric, setMetric] = useState('ceiBuying');
  const [chartType, setChartType] = useState('cumulative'); // 'cumulative' or 'value'
  const [segmentFilter, setSegmentFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [isMounted, setIsMounted] = useState(false);
  const [sortKey, setSortKey] = useState('sharePct');
  const [sortDir, setSortDir] = useState('desc');

  const tableRef = useRef(null);
  const scrollToTable = () => {
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const currentSegments = chartType === 'cumulative' ? SEGMENTS : VALUE_BUCKETS;

  // Deferred mount guard — stops ApexCharts crashing under React 18 Strict Mode
  useEffect(() => {
    const t = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // ─── Fetch ───
  useEffect(() => {
    const headers = { 'x-api-key': API_KEY };
    Promise.all([
      fetch(`${API_BASE}/turnover`, { headers }).then((r) => r.json()).catch(() => null),
      fetch(`${API_BASE}/results`, { headers }).then((r) => r.json()).catch(() => null),
      fetch(`${API_BASE}/percentile`, { headers }).then((r) => r.json()).catch(() => null),
    ])
      .then(([turn, res, perc]) => {
        setTurnoverData(turn);
        setResultsData(res);
        setPercentileData(perc);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // ─── Build enriched supplier list with computed cumulative % ───
  const suppliers = useMemo(() => {
    const rows = turnoverData?.chart ?? [];
    if (!rows.length) return [];

    const resultsMap = {};
    (resultsData?.suppliers ?? []).forEach((s) => {
      resultsMap[String(s.vendorNo)] = s;
    });

    const getValue = (row) =>
      metric === 'ceiBuying'
        ? (row.actuals?.ceiBuying2025 ?? row.ceiBuying2025 ?? 0)
        : (row.actuals?.ceiProfit2025 ?? row.ceiProfit2025 ?? 0);

    const withValues = rows
      .map((row) => ({ row, value: getValue(row) }))
      .sort((a, b) => b.value - a.value);

    const grandTotal = withValues.reduce((acc, { value }) => acc + value, 0);
    let cumSum = 0;

    const percSummary = percentileData?.[metric]?.['2025']?.summary;
    const topLimit = percSummary?.top80Count ?? 0;
    const midLimit = topLimit + (percSummary?.mid80_95Count ?? 0);

    return withValues.map(({ row, value }, index) => {
      cumSum += value;
      const cumPct = grandTotal > 0 ? parseFloat(((cumSum / grandTotal) * 100).toFixed(2)) : null;
      const res = resultsMap[String(row.vendorNo)] ?? {};

      let segment = getSegment(cumPct);
      if (percSummary && value > 0) {
        if (index < topLimit) segment = 'Top 80%';
        else if (index < midLimit) segment = '80–95%';
        else segment = 'Tail 95%+';
      }

      return {
        vendorNo: row.vendorNo,
        name: cleanName(row.vendorName ?? ''),
        value,
        cumPct,
        segment,
        valueBucket: getValueBucket(value),
        cls: row.businessClass ?? null,
        pillars: res.pillars ?? {},
        totalScore: res.totalScore ?? null,
      };
    });
  }, [turnoverData, resultsData, percentileData, metric]);

  // ─── Share % map: cumulative diff in raw API order ───
  const sharePctMap = useMemo(() => {
    const tiers = percentileData?.[metric]?.['2025']?.tiers;
    if (!tiers) return {};
    const allInOrder = [
      ...(tiers.top80?.suppliers ?? []),
      ...(tiers.mid80_95?.suppliers ?? []),
      ...(tiers.tail95?.suppliers ?? []),
    ];
    const map = {};
    let prev = 0;
    allInOrder.forEach((s) => {
      const cum = s.cumulativePct ?? 0;
      map[String(s.vendorNo)] = parseFloat(Math.max(0, cum - prev).toFixed(4));
      prev = cum;
    });
    return map;
  }, [percentileData, metric]);

  // ─── KPI totals ───
  const kpi = useMemo(() => {
    // Priority 1: Percentile API 2025 summary
    const percSummary = percentileData?.[metric]?.['2025']?.summary;
    if (percSummary) {
      return {
        totalSuppliers: percSummary.totalSuppliers,
        withValue: percSummary.withValue,
        noValue: percSummary.noValue,
        totalValue: percSummary.totalValue,
      };
    }

    // Fallback: Local calculation
    const totalValue = suppliers.reduce((a, s) => a + (s.value ?? 0), 0);
    const totalSuppliers = resultsData?.summary?.totalSuppliers ?? suppliers.length;
    const withValue = suppliers.filter((s) => s.value > 0).length;
    return { totalSuppliers, withValue, noValue: totalSuppliers - withValue, totalValue };
  }, [suppliers, resultsData, percentileData, metric]);

  // ─── Segment buckets ───
  const buckets = useMemo(() => {
    if (chartType === 'cumulative') {
      const b = { 'Top 80%': [], '80–95%': [], 'Tail 95%+': [] };
      suppliers.forEach((s) => { if (s.segment) b[s.segment].push(s); });
      return b;
    }
    const b = { '≥ 1M': [], '1K–1M': [], '< 1K': [] };
    suppliers.forEach((s) => { if (s.valueBucket) b[s.valueBucket].push(s); });
    return b;
  }, [suppliers, chartType]);

  // ─── Donut: share per segment (%) ───
  const donutSeries = useMemo(() => {
    // supplier COUNT share (even in value mode, to ensure small buckets are visible)
    const totalCount = currentSegments.reduce((a, { label }) => a + (buckets[label]?.length ?? 0), 0);
    return currentSegments.map(({ label }) => {
      const count = buckets[label]?.length ?? 0;
      return totalCount > 0 ? parseFloat(((count / totalCount) * 100).toFixed(1)) : 0;
    });
  }, [buckets, chartType, currentSegments]);

  // ─── Donut options ───
  const donutOptions = useMemo(() => ({
    chart: {
      id: 'segment-donut',
      type: 'donut',
      toolbar: { show: false },
      animations: { enabled: true, speed: 500, animateGradually: { enabled: false } },
      events: {
        dataPointSelection(_e, _c, { dataPointIndex }) {
          const seg = currentSegments[dataPointIndex]?.label ?? null;
          setSegmentFilter((p) => (p === seg ? null : seg));
          setPage(0);
          scrollToTable();
        },
      },
    },
    labels: currentSegments.map((s) => s.label),
    colors: currentSegments.map((s) => s.color),
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '12px',
      fontFamily: 'Inter, Public Sans, sans-serif',
      fontWeight: 500,
      offsetY: 6,
      markers: {
        width: 10, height: 10, radius: 10, offsetX: -3,
      },
      itemMargin: { horizontal: 10, vertical: 4 },
      formatter: (name, opts) => {
        const label = currentSegments[opts.seriesIndex]?.label;
        const count = buckets[label]?.length ?? 0;
        if (chartType === 'cumulative') return `${label} (${count})`;
        return `${label} (EUR) (${count})`;
      },
    },
    dataLabels: {
      enabled: true,
      dropShadow: { enabled: false },
      style: {
        fontSize: '13px',
        fontWeight: '700',
        fontFamily: 'Inter, Public Sans, sans-serif',
        colors: ['#fff'],
      },
      formatter: (val) => {
        if (val > 0 && val < 0.1) return '< 0.1%';
        return `${Number.isFinite(val) ? val.toFixed(1) : 0}%`;
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: '52%',
          labels: { show: false },
        },
      },
    },
    stroke: { show: true, width: 3, colors: ['#fff'] },
    states: {
      hover: { filter: { type: 'darken', value: 0.88 } },
      active: { allowMultipleDataPointsSelection: false, filter: { type: 'darken', value: 0.78 } },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (val) =>
          `${Number.isFinite(val) ? val.toFixed(1) : 0}% of total count`,
      },
    },
  }), [buckets, chartType, currentSegments]);

  // ─── Bar series ───
  const barSeries = useMemo(() => {
    if (chartType === 'cumulative') {
      return [{
        name: 'Suppliers',
        data: SEGMENTS.map((s) => buckets[s.label].length),
      }];
    }
    return [{
      name: 'Supplier Count',
      data: VALUE_BUCKETS.map((s) => buckets[s.label].length),
    }];
  }, [buckets, chartType]);

  // ─── Bar options ───
  const maxVal = useMemo(() => {
    const vals = currentSegments.map((s) => buckets[s.label].length);
    return Math.max(...vals, 50);
  }, [buckets, currentSegments]);

  const barOptions = useMemo(() => {
    // Nice round y-axis ceiling
    const step = maxVal <= 200 ? 45 : 100;
    const yMax = Math.ceil(maxVal / step) * step;
    const ticks = Math.round(yMax / step);

    return {
      chart: {
        id: 'segment-bar',
        type: 'bar',
        toolbar: { show: false },
        animations: { enabled: true, speed: 500, animateGradually: { enabled: false } },
        events: {
          dataPointSelection(_e, _c, { dataPointIndex }) {
            const seg = SEGMENTS[dataPointIndex]?.label ?? null;
            setSegmentFilter((p) => (p === seg ? null : seg));
            setPage(0);
            scrollToTable();
          },
        },
      },
      colors: currentSegments.map((s) => s.color),
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 5,
          borderRadiusApplication: 'end',
          columnWidth: '35%',
          dataLabels: { position: 'top' },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -24,
        formatter: (v) => String(v),
        style: {
          fontSize: '13px',
          fontWeight: '700',
          fontFamily: 'Inter, Public Sans, sans-serif',
          colors: ['#111827'],
        },
        dropShadow: { enabled: false },
      },
      xaxis: {
        categories: currentSegments.map((s) => s.label),
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            fontSize: '12px',
            fontFamily: 'Inter, Public Sans, sans-serif',
            colors: ['#374151', '#374151', '#374151'],
            fontWeight: 500,
          },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: yMax,
        tickAmount: ticks,
        labels: {
          formatter: (v) => String(Math.round(v)),
          style: {
            fontSize: '11px',
            fontFamily: 'Inter, Public Sans, sans-serif',
            colors: '#9CA3AF',
          },
        },
      },
      legend: { show: false },
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 0,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 20, right: 10, bottom: 0, left: 0 },
      },
      states: {
        hover: { filter: { type: 'darken', value: 0.88 } },
        active: { filter: { type: 'darken', value: 0.78 } },
      },
      tooltip: {
        y: {
          formatter: (v) => `${v} suppliers`,
        },
      },
    };
  }, [maxVal, chartType, currentSegments]);

  // ─── Filtered / paginated rows ───
  const filtered = useMemo(() => {
    let list = suppliers;
    if (segmentFilter) {
      list = list.filter((s) => (chartType === 'cumulative' ? s.segment : s.valueBucket) === segmentFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || String(s.vendorNo).includes(q));
    }
    return list;
  }, [suppliers, segmentFilter, search, sharePctMap]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let av, bv;
      if (sortKey === 'sharePct') {
        av = sharePctMap[String(a.vendorNo)] ?? -Infinity;
        bv = sharePctMap[String(b.vendorNo)] ?? -Infinity;
      } else if (sortKey === 'value') {
        av = a.value ?? 0; bv = b.value ?? 0;
      } else if (sortKey === 'name') {
        return sortDir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortKey === 'cumPct') {
        av = a.cumPct ?? 0; bv = b.cumPct ?? 0;
      } else if (sortKey === 'totalScore') {
        av = a.totalScore ?? 0; bv = b.totalScore ?? 0;
      } else {
        return 0;
      }
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return arr;
  }, [filtered, sortKey, sortDir, sharePctMap]);

  const paginated = useMemo(
    () => sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sorted, page, rowsPerPage]
  );

  // ─── Loading / Error ───
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, gap: 2 }}>
        <CircularProgress size={28} />
        <Typography color="text.secondary">Loading turnover data…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">Failed to load data</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>{error}</Typography>
      </Box>
    );
  }

  const metricLabel = metric === 'ceiBuying' ? 'CEI Buying' : 'CEI Profit';

  return (
    <Stack spacing={3}>

      {/* ══ HERO CARD ══ */}
      <Card sx={{
        background: 'linear-gradient(135deg, #EBF1FF 0%, #D3E2FF 100%)',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(27,63,189,0.10)',
        p: { xs: 2, md: 3 },
        position: 'relative',
        overflow: 'hidden',
      }}>
        {[180, 120, 70].map((sz, i) => (
          <Box key={i} sx={{
            position: 'absolute', pointerEvents: 'none',
            width: sz, height: sz, borderRadius: '50%',
            bgcolor: 'rgba(91,141,239,0.12)',
            top: i === 0 ? -50 : i === 1 ? 20 : 80,
            right: i === 0 ? -40 : i === 1 ? 90 : 30,
          }} />
        ))}

        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={1.5} flexWrap="wrap" gap={2}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
              <Iconify icon="mdi:chart-pie" width={22} sx={{ color: '#1B3FBD' }} />
              <Typography variant="h6" fontWeight={800} sx={{ color: '#1B3FBD' }}>
                Economical Analysis
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              2025 · {kpi.withValue} Suppliers with value · {kpi.noValue} Suppliers without value · click a segment to filter the table
            </Typography>
          </Box>

          <Select
            value={chartType}
            size="small"
            onChange={(e) => { setChartType(e.target.value); setPage(0); }}
            sx={{
              bgcolor: '#fff', borderRadius: 2,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              minWidth: 145, fontSize: 13, fontWeight: 600,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            }}
            startAdornment={<Iconify icon={chartType === 'cumulative' ? "mdi:chart-bar" : "mdi:currency-eur"} width={15} sx={{ mr: 0.5, color: '#1B3FBD' }} />}
          >
            <MenuItem value="cumulative">Cumulative %</MenuItem>
            <MenuItem value="value">By Value</MenuItem>
          </Select>
        </Stack>

        <Stack direction="row" spacing={1} mb={2.5}>
          {[
            { value: 'ceiBuying', label: 'CEI Buying', icon: 'mdi:cash-multiple' },
            { value: 'ceiProfit', label: 'CEI Profit', icon: 'mdi:trending-up' },
          ].map((opt) => {
            const active = metric === opt.value;
            return (
              <Button
                key={opt.value}
                size="small"
                startIcon={<Iconify icon={opt.icon} width={15} />}
                onClick={() => { setMetric(opt.value); setSegmentFilter(null); setPage(0); }}
                sx={{
                  borderRadius: 5, px: 2, py: 0.7,
                  fontWeight: 600, fontSize: 13, textTransform: 'none',
                  bgcolor: active ? '#1B3FBD' : 'rgba(255,255,255,0.75)',
                  color: active ? '#fff' : 'text.secondary',
                  border: active ? 'none' : '1px solid rgba(0,0,0,0.12)',
                  boxShadow: active ? '0 2px 8px rgba(27,63,189,0.28)' : 'none',
                  '&:hover': { bgcolor: active ? '#1530a0' : 'rgba(255,255,255,0.95)' },
                }}
              >
                {opt.label}
              </Button>
            );
          })}
        </Stack>

        <Grid container spacing={2}>
          {[
            { label: 'Total Suppliers', value: kpi.totalSuppliers, icon: 'mdi:account-group', c: '#1B3FBD' },
            { label: 'Suppliers With Value', value: kpi.withValue, icon: 'mdi:check-circle', c: '#22C55E' },
            { label: 'Suppliers With No Value', value: kpi.noValue, icon: 'mdi:close-circle', c: '#E53935' },
            { label: metric === 'ceiProfit' ? 'Total Value (HKD)' : 'Total Value (EUR)', value: fmtVal(kpi.totalValue), icon: metric === 'ceiProfit' ? 'mdi:currency-cny' : 'mdi:currency-eur', c: '#F59E0B' },
          ].map((k) => (
            <Grid item xs={6} md={3} key={k.label}>
              <Card
                sx={{
                  py: 3,
                  pl: 3,
                  pr: 2.5,
                  borderRadius: 2,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ flexGrow: 1, zIndex: 1 }}>
                  <Typography variant="h3" fontWeight={800} color="text.primary">
                    {k.value}
                  </Typography>
                  <Typography noWrap variant="subtitle2" component="div" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {k.label}
                  </Typography>
                </Box>

                {/* Rotated background shape using the exact CSS from the reference */}
                <Box
                  sx={{
                    top: -44,
                    width: 160,
                    zIndex: 0,
                    height: 160,
                    right: -104,
                    opacity: 0.12,
                    borderRadius: 3, // 3 * 8 = 24px
                    position: 'absolute',
                    transform: 'rotate(40deg)',
                    background: `linear-gradient(to right, ${k.c} 0%, ${k.c} 100%)`,
                  }}
                />

                {/* Styled icon container matching layout positioning */}
                <Box
                  sx={{
                    top: 24,
                    right: 20,
                    width: 36,
                    height: 36,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                >
                  <Iconify
                    icon={k.icon}
                    width={36}
                    height={36}
                    sx={{
                      color: k.c,
                    }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* ══ CHARTS CARD — matches image 2 exactly ══ */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', p: { xs: 2, md: 3 } }}>
        <Grid container spacing={0}>

          {/* ── LEFT: Donut ── */}
          <Grid item xs={12} md={5} sx={{ pr: { md: 3 }, borderRight: { md: '1px solid #F3F4F6' } }}>
            {/* Header */}
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#111827', mb: 0.25 }}>
              {chartType === 'cumulative' ? 'Cumulative Contribution Breakdown' : 'Supplier Distribution by Value Bucket'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
              {metricLabel} 2025 · {chartType === 'cumulative' ? 'Segments by cumulative % share' : 'Grouped by individual turnover value'}
            </Typography>

            {/* Click hint */}
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.75, mb: 1.5 }}>
              <Iconify icon="eva:arrow-downward-fill" width={13} sx={{ color: '#3B82F6' }} />
              <Typography
                variant="caption"
                sx={{ color: '#3B82F6', cursor: 'pointer', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
                onClick={() => { setSegmentFilter(null); setPage(0); }}
              >
                Click a slice to filter the supplier table below
              </Typography>
            </Stack>

            {/* Active filter chip */}
            {segmentFilter && (
              <Chip
                size="small"
                label={`Filtered: ${segmentFilter}`}
                onDelete={() => { setSegmentFilter(null); setPage(0); }}
                sx={{
                  mb: 1.5,
                  bgcolor: currentSegments.find((s) => s.label === segmentFilter)?.color,
                  color: '#fff',
                  fontWeight: 700,
                  '& .MuiChip-deleteIcon': { color: 'rgba(255,255,255,0.75)' },
                }}
              />
            )}

            {/* Donut chart */}
            {isMounted && donutSeries.some((v) => v > 0) ? (
              <ApexChart
                type="donut"
                options={donutOptions}
                series={donutSeries}
                height={300}
              />
            ) : (
              isMounted && (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary" variant="body2">No data available</Typography>
                </Box>
              )
            )}
          </Grid>

          {/* ── RIGHT: Bar + Legend rows ── */}
          <Grid item xs={12} md={7} sx={{ pl: { md: 3 }, mt: { xs: 3, md: 0 } }}>
            {/* Header */}
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#111827', mb: 0.25 }}>
              {chartType === 'cumulative' ? 'Supplier Count by Segment' : 'Supplier Count by Value Bucket'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B7280', display: 'block', mb: 1.5 }}>
              {chartType === 'cumulative' ? 'Number of suppliers per cumulative tier' : 'Categorised by individual turnover value'} · click bar to filter
            </Typography>

            {/* Bar chart */}
            {isMounted && (
              <ApexChart
                type="bar"
                options={barOptions}
                series={barSeries}
                height={230}
              />
            )}

            {/* ── Legend rows ── */}
            <Stack spacing={0.75} sx={{ mt: 1.5 }}>
              {currentSegments.map(({ label, color, desc }) => {
                const count = buckets[label]?.length ?? 0;
                const totalInSeg = buckets[label].reduce((a, s) => a + (s.value ?? 0), 0);
                const active = segmentFilter === label;
                return (
                  <Box
                    key={label}
                    onClick={() => { setSegmentFilter((p) => (p === label ? null : label)); setPage(0); }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.5,
                      py: 1,
                      borderRadius: 1,
                      border: `1px solid ${active ? color : '#E5E7EB'}`,
                      bgcolor: active ? `${color}14` : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': { bgcolor: `${color}0D`, borderColor: color },
                    }}
                  >
                    {/* Dot */}
                    <Box sx={{
                      width: 12, height: 12, borderRadius: '50%',
                      bgcolor: color, flexShrink: 0,
                      boxShadow: `0 0 0 2px ${color}33`,
                    }} />

                    {/* Segment label */}
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      sx={{ color, minWidth: 72, fontSize: '12px' }}
                    >
                      {label} {chartType === 'value' && '(EUR)'}
                    </Typography>

                    {/* Dash + description / total value */}
                    <Typography
                      variant="caption"
                      sx={{ color: '#6B7280', fontSize: '12px', flex: 1 }}
                    >
                      — {chartType === 'cumulative' ? desc : `Total: ${fmtVal(totalInSeg)}`}
                    </Typography>

                    {/* Count */}
                    <Typography
                      variant="caption"
                      fontWeight={800}
                      sx={{ color, fontSize: '13px', letterSpacing: '0.01em' }}
                    >
                      {count} suppliers
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Grid>
        </Grid>
      </Card>

      {/* ══ SUPPLIER TABLE ══ */}
      <Card ref={tableRef} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
            <Typography variant="subtitle1" fontWeight={700}>Supplier's Economical & Performance Matrix</Typography>
            <Tooltip
              title="NA means data not available in supplier performance sheet"
              arrow
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#fff',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    px: 1.5, py: 1.25,
                    color: '#212B36',
                    fontSize: 12,
                    fontWeight: 500,
                    '& .MuiTooltip-arrow': { color: '#fff' },
                  },
                },
              }}
            >
              <Box component="span" sx={{ display: 'inline-flex', cursor: 'pointer' }}>
                <Iconify icon="eva:info-outline" width={18} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }} />
              </Box>
            </Tooltip>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {metricLabel} 2025 · {filtered.length} suppliers shown
            {segmentFilter ? ` — filtered by "${segmentFilter}"` : ' — click a chart segment to filter'}
          </Typography>
        </Box>

        <Box sx={{ px: 3, pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TextField
              size="small"
              placeholder="Search supplier name or vendor no"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              sx={{ maxWidth: 340, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
            {segmentFilter && (
              <Button
                size="small"
                startIcon={<Iconify icon="eva:close-fill" />}
                onClick={() => { setSegmentFilter(null); setPage(0); }}
                sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}
              >
                Clear filter
              </Button>
            )}
            <Box sx={{ flex: 1 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {filtered.length} suppliers
            </Typography>
          </Stack>
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              {/* ── Parent group headers ── */}
              <TableRow>
                <TableCell
                  colSpan={3}
                  sx={{
                    fontWeight: 800,
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#111827',
                    bgcolor: '#fff',
                    borderBottom: 'none',
                    pb: 0.5,
                    pt: 1,
                    textAlign: 'center',
                    borderRight: '2px solid rgba(0,0,0,0.18)',
                  }}
                >
                  Business Evaluation
                </TableCell>
                <TableCell
                  colSpan={PILLARS.length + 1}
                  sx={{
                    fontWeight: 800,
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#111827',
                    bgcolor: '#fff',
                    borderBottom: 'none',
                    pb: 0.5,
                    pt: 1,
                    textAlign: 'center',
                  }}
                >
                  Turnover Margin & Performance Evaluation
                </TableCell>
              </TableRow>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700, minWidth: 200 }}>
                  <TableSortLabel active={sortKey === 'name'} direction={sortKey === 'name' ? sortDir : 'asc'} onClick={() => toggleSort('name')}>
                    Supplier
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: 165 }}>
                  <TableSortLabel active={sortKey === 'value'} direction={sortKey === 'value' ? sortDir : 'asc'} onClick={() => toggleSort('value')}>
                    Buying Value(€)
                  </TableSortLabel>
                </TableCell>
                {/* Share % header with tooltip */}
                <TableCell sx={{ fontWeight: 700, minWidth: 135, borderRight: '2px solid rgba(0,0,0,0.18)' }}>
                  <Stack direction="row" spacing={0} alignItems="center">
                    <TableSortLabel active={sortKey === 'sharePct'} direction={sortKey === 'sharePct' ? sortDir : 'asc'} onClick={() => toggleSort('sharePct')}>
                      Share %
                    </TableSortLabel>
                    <Tooltip
                      arrow
                      placement="top"
                      title={
                        <Box sx={{ p: 0.5, maxWidth: 260 }}>
                          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
                            <Iconify icon="mdi:chart-pie" width={15} sx={{ color: '#212B36', flexShrink: 0 }} />
                            <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#212B36' }}>Share % in Overall Buying</Typography>
                          </Stack>
                          <Typography sx={{ fontSize: 11.5, color: 'rgba(0,0,0,0.7)', lineHeight: 1.6 }}>
                            Each supplier&apos;s <strong style={{ color: '#212B36' }}>unique contribution</strong> to total turnover — calculated as the difference between their cumulative % and the previous supplier&apos;s cumulative %.
                          </Typography>
                          <Box sx={{ mt: 1, p: 1, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.05)' }}>
                            <Typography sx={{ fontSize: 10.5, color: 'rgba(0,0,0,0.6)', fontFamily: 'monospace' }}>
                              Share % = Cum%[n] − Cum%[n−1]
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: 10.5, color: 'rgba(0,0,0,0.45)', mt: 0.75, lineHeight: 1.5 }}>
                            Sequence: Top 80% → 80–95% → Tail 95%+
                          </Typography>
                        </Box>
                      }
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: '#fff',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: 2,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            px: 1.5, py: 1.25,
                            '& .MuiTooltip-arrow': { color: '#fff' },
                          },
                        },
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'help' }}>
                        <Iconify icon="mdi:information" width={13} sx={{ color: '#212B36', ml: 0 }} />
                      </span>
                    </Tooltip>
                  </Stack>
                </TableCell>
                {/* <TableCell sx={{ fontWeight: 700, minWidth: 60, textAlign: 'center' }}>Class</TableCell> */}
                {/* ── KPI pillar headers with tooltips ── */}
                {(() => {
                  const KPI_TOOLTIPS = {
                    turnoverMargin: {
                      icon: 'mdi:trending-up',
                      title: 'Turnover & Margin',
                      weight: '30%',
                      items: [
                        {
                          name: 'CEI Buying 2025',
                          how: 'CEI buying turnover (USD) in descending order',
                          scores: { '3': 'Top 80%', '2': '80–95%', '1pt': '95–100%', '0': 'No Turnover' },
                        },
                        {
                          name: 'CEE Retail 2025',
                          how: 'CEE GMV (EUR) in descending order',
                          scores: { '3': 'Top 80%', '2': '80–95%', '1pt': '95–100%', '0': 'No Turnover' },
                        },
                        {
                          name: 'CEI Margin 2025',
                          how: 'CEI profit (HKD) in descending order',
                          scores: { '3': 'Top 80%', '2': '80–95%', '1pt': '95–100%', '0': 'No Turnover' },
                        },
                        {
                          name: 'CEE CM1 2025',
                          how: 'CEE CM1 (EUR) in descending order',
                          scores: { '3': 'Top 80%', '2': '80–95%', '1pt': '95–100%', '0': 'No Turnover' },
                        },
                      ],
                    },
                    assortmentInnovation: {
                      icon: 'mdi:lightbulb-outline',
                      title: 'Assortment & Innovation',
                      weight: '30%',
                      items: [
                        {
                          name: 'New Item %',
                          how: 'No. of New items ÷ Total number of items',
                          scores: { '3': '≥ 10%', '2': '5–10%', '1pt': '< 5%', '0': '0%' },
                        },
                        {
                          name: 'Pipeline Development Time',
                          how: 'Avg (GM Approved date + 30) − wait order date',
                          scores: { '3': '≤ 0 days', '2': '1–7 days', '1pt': '7–14 days', '0': '> 14 days' },
                        },
                      ],
                    },
                    quality: {
                      icon: 'mdi:shield-check-outline',
                      title: 'Quality Assurance',
                      weight: '25%',
                      items: [
                        {
                          name: 'Inspection Pass Rate',
                          how: 'No. of Pass inspections ÷ Total inspections',
                          scores: { '3': '100%', '2': '91–99%', '1pt': '80–90%', '0': '< 80%' },
                        },
                        {
                          name: 'Inspection Defect Rate',
                          how: 'No. of defects ÷ Total inspected samples',
                          scores: { '3': '≤ 2%', '2': '2–2.5%', '1pt': '2.5–3%', '0': '> 3%' },
                        },
                        {
                          name: 'Number of Re-inspections',
                          how: 'Count of re-inspection occurrences',
                          scores: { '3': '0', '2': '1', '1pt': '2', '0': '> 2' },
                        },
                        {
                          name: 'Customer Return Rate',
                          how: 'Return qty ÷ Sold Quantity',
                          scores: { '3': '0%', '2': '0–2.5%', '1pt': '2.5–5%', '0': '> 5%' },
                        },
                        {
                          name: 'Customer Complaints',
                          how: 'Complaints from CEE (JIRA tickets)',
                          scores: { '3': '0', '1pt': 'High & Medium', '-3': 'Critical' },
                        },
                      ],
                    },
                    fulfillment: {
                      icon: 'mdi:truck-delivery-outline',
                      title: 'Fulfillment & Operations',
                      weight: '25%',
                      items: [
                        {
                          name: 'On-Time Delivery',
                          how: 'Avg (Cargo receipt date − cETD)',
                          scores: { '3': '≤ 0 days', '0': '> 0 days' },
                        },
                        {
                          name: 'On-Time Vessel Booking',
                          how: 'Avg (cETD − Shipment booking date)',
                          scores: { '3': '≥ 28 days', '2': '21–27 days', '1pt': '14–20 days', '0': '< 14 days' },
                        },
                        {
                          name: 'On-Time Inspection Booking',
                          how: 'Avg (ETD − Inspection booking date)',
                          scores: { '3': '≥ 14 days', '2': '8–13 days', '1pt': '1–7 days', '0': '≤ 0 days' },
                        },
                        {
                          name: 'On-Time Order Confirmation',
                          how: 'Avg (Order confirm date − Order create date)',
                          scores: { '3': '≤ 7 days', '2': '8–14 days', '1pt': '15–21 days', '0': '> 21 days' },
                        },
                      ],
                    },
                    terms: {
                      icon: 'mdi:file-sign',
                      title: 'Terms & Conditions',
                      weight: '15%',
                      items: [
                        {
                          name: 'Payment Terms',
                          how: 'Payment Terms code agreed with supplier',
                          scores: { '3': 'T/T (codes 100–700)', '2': 'L/C (codes 200–202)', '0': 'Others' },
                        },
                        {
                          name: 'Service Remission %',
                          how: 'Service remission percentage',
                          scores: { '3': '≥ 3%', '2': '≥ 2%', '1pt': '≤ 1%', '0': '0%' },
                        },
                        {
                          name: 'Purchase Volume Bonus %',
                          how: 'Agreed bonus percentage',
                          scores: { '3': 'Unconditional', '1pt': 'Conditional', '0': 'No Bonus' },
                        },
                        {
                          name: 'MOV Required',
                          how: 'Minimum Order Value per shipment',
                          scores: { '3': 'No MOV', '0': 'MOV required' },
                        },
                      ],
                    },
                  };

                  const tooltipProps = {
                    componentsProps: {
                      tooltip: {
                        sx: {
                          bgcolor: '#fff',
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: 2,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                          px: 1.5, py: 1.25,
                          '& .MuiTooltip-arrow': { color: '#fff' },
                        },
                      },
                    },
                  };

                  return PILLARS.map((p) => {
                    const tip = KPI_TOOLTIPS[p.key];
                    return (
                      <TableCell key={p.key} sx={{ fontWeight: 700, minWidth: 90, textAlign: 'center', fontSize: 12 }}>
                        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                          <Typography sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}>{p.short} Score</Typography>
                          {tip && (
                            <Tooltip arrow placement="top" {...tooltipProps}
                              title={
                                <Box sx={{ p: 0.5, maxWidth: 290 }}>
                                  {/* Header row */}
                                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
                                    <Iconify icon={tip.icon} width={15} sx={{ color: '#212B36', flexShrink: 0 }} />
                                    <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#212B36' }}>{tip.title}</Typography>
                                    <Typography sx={{ fontSize: 10, color: 'rgba(0,0,0,0.4)', ml: 'auto', whiteSpace: 'nowrap' }}>Weight: {tip.weight}</Typography>
                                  </Stack>
                                  {/* Sub-KPI items */}
                                  {tip.items.map((item, i) => (
                                    <Box key={i} sx={{ mb: i < tip.items.length - 1 ? 1 : 0 }}>
                                      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: '#212B36', mb: 0.25 }}>
                                        {item.name}
                                      </Typography>
                                      {item.how && (
                                        <Typography sx={{ fontSize: 10.5, color: 'rgba(0,0,0,0.5)', mb: 0.4, lineHeight: 1.4 }}>
                                          {item.how}
                                        </Typography>
                                      )}
                                      <Box sx={{ p: 0.6, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.05)' }}>
                                        <Typography sx={{ fontSize: 10, color: 'rgba(0,0,0,0.55)', fontFamily: 'monospace', lineHeight: 1.7 }}>
                                          {Object.entries(item.scores).map(([pts, label]) => `${pts}: ${label}`).join(' · ')}
                                        </Typography>
                                      </Box>
                                      {i < tip.items.length - 1 && (
                                        <Box sx={{ mt: 0.9, borderBottom: '1px solid rgba(0,0,0,0.08)' }} />
                                      )}
                                    </Box>
                                  ))}
                                </Box>
                              }
                            >
                              <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'help' }}>
                                <Iconify icon="mdi:information" width={12} sx={{ color: '#212B36', ml: 0 }} />
                              </span>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    );
                  });
                })()}

                {/* Total Score header with summary tooltip */}
                <TableCell sx={{ fontWeight: 700, minWidth: 70, textAlign: 'center' }}>
                  <Stack direction="row" spacing={0} alignItems="center" justifyContent="center">
                    <TableSortLabel
                      active={sortKey === 'totalScore'}
                      direction={sortKey === 'totalScore' ? sortDir : 'asc'}
                      onClick={() => toggleSort('totalScore')}
                      sx={{ '& .MuiTableSortLabel-icon': { ml: 0, mr: 0 } }}
                    >
                      <Typography sx={{ fontSize: 11, fontWeight: 700 }}>Total Score</Typography>
                    </TableSortLabel>
                    <Tooltip arrow placement="top"

                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: '#fff',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: 2,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            px: 1.5, py: 1.25,
                            '& .MuiTooltip-arrow': { color: '#fff' },
                          },
                        },
                      }}
                      title={
                        <Box sx={{ p: 0.5, maxWidth: 180 }}>
                          <Stack direction="row" spacing={0.4} alignItems="center" sx={{ mb: 0.75 }}>
                            <Iconify icon="mdi:star-circle-outline" width={15} sx={{ color: '#212B36', flexShrink: 0 }} />
                            <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#212B36' }}>Total Score</Typography>
                            <Typography sx={{ fontSize: 10, color: 'rgba(0,0,0,0.4)', ml: 'auto' }}>Weight: 100%</Typography>
                          </Stack>
                          <Typography sx={{ fontSize: 11, color: 'rgba(0,0,0,0.6)', mb: 0.75, lineHeight: 1.5 }}>
                            Weighted sum of all 5 evaluation pillars:
                          </Typography>
                          {[
                            { name: 'Turnover & Margin', weight: '30%' },
                            { name: 'Assortment & Innovation', weight: '30%' },
                            { name: 'Quality Assurance', weight: '25%' },
                            { name: 'Fulfillment & Operations', weight: '25%' },
                            { name: 'Terms & Conditions', weight: '15%' },
                          ].map((item, i) => (
                            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.35 }}>
                              <Typography sx={{ fontSize: 11, color: 'rgba(0,0,0,0.75)' }}>• {item.name}</Typography>
                              <Typography sx={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>{item.weight}</Typography>
                            </Stack>
                          ))}
                          <Box sx={{ mt: 1, p: 0.75, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.05)' }}>
                            <Typography sx={{ fontSize: 10.5, color: 'rgba(0,0,0,0.5)', fontFamily: 'monospace' }}>
                              A ≥ 80 · B ≥ 60 · C ≥ 40 · D &lt; 40
                            </Typography>
                          </Box>
                        </Box>
                      }
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'help' }}>
                        <Iconify icon="mdi:information" width={12} sx={{ color: '#212B36', ml: 0 }} />
                      </span>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.map((s) => {
                const segColor = currentSegments.find((sg) => sg.label === (chartType === 'cumulative' ? s.segment : s.valueBucket))?.color ?? '#ccc';
                return (
                  <TableRow
                    key={s.vendorNo}
                    hover
                    onClick={() => router.push(paths.dashboard.scorecardDetail(s.vendorNo))}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.2}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: segColor, flexShrink: 0 }} />
                        <Box>
                          <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 210 }}>{s.name}</Typography>
                          {/* <Typography variant="caption" color="text.disabled">{s.vendorNo}</Typography> */}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align='right'><Typography variant="body2" fontWeight={600}>{fmtVal(s.value)}</Typography></TableCell>
                    {/* Share % cell */}
                    <TableCell align='right'>
                      {(() => {
                        const sp = sharePctMap[String(s.vendorNo)];
                        if (sp == null) return <Typography variant="body2" color="text.disabled">–</Typography>;
                        return (
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{sp.toFixed(2)}%</Typography>
                            {/* <Box sx={{ height: 3, borderRadius: 2, bgcolor: 'grey.200', mt: 0.5 }}>
                              <Box sx={{ height: '100%', borderRadius: 2, bgcolor: '#1B3FBD', width: `${Math.min(sp * 4, 100)}%` }} />
                            </Box> */}
                          </Box>
                        );
                      })()}
                    </TableCell>
                    {/* <TableCell sx={{ textAlign: 'center' }}><ClassBadge cls={s.cls} /></TableCell> */}
                    {PILLARS.map((p) => (
                      <TableCell key={p.key} sx={{ textAlign: 'center' }}>
                        <PillarCell score={s.pillars?.[p.key]?.score} max={p.max} color={p.color} />
                      </TableCell>
                    ))}
                    <TableCell sx={{ textAlign: 'center' }}>
                      <PillarCell
                        score={s.totalScore == null ? '-' : isNaN(Number(s.totalScore)) ? s.totalScore : Number(s.totalScore).toFixed(2)}
                        max={100}
                        color={segColor}
                        isTotal
                      />
                    </TableCell>
                  </TableRow>
                );
              })}

              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={PILLARS.length + 5} sx={{ textAlign: 'center', py: 5 }}>
                    <Typography color="text.secondary">No suppliers match your search</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[100, 500, 1000]}
          labelRowsPerPage="Rows:"
        />
      </Card>
    </Stack>
  );
}
