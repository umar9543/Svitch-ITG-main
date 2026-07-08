'use client';
import { Table, TableBody } from '@mui/material';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../table';
import DetailTableRow from './TableRow';
import { applyFilter } from 'src/layouts/common/searchbar/utils';
import { _userList } from 'src/_mock';
import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useSettingsContext } from '../settings';
import { useRouter } from 'next/navigation';
import { useBoolean } from 'src/hooks/use-boolean';
import { isEqual } from 'lodash';
import Scrollbar from '../scrollbar';

const TABLE_HEAD = [
  { id: 'Contact Type', label: 'Contact Type', width: 180 },
  { id: 'title', label: 'Title', width: 180 },
  { id: 'name', label: 'Name', width: 180 },
  { id: 'jobtitle', label: 'Job Title', width: 180 },
  { id: 'mobile', label: 'Mobile No.', width: 180 },
  { id: 'email', label: 'Email', width: 180 },
  // { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

const CustomTable = () => {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(_userList);

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
      router.push(paths.dashboard.user.edit(id));
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
      <Scrollbar>
        <Table
          size={table.dense ? 'small' : 'medium'}
          sx={{ minWidth: 960, mt: 4, border: 1, borderColor: '#f4f6f8', borderStyle: 'dotted' }}
        >
          <TableHeadCustom order={table.order} orderBy={table.orderBy} headLabel={TABLE_HEAD} />

          <TableBody>
            {/* {tableData.map((row, id) => ( */}
            <DetailTableRow
              key={tableData.id}
              row={tableData}
              onDeleteRow={() => {
                handleDeleteRow(row.id);
              }}
            />
            {/* ))}

          <TableEmptyRows
            height={denseHeight}
            emptyRows={emptyRows(table.page, table.rowsPerPage)}
          />

          <TableNoData notFound={notFound} /> */}
          </TableBody>
        </Table>
      </Scrollbar>
    </>
  );
};

export default CustomTable;
