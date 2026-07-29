'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Stack,
  Table,
  Avatar,
  Button,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  InputAdornment,
  TableContainer,
  LinearProgress,
  TablePagination,
  CircularProgress,
  Chip,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ApexCharts – SSR safe
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ─────────────────────────────────────────────
// API CONFIG
// ─────────────────────────────────────────────
const API_URL = 'https://scorecard-production-e741.up.railway.app/api/conrad/results';
const API_KEY = '6cefbca609d6f935f9ff82ad234435c90eca70a0d8e46c6b1e6a151438faa93a';

// ─────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────
const TIER_COLORS = {
  'Strategic Partner': '#1B3FBD',
  'Preferred Supplier': '#F5A623',
  'Approved Supplier': '#5B8DEF',
  'At Risk': '#E53935',
};

const TIER_BADGE = {
  'Strategic Partner': { label: 'A', color: '#1B3FBD' },
  'Preferred Supplier': { label: 'B', color: '#F5A623' },
  'Approved Supplier': { label: 'C', color: '#5B8DEF' },
  'At Risk': { label: 'R', color: '#E53935' },
};

const PILLAR_COLORS = {
  strategic: '#1B3FBD',
  preferred: '#F5A623',
  approved: '#7C4DFF',
};

// ─────────────────────────────────────────────
// PILLARS
// ─────────────────────────────────────────────
const PILLARS = [
  { key: 'turnoverMargin', label: 'Turnover', max: 30 },
  { key: 'assortmentInnovation', label: 'Assortment', max: 30 },
  { key: 'quality', label: 'Quality', max: 25 },
  { key: 'terms', label: 'Terms', max: 15 },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const cleanName = (raw = '') => raw.replace(/^\d+_/, '');

function getPillarAvg(suppliers, pillarKey) {
  const vals = suppliers
    .map((s) => s.pillars?.[pillarKey]?.score ?? null)
    .filter((v) => v !== null);
  if (!vals.length) return 0;
  return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
}

// ─────────────────────────────────────────────
// KPI CARD
// ─────────────────────────────────────────────
function KpiCard({ label, value, icon, color = 'warning', subtitle }) {
  const theme = useTheme();

  // Resolve main/dark colors from theme palette or use the literal values
  const colorMain = theme.palette[color]?.main || color;
  const colorDark = theme.palette[color]?.dark || color;

  return (
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
      <Box sx={{ flexGrow: 1, zIndex: 1, fontFamily: '__Public_Sans_af9ad8, __Public_Sans_Fallback_af9ad8, Helvetica, Arial, sans-serif' }}>
        <Typography variant="h3" fontWeight={800} color="text.primary">
          {value}
        </Typography>
        <Typography noWrap variant="subtitle2" component="div" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {label}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
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
          background: `linear-gradient(to right, ${colorMain} 0%, ${colorDark} 100%)`,
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
          icon={icon}
          width={36}
          height={36}
          sx={{
            color: colorMain,
          }}
        />
      </Box>
    </Card>
  );
}

// ─────────────────────────────────────────────
// TIER PILLAR PANEL (horizontal bars)
// ─────────────────────────────────────────────
function TierPillarPanel({ tierName, suppliers, color }) {
  const count = suppliers.length;
  const data = PILLARS.map((p) => {
    const avg = getPillarAvg(suppliers, p.key);
    const pct = p.max ? parseFloat(((avg / p.max) * 100).toFixed(1)) : avg;
    return { label: p.label, pct, avg };
  });

  const maxPct = Math.max(...data.map((d) => d.pct), 10);

  return (
    <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', height: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {tierName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Avg pillar score % across {count} suppliers
          </Typography>
        </Box>
        <Chip
          label={count}
          size="small"
          sx={{ bgcolor: color, color: '#fff', fontWeight: 700, borderRadius: 1, px: 0.5 }}
        />
      </Stack>

      <Stack spacing={1.5}>
        {data.map((d) => (
          <Box key={d.label}>
            <Stack direction="row" justifyContent="space-between" mb={0.4}>
              <Typography variant="caption" color="text.secondary">
                {d.label}
              </Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color }}>
                {d.pct}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Math.min(d.pct, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 },
              }}
            />
          </Box>
        ))}
      </Stack>

      <Stack direction="row" justifyContent="space-between" mt={1.5}>
        {[0, Math.round(maxPct / 4), Math.round(maxPct / 2), Math.round((maxPct * 3) / 4), Math.round(maxPct)].map(
          (v) => (
            <Typography key={v} variant="caption" color="text.disabled">
              {v}
            </Typography>
          )
        )}
      </Stack>
    </Card>
  );
}

