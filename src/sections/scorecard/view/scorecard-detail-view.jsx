'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  CircularProgress,
  Chip,
  Alert,
  LinearProgress,
  Container,
  Button,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { paths } from 'src/routes/paths';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

const API_KEY = '081473f4b1e7309a9a09127bf277c15565b213fcf230451618d697071ebc30a4';

const TIER_COLORS = {
  'Strategic Partner': '#1B3FBD',
  'Preferred Supplier': '#F5A623',
  'Approved Supplier': '#5B8DEF',
  'At Risk': '#E53935',
};

const GRADE_COLORS = {
  A: '#36B37E',
  B: '#F5A623',
  C: '#FFAB00',
  D: '#FF5630',
};

function KpiCard({ label, value, icon, color = 'primary' }) {
  const theme = useTheme();
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
        <Typography variant="h4" fontWeight={800} color="text.primary">
          {value}
        </Typography>
        <Typography noWrap variant="subtitle2" component="div" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {label}
        </Typography>
      </Box>

      <Box
        sx={{
          top: -44,
          width: 160,
          zIndex: 0,
          height: 160,
          right: -104,
          opacity: 0.12,
          borderRadius: 3,
          position: 'absolute',
          transform: 'rotate(40deg)',
          background: `linear-gradient(to right, ${colorMain} 0%, ${colorDark} 100%)`,
        }}
      />

      {icon && (
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
          <Iconify icon={icon} width={36} height={36} sx={{ color: colorMain }} />
        </Box>
      )}
    </Card>
  );
}

const rankInfoText = (
  <Box sx={{ p: 1, maxWidth: 300 }}>
    <Typography variant="subtitle2" mb={1} fontWeight={700}>Grading System</Typography>
    <Typography variant="body2" sx={{ mb: 0.5 }}><b>A (3 marks):</b> Top 80% / Meets all targets</Typography>
    <Typography variant="body2" sx={{ mb: 0.5 }}><b>B (2 marks):</b> 80-95% Rank / Minor deviations</Typography>
    <Typography variant="body2" sx={{ mb: 0.5 }}><b>C (1 marks):</b> 95-100% Rank / Needs improvement</Typography>
    <Typography variant="body2" sx={{ mb: 0.5 }}><b>D (0 marks):</b> Unacceptable / Missed targets</Typography>
    <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
      Extracted from Supplier Performance Measurement Marking Scheme.
    </Typography>
  </Box>
);

