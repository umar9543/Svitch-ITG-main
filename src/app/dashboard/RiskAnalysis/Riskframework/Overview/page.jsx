'use client';
import { Button, Card, Grid, Typography } from '@mui/material';
import { borderRadius, Box, Container } from '@mui/system';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { getDecryptedUserData } from 'src/utils/getUser';

const page = () => {
  const settings = useSettingsContext();
  const router = useRouter();
  const userData = getDecryptedUserData();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Risk Analysis"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
            // { name: 'Laws', href: paths.dashboard.RiskAnalysis.Riskframework.Laws.root },
            // { name: 'List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Typography
          variant="h4"
          gutterBottom
          fontStyle="italic"
          textAlign="center"
          // gridColumn="span 12"
        >
          Welcome to Svitch Risk Analysis and Risk Management Module!
        </Typography>
        <Box
          rowGap={2}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            sm: 'repeat(1, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          <Card
            sx={{
              // gridColumn: { md: 'span 1' },
              p: 3,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              border: '1px solid #ddd',
            }}
          >
            <Typography variant="h6">User Information</Typography>
            {userData[0]?.UserID === '1577' ? (
              <img
                src={'/assets/images/Sergius.png' || '/assets/images/dummy1.jpg'}
                alt={userData[0]?.UserName}
                width="auto"
                height={180}
                sx={{ borderRadius: '8px' }}
              />
            ) : (
              <img
                src={userData?.SupplierPhoto || '/assets/images/dummy1.jpg'}
                alt={userData[0]?.UserName}
                width="auto"
                height={180}
                sx={{ borderRadius: '8px' }}
              />
            )}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">{userData[0]?.UserName}</Typography>
              <Typography variant="body2">
                {userData[0]?.Designation == '-' ? '' : userData[0]?.Designation}
              </Typography>
            </Box>
          </Card>
          <Box
            sx={{
              gridColumn: { md: 'span 2' },
            }}
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              sm: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            }}
            // sx={{ gridColumn: 'span 9' }}
          >
            {/* <Card
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #ddd',
              }}
            >
              <Typography variant="h6">Country Risk </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  router.push('/dashboard/RiskAnalysis/RiskFactor/CountryRisk/rating');
                }}
              >
                View
              </Button>
            </Card> */}
            <Card
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #ddd',
              }}
            >
              <Typography variant="h6">Country Risk</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    router.push('/dashboard/RiskAnalysis/RiskFactor/CountryRisk/rating');
                  }}
                >
                  View
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    router.push('/dashboard/RiskAnalysis/RiskFactor/CountryRisk/rating/add');
                  }}
                >
                  Add
                </Button>
              </Box>
            </Card>
            <Card
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #ddd',
              }}
            >
              <Typography variant="h6">Industry Risk </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    router.push('/dashboard/RiskAnalysis/RiskFactor/IndustryRisk/rating/');
                  }}
                >
                  View
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    router.push('/dashboard/RiskAnalysis/RiskFactor/IndustryRisk/rating/add');
                  }}
                >
                  Add
                </Button>
              </Box>
            </Card>
            <Card
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #ddd',
              }}
            >
              <Typography variant="h6">Risk Matrix</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  router.push('/dashboard/RiskAnalysis/LawsMatrix');
                }}
              >
                View
              </Button>
            </Card>
            <Card
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #ddd',
              }}
            >
              <Typography variant="h6">Non-Compliant Risk</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    router.push('/dashboard/RiskAnalysis/RiskFactor/NonCompliantRisk/rating/');
                  }}
                >
                  View
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    router.push('/dashboard/RiskAnalysis/RiskFactor/NonCompliantRisk/rating/add');
                  }}
                >
                  Add
                </Button>
              </Box>
            </Card>

            <Card
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #ddd',
              }}
            >
              <Typography variant="h6">Questionnaire</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled
                  onClick={() => {
                    // router.push('/dashboard/RiskAnalysis/QuestionnaireMatrix');
                  }}
                >
                  View
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled
                  onClick={() => {
                    // router.push('/dashboard/RiskAnalysis/QuestionnaireMatrix/add');
                  }}
                >
                  Add
                </Button>
              </Box>
            </Card>
            <Card
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #ddd',
              }}
            >
              <Typography variant="h6">Workshop</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled
                  onClick={() => {
                    // router.push('/dashboard/RiskAnalysis/WorkshopMatrix');
                  }}
                >
                  View
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled
                  onClick={() => {
                    // router.push('/dashboard/RiskAnalysis/WorkshopMatrix/add');
                  }}
                >
                  Add
                </Button>
              </Box>
            </Card>
            {/* <Card
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #ddd',
              }}
            >
              <Typography variant="h6">amfori Report</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  router.push('/dashboard/RiskAnalysis/amforiReport');
                }}
              >
                Edit
              </Button>
            </Card> */}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default page;