// ─────────────────────────────────────────────
// SUPPLIER TABLE ROW
// ─────────────────────────────────────────────
function SupplierRow({ supplier }) {
  const router = useRouter();
  const badge = TIER_BADGE[supplier.tier] || { label: '?', color: '#999' };
  const score = supplier.totalScore ?? 0;
  const pct = Math.min(score, 100);

  return (
    <TableRow 
      hover 
      onClick={() => router.push(paths.dashboard.scorecardDetail(supplier.vendorNo))}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell sx={{ width: 60, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 30,
            height: 30,
            bgcolor: badge.color,
            fontSize: 12,
            fontWeight: 800,
            mx: 'auto',
          }}
        >
          {badge.label}
        </Avatar>
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontWeight={600}>
          {cleanName(supplier.vendorName)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {supplier.vendorNo}
        </Typography>
      </TableCell>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ color: '#00B8D9', minWidth: 38 }}
          >
            {score.toFixed(1)}
          </Typography>
          {/* <Box sx={{ flex: 1, maxWidth: 240 }}>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                height: 6,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': { bgcolor: '#00B8D9', borderRadius: 4 },
              }}
            />
          </Box> */}
        </Stack>
      </TableCell>
      <TableCell align="right">
        <Button
          size="small"
          endIcon={<Iconify icon="eva:arrow-forward-fill" />}
          sx={{ color: 'text.secondary', fontWeight: 500 }}
          onClick={() => router.push(paths.dashboard.scorecardDetail(supplier.vendorNo))}
        >
          View
        </Button>
      </TableCell>
    </TableRow>
  );
}

