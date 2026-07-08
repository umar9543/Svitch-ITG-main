'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { _roles, _supplierList, USER_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import OnBoardingCoversheetTableRow from '../OnBoardingCoversheet-table-row';
import OnBoardingCoversheetTableToolbar from '../OnBoardingCoversheet-table-toolbar';
import OnBoardingCoversheetTableFiltersResult from '../OnBoardingCoversheet-table-filters-result';
import { Get } from 'src/utils/AxiosHelper';
import { decrypt } from 'src/api/encryption';
import { LoadingScreen, SplashScreen } from 'src/components/loading-screen';
import { minWidth } from '@mui/system';
import { getDecryptedUserData } from 'src/utils/getUser';
// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'New', label: 'New' },
  { value: 'Accepted', label: 'Accepted' },
  { value: 'Rejected', label: 'Rejected' },
];
const TABLE_HEAD = [
  { id: 'VenderName', label: 'Supplier Name', width: 240 },
  { id: 'City', label: 'City', width: 125 },
  { id: 'CountryID', label: 'Country', width: 180, defaultSort: 'asc' },
  // { id: 'email', label: 'Email', width: 180 },
  { id: '', label: 'Score Card', width: 120, align: 'center' },
  // { id: 'Country', label: 'Country', width: 100, align: 'left' },
  // { id: 'documents', label: 'Documents', width: 180, align: 'center' },
  // { id: 'status', label: 'Status', width: 100 },
  // { id: '', label: 'Actions', width: 88, align: 'right' },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function OnBoardingCoversheetListView() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;

  const [tableData, setTableData] = useState([]);
  const [uniqueCountryArray, setUniqueCountryArray] = useState([]);
  const [country, setCountry] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState(defaultFilters);

  const decryptObjectKeys = (data) => {
    const decryptedData = data.map((item) => {
      const decryptedItem = {};
      Object.keys(item).forEach((key) => {
        decryptedItem[key] = decrypt(item[key]);
      });
      return decryptedItem;
    });
    return decryptedData;
  };

  const getSupplier = async () => {
    try {
      const res = await Get(`GetOnBoardingCoverSheetList?UserID=${userID}`);
      // console.log('response', res.data.ServiceRes);
      const decryptData = decryptObjectKeys(res.data.ServiceRes);
      setTableData(decryptData);
    } catch (error) {
      console.error(error);
    }
  };
  const getCountry = async () => {
    try {
      const res = await Get(`GetCountry?UserID=${userID}`);
      const decryptData = decryptObjectKeys(res.data.ServiceRes);
      setCountry(decryptData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([getSupplier(), getCountry()]);
        setIsLoading(false);
      } catch (error) {
        console.log('Something went wrong!', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const uniqueCountrySet = new Set(tableData.map((item) => item.City));
    setUniqueCountryArray(Array.from(uniqueCountrySet));
  }, [tableData]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(`/dashboard/OnBoardingCoversheet/${id}`);
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* <CustomBreadcrumbs
          heading="OnBoardingCoversheet Database"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'OnBoarding Coversheet Database',
              href: paths.dashboard.OnBoardingCoversheet.root,
            },
            // { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={'/dashboard/OnBoardingCoversheet/add-OnBoardingCoversheet'}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New OnBoardingCoversheet
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        /> */}
        {isLoading ? (
          <LoadingScreen
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '70vh',
            }}
          />
        ) : (
          <Card>
            <Tabs
              value={filters.status}
              onChange={handleFilterStatus}
              sx={{
                px: 2.5,
                boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              }}
            >
              {STATUS_OPTIONS.map((tab) => (
                <Tab
                  key={tab.value}
                  iconPosition="end"
                  value={tab.value}
                  label={tab.label}
                  icon={
                    <Label
                      variant={
                        ((tab.value === 'all' || tab.value === filters.status) && 'filled') ||
                        'soft'
                      }
                      color={
                        (tab.value === 'Accepted' && 'success') ||
                        (tab.value === 'New' && 'info') ||
                        (tab.value === 'Rejected' && 'error') ||
                        'default'
                      }
                    >
                      {['Accepted', 'Rejected', 'New'].includes(tab.value)
                        ? tableData.filter((supplier) => supplier.Status === tab.value).length
                        : tableData.length}
                    </Label>
                  }
                />
              ))}
            </Tabs>

            <OnBoardingCoversheetTableToolbar
              filters={filters}
              onFilters={handleFilters}
              //
              roleOptions={uniqueCountryArray}
            />

            {canReset && (
              <OnBoardingCoversheetTableFiltersResult
                filters={filters}
                onFilters={handleFilters}
                //
                onResetFilters={handleResetFilters}
                //
                results={dataFiltered.length}
                sx={{ p: 2.5, pt: 0 }}
              />
            )}

            <>
              <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <TableSelectedAction
                  dense={table.dense}
                  numSelected={table.selected.length}
                  rowCount={dataFiltered.length}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                  action={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={confirm.onTrue}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  }
                />

                <Scrollbar>
                  <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                    <TableHeadCustom
                      order={table.order}
                      orderBy={table.orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={dataFiltered.length}
                      // numSelected={table.selected.length}
                      onSort={table.onSort}
                      // onSelectAllRows={(checked) =>
                      //   table.onSelectAllRows(
                      //     checked,
                      //     tableData.map((row) => row.id)
                      //   )
                      // }
                    />

                    <TableBody>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <OnBoardingCoversheetTableRow
                            country={country}
                            tableData={tableData}
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                          />
                        ))}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                      />

                      <TableNoData notFound={notFound} />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            </>
            <TablePaginationCustom
              count={dataFiltered.length}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              //
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
          </Card>
        )}
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (supplier) => supplier.VenderName.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((supplier) => supplier.Status === status);
  }

  if (role.length) {
    inputData = inputData.filter((supplier) => role.includes(supplier.City));
  }

  return inputData;
}
