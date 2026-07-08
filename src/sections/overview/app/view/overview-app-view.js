'use client';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Autocomplete,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
} from '@mui/material';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled, _bookingsOverview } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import AppWidget from '../app-widget';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppNewInvoice from '../app-new-invoice';
import AppTopAuthors from '../app-top-authors';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import { CourseWidgetSummary } from '../CourseWidgetSummary';
import AppCurrentDownload from '../app-current-download';
import AppTopInstalledCountries from '../app-top-installed-countries';
import { getDecryptedUserData } from 'src/utils/getUser';
import { useEffect, useState, useCallback } from 'react';
import { Get } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import Scrollbar from 'src/components/scrollbar';
import { fPercent } from 'src/utils/format-number';
import Iconify from 'src/components/iconify';
import { getCountries } from 'src/utils/Countries';
import { emptyRows, getComparator, TableEmptyRows, TableHeadCustom, TableNoData, useTable } from 'src/components/table';
import { Box } from '@mui/system';
import Label from 'src/components/label';


// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();
  const table = useTable();


  const [userData, setUserData] = useState(null);
  const [dashboardData, setDashboardData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [allCountries, setAllCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [suppliersByCountry, setSuppliersByCountry] = useState([]);
  const [supplierTableLoading, setSupplierTableLoading] = useState(false);
  const [supplierPage, setSupplierPage] = useState(0);
  const [supplierRowsPerPage, setSupplierRowsPerPage] = useState(5);

  const getDashboardData = async () => {
    if (userData != null) {
      try {
        const res = await Get(`GetDashboardData?UserID=${userData[0]?.UserID}`);
        if (res.data.ResponseCode === '100') {
          const decryptedData = decryptObjectKeys(res.data.ServiceRes);
          setDashboardData(decryptedData);
        } else if (res.data.ResponseCode === '-2') {
          console.log('error in getting dashboard data', res.data.ServiceRes);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }
  };

  const getAllCountries = useCallback(async () => {
    if (!userData) return;
    try {
      const res = await Get(`GetCountry?UserID=${userData[0]?.UserID}`);
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setAllCountries(decryptedData);

        const defaultCountry = decryptedData.find((c) => c.Country_id === '46');
        if (defaultCountry) {
          setSelectedCountries([defaultCountry]);
        }
      }
    } catch (error) {
      console.error('Error getting countries', error);
    }
  }, [userData]);

  const getSuppliersByCountry = useCallback(async (countryIds) => {
    if (!userData || countryIds.length === 0) {
      setSuppliersByCountry([]);
      return;
    }
    setSupplierTableLoading(true);
    try {
      const ids = countryIds.join(',');
      const res = await Get(
        `GetSupplierDataByCountryID?UserID=${userData[0]?.UserID}&CountryID=${ids}`
      );
      if (res.data.ResponseCode === '100') {
        const decryptedData = decryptObjectKeys(res.data.ServiceRes);
        setSuppliersByCountry(decryptedData);
      } else {
        setSuppliersByCountry([]);
      }
    } catch (error) {
      console.error('Error getting suppliers by country', error);
      setSuppliersByCountry([]);
    } finally {
      setSupplierTableLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const decryptedUserData = getDecryptedUserData();
        setUserData(decryptedUserData);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    getDashboardData();
    getAllCountries();
  }, [userData]);

  useEffect(() => {
    if (selectedCountries.length > 0) {
      const ids = selectedCountries.map((c) => c.Country_id);
      getSuppliersByCountry(ids);
      setSupplierPage(0);
    } else {
      setSuppliersByCountry([]);
    }
  }, [selectedCountries]);

  if (!userData) {
    return null; // Handle this by showing a loader or some fallback UI
  }
  const countries = getCountries();

  const getFlagByCountryCode = (countryName) => {
    const country = countries?.find((c) => c.label.toLowerCase() === countryName?.toLowerCase());
    return country ? `flagpack:${country?.code?.toLowerCase()}` : '';
  };

  const settings = useSettingsContext();


  const TABLE_HEAD = [
    { id: 'VenderName', label: 'Supplier Name', width: 240 },
    { id: 'CountryName', label: 'Country', width: 180 },
    { id: 'City', label: 'City', width: 125 },
    { id: 'Address1', label: 'Address', width: 180 },
    { id: 'Status', label: 'Status', width: 120 },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${userData[0]?.UserName}`}
          // description="This is your dashboard. You can view the data here."
          // img={<SeoIllustration />}
          // action={
          //   <Button variant="contained" color="primary">
          //     Go Now
          //   </Button>
          // }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        <Grid xs={12} md={4}>
          <CourseWidgetSummary
            title="Total Onboarded Suppliers"
            total={Number(dashboardData[0]?.TotalOnBoardedSuppliers) || 0}
            icon="/assets/icons/courses/ic-users.svg"
            color="warning"
          />
        </Grid>

        <Grid xs={12} md={4}>
          <CourseWidgetSummary
            title="Total Surveys Conducted"
            total={Number(dashboardData[0]?.NumberOfSurveysConducted) || 0}
            icon="/assets/icons/courses/ic-author.svg"
            color="info"
          />
        </Grid>

        <Grid xs={12} md={4}>
          <CourseWidgetSummary
            title="% of Survey Completed"
            total={fPercent(dashboardData[0]?.PercentageOfSuppliersCompletedSurvey) || 0}
            icon="/assets/icons/courses/ic-check.svg"
            color="success"
          />
        </Grid>



        <Grid xs={12} md={6}>
          <CourseWidgetSummary
            title="No. of Workshops Conducted"
            total={Number(dashboardData[0]?.NoOfWorkshopsConducted) || 0}
            icon="/assets/icons/courses/ic-book.svg"
            color="error"
          />
        </Grid>

        <Grid xs={12} md={6}>
          <CourseWidgetSummary
            title="% of Participation in Workshop"
            total={fPercent(dashboardData[0]?.PercentageOfSuppliersJoinedWorkshops) || 0}
            icon="/assets/icons/courses/ic-participate.svg"
            color="primary"
          />
        </Grid>

        {/* <Box
          sx={{
            p: { md: 1 },
            display: 'grid',
            gap: { xs: 3, md: 0 },
            borderRadius: { md: 2 },
            bgcolor: { md: 'background.paper' },
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          <BookingTotalIncomes
            title="Total incomes"
            total={18765}
            percent={2.6}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [{ data: [10, 41, 80, 100, 60, 120, 69, 91, 160] }],
            }}
          />

          <BookingBooked
            title="Booked"
            data={_bookingsOverview}
            sx={{ boxShadow: { md: 'none' } }}
          />
        </Box> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Current Download"
            chart={{
              series: [
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Area Installed"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Asia',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'America',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Asia',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'America',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid> */}

        <Grid xs={12}>
          <Card>
            <CardHeader
              title="Suppliers by Country"
              action={
                <Autocomplete
                  multiple
                  size="small"
                  options={allCountries}
                  getOptionLabel={(option) => option.CountryName || ''}
                  isOptionEqualToValue={(option, value) => option.Country_id === value.Country_id}
                  value={selectedCountries}
                  limitTags={3}
                  onChange={(_, newValue) => setSelectedCountries(newValue)}
                  ChipProps={{
                    size: 'small',
                    color: 'primary',
                    variant: 'soft',
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select countries" />
                  )}
                  sx={{ minWidth: 180 }}
                />
              }
              sx={{ mb: 2 }}
            />
            <Scrollbar>
              <Table sx={{ minWidth: 640 }} >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={suppliersByCountry.length}
                  onSort={table.onSort} />

                <TableBody>

                  {[...suppliersByCountry]
                    .sort(getComparator(table.order, table.orderBy))
                    .slice(
                      supplierPage * supplierRowsPerPage,
                      supplierPage * supplierRowsPerPage + supplierRowsPerPage
                    )
                    .map((row, index) => (
                      <TableRow key={row.VenderLibraryID ?? index}>
                        <TableCell sortDirection={table.orderBy === 'VenderName' ? table.order : false}>{row.VenderName}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                          <Stack direction="row" alignItems="center">
                            <Iconify
                              icon={getFlagByCountryCode(row.CountryName)}
                              sx={{ borderRadius: 0.65, border: '1px gray ', width: 24, mr: 1 }}
                            />
                            {row.CountryName}
                          </Stack>
                        </TableCell>
                        <TableCell>{row.City}</TableCell>
                        <TableCell>{row.Address1}</TableCell>
                        <TableCell>
                          <Label variant="soft" color={row?.Status === 'Active' ? 'success' : 'error'}>
                            {row?.Status ?? ''}
                          </Label>
                        </TableCell>
                      </TableRow>
                    ))
                  }

                  <TableEmptyRows
                    height={56}
                    emptyRows={emptyRows(supplierPage, supplierRowsPerPage, suppliersByCountry.length)}
                  />

                  <TableNoData notFound={suppliersByCountry.length === 0} />
                </TableBody>
              </Table>
            </Scrollbar>
            {suppliersByCountry.length > 0 && (
              <TablePagination
                component="div"
                count={suppliersByCountry.length}
                page={supplierPage}
                rowsPerPage={supplierRowsPerPage}
                onPageChange={(_, newPage) => setSupplierPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setSupplierRowsPerPage(parseInt(e.target.value, 10));
                  setSupplierPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
              />
            )}
          </Card>
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Top Related Applications" list={_appRelated} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top Authors" list={_appAuthors} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
