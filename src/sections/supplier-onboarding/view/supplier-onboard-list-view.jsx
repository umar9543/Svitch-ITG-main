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

import SupplierOnboardTableRow from '../supplier-onboard-table-row';
import SupplierOnboardTableToolbar from '../supplier-onboard-table-toolbar';
import SupplierOnboardTableFiltersResult from '../supplier-onboard-table-filters-result';
import { _userList } from 'src/_mock';
import { getDecryptedUserData } from 'src/utils/getUser';
import { decryptObjectKeys } from 'src/utils/getDecryption';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Responded', label: 'Responded' },
  { value: 'Invited', label: 'Invited' },
  { value: 'Not Invited', label: 'Not Invited' },
];

const TABLE_HEAD = [
  // { id: 'sno', label: 'No.' },
  // { id: 'CustomerName', label: 'Customer', width: 220 },
  { id: 'VenderName', label: 'Participant' },
  { id: 'PartyType', label: 'Party Type', width: 260 },
  { id: 'ReleaseDate', label: 'Best Before' },
  { id: 'Status', label: 'Status' },
  { id: 'LastLoginDateFormat1', label: 'Copy' },
  { id: 'SendToSupplier', label: 'Mail', align: 'center' },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function SupplierOnboardListView() {
  // Table component Ref
  const tableComponentRef = useRef();

  // Fetching data:
  const [tableData, setTableData] = useState([]);
  const [customersSet, setCustomersSet] = useState(new Set());
  const [isLoading, setisLoading] = useState(false);

  const userID = getDecryptedUserData() ? getDecryptedUserData()[0].UserID : 86;

  const GetPreOnboardListData = async () => {
    try {
      const res = await Get(`GetInvitationList?UserID=${userID}`);
      const decryptedFilteredCustomers = decryptObjectKeys(res.data.ServiceRes);
      setTableData(decryptedFilteredCustomers);
    } catch (error) {
      console.log('error getting supplier filtered customers', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setisLoading(true);
        await GetPreOnboardListData();
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
  //     const response = await Get(`GetSupplierOnBoarding?UserID=${decrypt(userData[0].UserID)}`);
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
    const uniqueCustomers = new Set(tableData.map((obj) => obj.CustomerName));
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

  // console.log(tableData);

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
                        (tab.value === 'Responded' && 'success') ||
                        (tab.value === 'Invited' && 'success') ||
                        (tab.value === 'Not Invited' && 'default') ||
                        'default'
                      }
                    >
                      {['Responded', 'Invited', 'Not Invited'].includes(tab.value)
                        ? tableData.filter((supplier) => supplier.Status === tab.value).length
                        : tableData.length}
                    </Label>
                  }
                />
              ))}
            </Tabs>

            <SupplierOnboardTableToolbar
              filters={filters}
              onFilters={handleFilters}
              roleOptions={uniqueCustomersArray}
              tableRef={tableComponentRef.current}
            />

            {canReset && (
              <SupplierOnboardTableFiltersResult
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
                        <SupplierOnboardTableRow
                          sno={id + 1}
                          key={id}
                          row={row}
                          FetchUpdatedData={() => {
                            GetPreOnboardListData();
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
        onboarding.CustomerName.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((onboarding) => onboarding.Status === status);
  }

  if (role.length) {
    inputData = inputData.filter((onboarding) => role.includes(onboarding.CustomerName));
  }

  return inputData;
}