export default function ScorecardDetailView({ id }) {
  const settings = useSettingsContext();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://scorecard-production-e741.up.railway.app/api/conrad/supplier/${id}`, {
      headers: { 'x-api-key': API_KEY }
    })
      .then(res => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (json.success && json.supplier) {
          setData(json.supplier);
        } else {
          throw new Error('Invalid data format');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h6">Failed to load supplier details</Typography>
          <Typography color="text.secondary">{error}</Typography>
        </Box>
      </Container>
    );
  }

  const cleanName = (raw = '') => raw.replace(/^\d+_/, '');
  // const tierColor = TIER_COLORS[data.tier] || '#999';

  const formatCurrency = (val, currency = 'EUR') => {
    if (val == null) return 'NA';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(val);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Supplier Scorecard Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Business Turnover', href: paths.dashboard.businessTurnover },
          { name: cleanName(data.vendorName) },
        ]}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            onClick={() => router.push(paths.dashboard.businessTurnover)}
          >
            Back to Dashboard
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        {/* Header Summary */}
        <Grid item xs={12}>
          <Card
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 3,
              background: 'linear-gradient(135deg, #EBF1FF 0%, #D3E2FF 100%)',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(27,63,189,0.10)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {[180, 120, 70].map((sz, i) => (
              <Box key={i} sx={{
                position: 'absolute', pointerEvents: 'none',
                width: sz, height: sz, borderRadius: '50%',
                bgcolor: 'rgba(91,141,239,0.12)',
                top: i === 0 ? -50 : i === 1 ? 20 : 80,
                right: i === 0 ? -40 : i === 1 ? 90 : 30,
              }} />
            ))}

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" fontWeight={800} gutterBottom sx={{ color: '#1B3FBD' }}>
                {cleanName(data.vendorName)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Vendor No: {data.vendorNo} | Team: {data.team || 'NA'}
              </Typography>
            </Box>

            <Stack direction="row" spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
              {/* <Box textAlign="center">
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Tier</Typography>
                <Chip
                  label={data.tier || 'Unknown'}
                  sx={{
                    bgcolor: tierColor,
                    color: '#fff',
                    fontWeight: 700,
                    mt: 1
                  }}
                />
              </Box> */}
              <Box textAlign="center">
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Total Score</Typography>
                <Typography variant="h3" fontWeight={800} sx={{ color: '#1B3FBD', mt: 0.5 }}>
                  {data.totalScore == null ? "NA" : (data.totalScore)}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Data Warnings
        {data.dataWarnings && data.dataWarnings.length > 0 && (
          <Grid item xs={12}>
            <Alert severity="warning" variant="outlined" icon={<Iconify icon="eva:alert-triangle-fill" />}>
              <Typography variant="subtitle2" fontWeight={700}>Data Warnings</Typography>
              <Typography variant="body2">Issues detected with: {data.dataWarnings.join(', ')}</Typography>
            </Alert>
          </Grid>
        )} */}

        {/* Actuals Section */}
        {data.actuals && (
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight={700} mb={2} mt={1}>Financial Actuals</Typography>
            <Grid container spacing={2}>
              {Object.entries(data.actuals).map(([key, value]) => {
                const formattedKey = key.replace(/([A-Z0-9])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const currency = key.toLowerCase().includes('profit') ? 'HKD' : 'EUR';
                return (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <KpiCard
                      label={formattedKey}
                      value={formatCurrency(value, currency)}
                      icon="mdi:cash-multiple"
                      color="info"
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        )}

        {/* Pillars Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', height: '100%' }}>
            <Typography variant="h6" fontWeight={700} mb={3}>Performance Pillars</Typography>
            <Stack spacing={3}>
              {Object.entries(data.pillars || {})
                .map(([key, pillar]) => {

                  // Override for terms and turnoverMargin if missing from backend
                  const maxScore = key === 'terms' ? 15 : key === 'turnoverMargin' ? 12 : pillar.maxScore;
                  const weight = key === 'terms' ? '15%' : pillar.weight;
                  const pct = maxScore && !isNaN(Number(pillar.score)) ? Math.min((Number(pillar.score) / maxScore) * 100, 100) : 0;

                  return (
                    <Box key={pillar.label || key}>
                      <Stack direction="row" justifyContent="space-between" mb={1}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {pillar.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ color: 'text.secondary' }}>
                          {`${pillar.score} / ${maxScore || '?'}`}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': { bgcolor: '#00B8D9', borderRadius: 4 },
                        }}
                      />
                    </Box>
                  );
                })}
            </Stack>
          </Card>
        </Grid>

        {/* Grades Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <Typography variant="h6" fontWeight={700}>Metric Grades</Typography>
              <Tooltip title={rankInfoText} arrow placement="top">
                <Box component="span" sx={{ display: 'inline-flex' }}>
                  <Iconify icon="eva:info-outline" width={20} sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} />
                </Box>
              </Tooltip>
            </Stack>
            <Grid container spacing={2}>
              {Object.entries(data.grades || {})
                .filter(([_, grade]) => grade)
                .sort(([, gradeA], [, gradeB]) => gradeA.localeCompare(gradeB))
                .map(([key, grade]) => {
                  let formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  formattedKey = formattedKey.replace(/Cei/g, 'CEI').replace(/Cee/g, 'CEE').replace(/Cm1/g, 'CM1');
                  if (key.toLowerCase() === 'mov') formattedKey = 'Minimum Order Value';
                  if (key === 'orderConf') formattedKey = 'Order Confirmation';
                  return (
                    <Grid item xs={6} sm={4} md={2} key={key}>
                      <Card
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          bgcolor: 'background.neutral',
                          boxShadow: 'none',
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" display="block" mb={1} noWrap>
                          {formattedKey}
                        </Typography>
                        <Typography
                          variant="h5"
                          fontWeight={800}
                          sx={{ color: GRADE_COLORS[grade] || 'text.primary' }}
                        >
                          {grade}
                        </Typography>
                      </Card>
                    </Grid>
                  );
                })}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
