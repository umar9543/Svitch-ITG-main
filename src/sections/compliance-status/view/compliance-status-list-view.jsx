'use client';
import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { Get, Post, Put } from 'src/utils/AxiosHelper';
import { decrypt, encrypt } from 'src/api/encryption';
import { LoadingScreen } from 'src/components/loading-screen';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
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

import CompliantStatusTableRow from '../compliance-status-table-row';
import CompliantStatusTableToolbar from '../compliance-status-table-toolbar';
import CompliantStatusTableFiltersResult from '../compliance-status-table-filters-result';
import { _userList } from 'src/_mock';
import { getDecryptedUserData } from 'src/utils/getUser';
import { decryptObjectKeys } from 'src/utils/getDecryption';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Active', label: 'Active' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Expired', label: 'Expired' },
  { value: 'Not Uploaded', label: 'Not Uploaded' },
];

const TABLE_HEAD = [
  { id: 'VenderName', label: 'Supplier', minWidth: 160 },
  { id: 'CountryName', label: 'Country', minWidth: 160 },
  { id: 'CertificateTo', label: 'Validity Date', minWidth: 160, align: 'center' },
  { id: 'Status', label: 'Status' },
  // { id: 'Remarks', label: 'Remarks', minWidth: 160 },
  { id: 'ReminderStatus', label: 'Mail Status' },
  { id: 'View', label: 'View' },
  { id: 'SendToSupplier', label: 'Mail', align: 'center' },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function CompliantStatusListView() {
  // Table component Ref
  const tableComponentRef = useRef();

  // Fetching data:
  const [tableData, setTableData] = useState([]);
  const [customersSet, setCustomersSet] = useState(new Set());
  const [isLoading, setisLoading] = useState(false);

  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;

  const GetVenderComplianceStatus = async () => {
    try {
      const res = await Get(`GetVenderComplianceStatus`);
      const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
      const CustomersWithincrementalID = decryptedFilteredCustomers.map((customer, index) => ({
        ...customer,
        id: index + 1,
      }));
      setTableData(CustomersWithincrementalID);
    } catch (error) {
      console.log('error getting supplier filtered customers', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setisLoading(true);
        await GetVenderComplianceStatus();
        setisLoading(false);
      } catch (error) {
        console.log('error getting supplier filtered customers', error);
      }
    };
    fetchData();
  }, []);

  // const PostNewSuppliersToDB = useCallback(async () => {
  //   try {
  //     const response = await Post(`InsertNewSupplierFromDB?UserID=${decrypt(userData[0].UserID)}`);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [userData]);

  // const FetchBookingData = useCallback(async () => {
  //   try {
  //     PostNewSuppliersToDB();
  //     const response = await Get(`GetCompliantStatusing?UserID=${decrypt(userData[0].UserID)}`);
  //     const decryptedData = decryptObjectKeys(response.data.ServiceRes);
  //     setTableData(decryptedData.sort((a, b) => a.VenderName.localeCompare(b.VenderName)));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [userData, PostNewSuppliersToDB]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await Promise.all([FetchBookingData()]);
  //     setLoading(false);
  //   };
  //   fetchData();
  // }, [FetchBookingData]);

  useEffect(() => {
    const uniqueCustomers = new Set(tableData.map((obj) => obj.CountryName));
    setCustomersSet(uniqueCustomers);
  }, [tableData]);
  // Convert the Set back to an array for rendering, if needed
  const uniqueCustomersArray = [...customersSet];

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

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

  // -------------------------------------

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const renderLoading = <LoadingScreen sx={{ height: { xs: 200, md: 300 } }} />;

  return (
    <>
      {isLoading ? (
        renderLoading
      ) : (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          {/* <CustomBreadcrumbs
            heading="Supplier Onboarding"
            links={[{ name: 'Home', href: paths.dashboard.root }, { name: 'Supplier Onboarding' }]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          /> */}

          <Card>
            <Tabs
              value={filters.status}
              onChange={handleFilterStatus}
              sx={{
                px: 2.5,
                boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              }}
            >
              {STATUS_OPTIONS.map((tab, index) => (
                <Tab
                  key={index}
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
                        (tab.value === 'Active' && 'success') ||
                        (tab.value === 'Expired' && 'error') ||
                        (tab.value === 'Not Uploaded' && 'error') ||
                        (tab.value === 'Pending' && 'warning') || // Set color for Pending tab
                        'default'
                      }
                    >
                      {tab.value === 'Pending'
                        ? tableData.filter(
                            (supplier) =>
                              supplier.Status !== 'Active' &&
                              supplier.Status !== 'Expired' &&
                              supplier.Status !== 'Not Uploaded'
                          ).length // Count Pending items
                        : ['Active', 'Expired', 'Not Uploaded'].includes(tab.value)
                          ? tableData.filter((supplier) => supplier.Status === tab.value).length
                          : tableData.length}
                    </Label>
                  }
                />
              ))}
            </Tabs>

            <CompliantStatusTableToolbar
              filters={filters}
              onFilters={handleFilters}
              roleOptions={uniqueCustomersArray}
              tableRef={tableComponentRef.current}
            />

            {canReset && (
              <CompliantStatusTableFiltersResult
                filters={filters}
                onFilters={handleFilters}
                //
                onResetFilters={handleResetFilters}
                //
                results={dataFiltered.length}
                sx={{ p: 2.5, pt: 0 }}
              />
            )}

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={dataFiltered.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row, id) => id)
                  )
                }
              />

              <Scrollbar>
                <Table
                  ref={tableComponentRef}
                  size={table.dense ? 'small' : 'medium'}
                  sx={{ minWidth: 960 }}
                >
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                    onSort={table.onSort}
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      // .sort((a, b) => a.VenderName.localeCompare(b.VenderName))
                      .map((row, id) => (
                        <CompliantStatusTableRow
                          sno={row?.id + 1}
                          key={row?.id}
                          row={row}
                          FetchUpdatedData={() => {
                            GetVenderComplianceStatus();
                          }}
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
        </Container>
      )}

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
            color="error"
            onClick={() => {
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
      (onboarding) =>
        onboarding.VenderName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        onboarding.CertificateTo.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        onboarding.CountryName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        onboarding.ReminderStatus.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  // Filter by status
  if (status !== 'all') {
    if (status === 'Pending') {
      inputData = inputData.filter(
        (onboarding) =>
          onboarding.Status !== 'Active' &&
          onboarding.Status !== 'Expired' &&
          onboarding.Status !== 'Not Uploaded'
      );
    } else {
      inputData = inputData.filter((onboarding) => onboarding.Status === status);
    }
  }

  // Filter by role
  if (role.length) {
    inputData = inputData.filter((onboarding) => role.includes(onboarding.CountryName));
  }

  return inputData;
}
