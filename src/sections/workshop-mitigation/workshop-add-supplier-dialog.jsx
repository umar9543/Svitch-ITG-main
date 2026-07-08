'use client';

import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import { Get } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { getDecryptedUserData } from 'src/utils/getUser';
import TablePagination from '@mui/material/TablePagination';

// ----------------------------------------------------------------------

const TIMEZONES = [
  { value: '(GMT+8:00) Hong Kong SAR', label: '(GMT+8:00) Hong Kong SAR' },
  { value: '(GMT+0:00) UTC', label: '(GMT+0:00) UTC' },
  { value: '(GMT+5:30) India', label: '(GMT+5:30) India' },
  { value: '(GMT+1:00) Central Europe', label: '(GMT+1:00) Central Europe' },
];

export default function WorkshopAddSupplierDialog({
  open,
  onClose,
  selectedSuppliers = [],
  onAddSuppliers,
}) {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const countryIds = selectedCountries
    .map((c) => c.Country_id ?? c.countryId)
    .filter(Boolean)
    .join(',');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const userData = getDecryptedUserData();
        const userId = userData?.[0]?.UserID ?? '';
        const res = await Get(`GetCountry?UserID=${userId}`);
        const decrypted = decryptObjectKeys(res?.data?.ServiceRes ?? []);
        setCountries(Array.isArray(decrypted) ? decrypted : []);
      } catch (e) {
        setCountries([]);
      }
    };
    if (open) fetchCountries();
  }, [open]);

  const fetchSuppliers = useCallback(async () => {
    if (!countryIds) {
      setSupplierList([]);
      return;
    }
    try {
      setLoading(true);
      const res = await Get(`GetSupplierByMultiPleCountryID?CountryID=${countryIds}`);
      const decrypted = decryptObjectKeys(res?.data?.ServiceRes ?? []);
      const formatted = decrypted.map((s) => ({
        ...s,

        Contact: s.PhoneNumber,
        Email: s.OnBoardingEmail,
      }));
      setSupplierList(Array.isArray(formatted) ? formatted : []);
    } catch (err) {
      console.error(err);
      setSupplierList([]);
    } finally {
      setLoading(false);
    }
  }, [countryIds]);

  useEffect(() => {
    if (open && countryIds) fetchSuppliers();
  }, [open, countryIds, fetchSuppliers]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected((prev) => {
        const ids = new Set(prev.map((s) => s.VenderLibraryID));
        const toAdd = filteredSuppliers.filter((s) => !ids.has(s.VenderLibraryID));
        return [...prev, ...toAdd];
      });
    } else {
      const filteredIds = new Set(filteredSuppliers.map((s) => s.VenderLibraryID));
      setSelected((prev) => prev.filter((s) => !filteredIds.has(s.VenderLibraryID)));
    }
  };

  const handleSelectOne = (row) => {
    const exists = selected.find((s) => s.VenderLibraryID === row.VenderLibraryID);
    if (exists) {
      setSelected((prev) => prev.filter((s) => s.VenderLibraryID !== row.VenderLibraryID));
    } else {
      setSelected((prev) => [...prev, row]);
    }
  };

  const isSelected = (id) => selected.some((s) => s.VenderLibraryID === id);

  const handleAdd = () => {
    onAddSuppliers(selected);
    setSelected([]);
    onClose();
  };

  const handleClose = () => {
    setSelected([]);
    setSelectedCountries([]);
    setSearchQuery('');
    onClose();
  };

  const filteredSuppliers = supplierList.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (s.VenderName ?? '').toLowerCase().includes(q) ||
      (s.Contact ?? '').toLowerCase().includes(q) ||
      (s.Email ?? '').toLowerCase().includes(q)
    );
  });

  const slice = filteredSuppliers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Add Supplier
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Autocomplete
          multiple
          fullWidth
          limitTags={2}
          sx={{ my: 2 }}
          options={countries || []}
          getOptionLabel={(c) => c.CountryName ?? c.Country_name ?? c.countryName ?? ''}
          isOptionEqualToValue={(a, b) => (a.Country_id ?? a.countryId) === (b.Country_id ?? b.countryId)}
          value={selectedCountries}
          onChange={(_, newValue) => {
            setSelectedCountries(newValue || []);
            setPage(0);
          }}
          renderOption={(props, option) => {
            const countryId = option.Country_id ?? option.countryId;
            const isChecked = selectedCountries.some(
              (s) => (s.Country_id ?? s.countryId) === countryId
            );
            return (
              <li {...props} key={countryId}>
                <Checkbox size="small" disableRipple checked={isChecked} />
                {option.CountryName ?? option.Country_name ?? option.countryName ?? ''}
              </li>
            );
          }}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.Country_id ?? option.countryId}
                label={option.CountryName ?? option.Country_name ?? option.countryName ?? ''}
                size="small"
                variant="soft"
                color="primary"
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Country" placeholder="Select countries" />
          )}
        />
        <TextField
          fullWidth
          size="small"
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <TableContainer>
          <Scrollbar>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={filteredSuppliers.some((r) => isSelected(r.VenderLibraryID)) && !filteredSuppliers.every((r) => isSelected(r.VenderLibraryID))}
                      checked={filteredSuppliers.length > 0 && filteredSuppliers.every((r) => isSelected(r.VenderLibraryID))}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  {/* <TableCell>No.</TableCell> */}
                  <TableCell>Supplier Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slice.map((row, idx) => (
                  <TableRow key={row.VenderLibraryID} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(row.VenderLibraryID)}
                        onChange={() => handleSelectOne(row)}
                      />
                    </TableCell>
                    {/* <TableCell>{page * rowsPerPage + idx + 1}</TableCell> */}
                    <TableCell>{row.VenderName}</TableCell>
                    <TableCell>{row.Contact || '—'}</TableCell>
                    <TableCell>{row.Email || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredSuppliers.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleAdd} disabled={selected.length === 0}>
          Add Suppliers {selected.length > 0 ? `(${selected.length})` : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

WorkshopAddSupplierDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  selectedSuppliers: PropTypes.array,
  onAddSuppliers: PropTypes.func,
};
