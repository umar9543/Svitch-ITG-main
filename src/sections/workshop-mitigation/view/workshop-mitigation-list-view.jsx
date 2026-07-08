'use client';

import { useState, useCallback, useEffect } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTable, emptyRows, TableNoData, getComparator, TableEmptyRows, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { Get, Delete } from 'src/utils/AxiosHelper';
import { decryptRecursiveObjectKeys } from 'src/utils/getDecryption';
import { useSettingsContext } from 'src/components/settings';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { LoadingScreen } from 'src/components/loading-screen';

import WorkshopMitigationTableRow from '../workshop-mitigation-table-row';
import WorkshopMitigationTableToolbar from '../workshop-mitigation-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'expand', label: '', width: 20, maxWidth: 20 },
  { id: 'WorkShopName', label: 'Workshop', width: 220 },
  { id: 'PerformanceAreas', label: 'Performance Areas', width: 220 },
  { id: 'WorkShopDate', label: 'Date', align: 'center', width: 130 },
  { id: 'suppliers', label: 'No. of Invitation', align: 'center', width: 100 },
  { id: 'participation', label: 'Participation', align: 'center', width: 100 },
  { id: 'delete', label: 'Delete', align: 'center', width: 70 },
];

const defaultFilters = {
  name: '',
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;
  let data = [...inputData];
  const stabilizedThis = data.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  data = stabilizedThis.map((el) => el[0]);
  if (name) {
    data = data.filter(
      (row) =>
        (row.WorkShopName || '').toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  return data;
}

// ----------------------------------------------------------------------

export default function WorkshopMitigationListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();

  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const notFound = !dataFiltered.length;
  const denseHeight = table.dense ? 56 : 56 + 20;

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await Get('GetWorkshopInvitationList');
      const raw = res?.data?.ServiceRes ?? [];
      const decrypted = decryptRecursiveObjectKeys(raw);
      setTableData(Array.isArray(decrypted) ? decrypted : []);
    } catch (err) {
      console.error(err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    async (WorkshopInvitationMstID) => {
      try {
        await Delete(`DeleteWorkshopInvitation?WorkshopInvitationMstID=${WorkshopInvitationMstID}`);
        enqueueSnackbar('Deleted successfully');
        fetchList();
      } catch (err) {
        enqueueSnackbar(err?.message || 'Delete failed', { variant: 'error' });
      }
    },
    [enqueueSnackbar, fetchList]
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Card>
      <WorkshopMitigationTableToolbar filters={filters} onFilters={handleFilters} />

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                .map((row, index) => (
                  <WorkshopMitigationTableRow
                    key={row.WorkshopInvitationMstID ?? index}
                    row={row}
                    sno={table.page * table.rowsPerPage + index + 1}
                    onDeleteRow={() => handleDeleteRow(row.WorkshopInvitationMstID)}
                    onEditRow={() => router.push(paths.dashboard.RiskAnalysis.RiskMitigation.workshop.editInvitation(row.WorkshopInvitationMstID))}
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
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Card>
  );
}