// ─────────────────────────────────────────────
// MAIN DASHBOARD VIEW
// ─────────────────────────────────────────────
export default function ScorecardDashboardView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isMounted, setIsMounted] = useState(false);

  // ─── Mount guard ───
  // setTimeout(fn, 0) is the key: React 18 Strict Mode fires cleanup BEFORE
  // the timeout, cancelling it. The timeout only fires after the final stable
  // mount, so ApexCharts never renders during the double-invoke crash window.
  useEffect(() => {
    const t = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // ─── Fetch ───
  useEffect(() => {
    fetch(API_URL, { headers: { 'x-api-key': API_KEY } })
      .then((r) => {
        if (!r.ok) throw new Error(`API error ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const allSuppliers = useMemo(() => data?.suppliers ?? [], [data]);
  const summary = data?.summary ?? {};

  const tierGroups = useMemo(
    () => ({
      strategic: allSuppliers.filter((s) => s.tier === 'Strategic Partner'),
      preferred: allSuppliers.filter((s) => s.tier === 'Preferred Supplier'),
      approved: allSuppliers.filter((s) => s.tier === 'Approved Supplier'),
      atRisk: allSuppliers.filter((s) => s.tier === 'At Risk'),
    }),
    [allSuppliers]
  );

  const filteredSuppliers = useMemo(() => {
    let list = allSuppliers;
    if (tierFilter === 'Rank A') list = tierGroups.strategic;
    else if (tierFilter === 'Rank B') list = tierGroups.preferred;
    else if (tierFilter === 'Rank C') list = tierGroups.approved;
    else if (tierFilter === 'At Risk') list = tierGroups.atRisk;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          cleanName(s.vendorName).toLowerCase().includes(q) ||
          s.vendorNo.includes(q)
      );
    }
    return list;
  }, [allSuppliers, tierFilter, search, tierGroups]);

  const paginated = useMemo(
    () => filteredSuppliers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredSuppliers, page, rowsPerPage]
  );

  // ─── Pie / Donut chart ───
  const pieOptions = useMemo(
    () => ({
      chart: { type: 'donut', toolbar: { show: false } },
      labels: (data?.tierDistribution ?? []).map((t) => t.tier),
      colors: (data?.tierDistribution ?? []).map((t) => TIER_COLORS[t.tier] ?? '#999'),
      legend: { show: true, position: 'bottom', fontSize: '12px' },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Suppliers',
                fontSize: '12px',
                color: '#888',
                formatter: () => String(summary.totalSuppliers ?? 0),
              },
              value: { fontSize: '22px', fontWeight: 800, color: '#1B3FBD' },
            },
          },
        },
      },
      stroke: { width: 2, colors: ['#fff'] },
      tooltip: { y: { formatter: (v) => `${v} suppliers` } },
    }),
    [data, summary]
  );

  const pieSeries = useMemo(
    () => (data?.tierDistribution ?? []).map((t) => t.count),
    [data]
  );

  // ─── Radar chart ───
  const radarOptions = useMemo(() => {
    const categories = PILLARS.map((p) => p.label);
    return {
      chart: { type: 'radar', toolbar: { show: false }, animations: { enabled: false } },
      xaxis: { categories },
      yaxis: { show: false },
      fill: { opacity: 0.25, colors: ['#5B8DEF'] },
      stroke: { width: 2, colors: ['#5B8DEF'] },
      markers: { size: 4, colors: ['#5B8DEF'] },
      plotOptions: { radar: { polygons: { strokeColors: '#E0E0E0', fill: { colors: ['#fff'] } } } },
      tooltip: { y: { formatter: (v) => `${v != null ? Number(v).toFixed(1) : 0}%` } },
      dataLabels: { enabled: true, style: { fontSize: '10px', colors: ['#5B8DEF'] } },
    };
  }, []);

  const radarSeries = useMemo(() => {
    const vals = PILLARS.map((p) => {
      const avg = getPillarAvg(allSuppliers, p.key);
      const pct = p.max ? parseFloat(((avg / p.max) * 100).toFixed(1)) : avg;
      // Ensure no undefined/NaN that would crash ApexCharts
      return Number.isFinite(pct) ? pct : 0;
    });
    return [{ name: 'Score %', data: vals }];
  }, [allSuppliers]);

  // ─── Loading / Error ───
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }} color="text.secondary">
          Loading scorecard data…
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Failed to load data
        </Typography>
        <Typography color="text.secondary">{error}</Typography>
      </Box>
    );
  }

  const FILTER_TABS = [
    { label: 'All', count: allSuppliers.length },
    { label: 'Rank A', count: tierGroups.strategic.length },
    { label: 'Rank B', count: tierGroups.preferred.length },
    { label: 'Rank C', count: tierGroups.approved.length },
    { label: 'At Risk', count: tierGroups.atRisk.length },
  ];

  return (
    <Stack spacing={4}>
      {/* ══ WELCOME HERO ══ */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card
            sx={{
              p: 4,
              minHeight: 220,
              background: 'linear-gradient(135deg, #EBF1FF 0%, #D3E2FF 100%)',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(27,63,189,0.10)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Decorative blobs — top-right */}
            {[110, 75, 48].map((size, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  borderRadius: i === 2 ? '40% 60% 55% 45%' : '50%',
                  bgcolor: 'rgba(91,141,239,0.18)',
                  top: i === 0 ? -28 : i === 1 ? 30 : 88,
                  right: i === 0 ? -18 : i === 1 ? 48 : 10,
                }}
              />
            ))}

            <Typography variant="body1" fontWeight={500} sx={{ color: '#374151', mb: 0.5 }}>
              Welcome back 👋
            </Typography>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#1B3FBD', lineHeight: 1.25 }}>
              CONRAD ELECTRONIC INTERNATIONAL
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card
            sx={{
              p: 3,
              minHeight: 160,
              background: 'linear-gradient(135deg, #1A1F36 0%, #0D1B2A 100%)',
              borderRadius: 3,
              boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
              color: '#fff',
              height: '100%',
            }}
          >
            <Chip
              label="FEATURED"
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.12)',
                color: '#fff',
                fontWeight: 700,
                mb: 1.5,
                fontSize: 10,
                borderRadius: 1,
              }}
            />
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.3}>
              Together, we build success through collaboration and innovation.
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.55)', display: 'block', mt: 1, mb: 2 }}
            >
              By streamlining onboarding and fostering open communication.
            </Typography>
            <Stack direction="row" spacing={3}>
              {[
                { label: 'Strategic', value: summary.strategicPartners ?? 0, color: '#F5A623' },
                { label: 'Preferred', value: summary.preferredSuppliers ?? 0, color: '#00B8D9' },
                { label: 'Approved', value: summary.approvedSuppliers ?? 0, color: '#36B37E' },
              ].map((item) => (
                <Box key={item.label}>
                  <Typography variant="h5" fontWeight={800} sx={{ color: item.color }}>
                    {item.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* ══ KPI CARDS ROW 1 ══ */}
      <Grid container spacing={2}>
        {[
          {
            label: 'Total Suppliers',
            value: summary.totalSuppliers ?? 0,
            icon: 'mdi:account-group',
            color: '#F5A623',
          },
          {
            label: 'Strategic Partners',
            value: summary.strategicPartners ?? 0,
            icon: 'mdi:star-circle',
            color: '#00B8D9',
          },
          {
            label: 'Preferred Suppliers',
            value: summary.preferredSuppliers ?? 0,
            icon: 'mdi:check-decagram',
            color: '#F5A623',
          },
          {
            label: 'Approved Suppliers',
            value: summary.approvedSuppliers ?? 0,
            icon: 'mdi:shield-check',
            color: '#7C4DFF',
          },
        ].map((kpi) => (
          <Grid item xs={12} sm={6} md={3} key={kpi.label}>
            <KpiCard {...kpi} />
          </Grid>
        ))}
      </Grid>

      {/* ══ KPI CARDS ROW 2 ══ */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <KpiCard
            label="Avg Score"
            value={(summary.avgScore ?? 0).toFixed(2)}
            subtitle={`Avg Score ${(summary.avgScore ?? 0).toFixed(2)} / 100`}
            icon="mdi:chart-bar"
            color="#1B3FBD"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <KpiCard
            label="Supplier at Risk"
            value={summary.atRisk ?? 0}
            icon="mdi:alert-circle"
            color="#E53935"
          />
        </Grid>
      </Grid>

      {/* ══ CHARTS ROW ══ */}
      <Grid container spacing={3}>
        {/* Donut Pie */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Distribution by Tier
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Portfolio composition breakdown
            </Typography>
            <Box sx={{ mt: 2 }}>
              {isMounted && pieSeries.length > 0 && (
                <ApexChart
                  type="donut"
                  options={pieOptions}
                  series={pieSeries.map((v) => (Number.isFinite(v) ? v : 0))}
                  height={300}
                />
              )}
            </Box>
          </Card>
        </Grid>

        {/* Radar */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Portfolio Radar Average Score %
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Average performance across all 5 pillars
            </Typography>
            <Box sx={{ mt: 2 }}>
              {isMounted && radarSeries[0]?.data?.length > 0 && (
                <ApexChart
                  type="radar"
                  options={radarOptions}
                  series={radarSeries}
                  height={300}
                />
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* ══ TIER PILLAR PANELS ══ */}
      <Grid container spacing={3} sx={{ fontFamily: '__Public_Sans_af9ad8, __Public_Sans_Fallback_af9ad8, Helvetica, Arial, sans-serif' }}>
        {[
          { name: 'Strategic Partners', key: 'strategic', color: PILLAR_COLORS.strategic },
          { name: 'Preferred Suppliers', key: 'preferred', color: PILLAR_COLORS.preferred },
          { name: 'Approved Suppliers', key: 'approved', color: PILLAR_COLORS.approved },
        ].map((t) => (
          <Grid item xs={12} md={4} key={t.key}>
            <TierPillarPanel
              tierName={t.name}
              suppliers={tierGroups[t.key]}
              color={t.color}
            />
          </Grid>
        ))}
      </Grid>

      {/* ══ FULL SUPPLIER TABLE ══ */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Box sx={{ p: 3, pb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Full Supplier Table
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Search, filter by tier, and click any row to view full profile
          </Typography>
        </Box>

        {/* Search + Filter */}
        <Box sx={{ px: 3, pb: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            flexWrap="wrap"
          >
            <TextField
              size="small"
              placeholder="Search supplier name, vendor no..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: 280 } }}
            />

            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
              {FILTER_TABS.map((f) => (
                <Button
                  key={f.label}
                  size="small"
                  variant={tierFilter === f.label ? 'contained' : 'outlined'}
                  onClick={() => {
                    setTierFilter(f.label);
                    setPage(0);
                  }}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: 12,
                    textTransform: 'none',
                    px: 1.2,
                    minWidth: 'unset',
                    ...(tierFilter === f.label
                      ? { bgcolor: '#1B3FBD', borderColor: '#1B3FBD', '&:hover': { bgcolor: '#152d94' } }
                      : { borderColor: 'divider', color: 'text.secondary' }),
                  }}
                >
                  {f.label}&nbsp;
                  <Chip
                    label={f.count}
                    size="small"
                    sx={{
                      height: 17,
                      fontSize: 10,
                      fontWeight: 700,
                      bgcolor: tierFilter === f.label ? 'rgba(255,255,255,0.22)' : 'grey.200',
                      color: tierFilter === f.label ? '#fff' : 'text.secondary',
                      cursor: 'inherit',
                    }}
                  />
                </Button>
              ))}

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 'auto', whiteSpace: 'nowrap' }}
              >
                {filteredSuppliers.length} suppliers
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, width: 60 }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Supplier ↓</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Score ↓</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No suppliers found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((s) => <SupplierRow key={s.vendorNo} supplier={s} />)
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredSuppliers.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="Rows:"
        />
      </Card>
    </Stack>
  );
}
