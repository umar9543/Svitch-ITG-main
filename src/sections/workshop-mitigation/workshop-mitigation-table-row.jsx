'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { Paper, TableContainer } from '@mui/material';
import { getCountries } from 'src/utils/Countries';
import { Stack } from '@mui/system';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function WorkshopMitigationTableRow({
  row,
  sno,
  onDeleteRow,
  onEditRow,
  onParticipationRow,
}) {
  const confirm = useBoolean();
  const [open, setOpen] = useState(false);
  const countries = getCountries();
  const getFlagByCountryCode = (countryName) => {
    const country = countries?.find((c) => c.label.toLowerCase() === countryName?.toLowerCase());
    return country ? `flagpack:${country?.code?.toLowerCase()}` : '';
  };
  const { WorkshopInvitationMstID, WorkShopName, WorkShopDate, Suppliers = [], PerformanceAreas = [], TotalParticipants = 0 } = row;

  return (
    <>
      {/* Master row */}
      <TableRow hover sx={{ '& > *': { borderBottom: open ? 'unset' : undefined } }}>
        <TableCell sx={{ width: 20, maxWidth: 20, px: 1 }}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            <Iconify icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} />
          </IconButton>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{WorkShopName}</TableCell>
        <TableCell>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {PerformanceAreas?.length > 0
              ? PerformanceAreas.map((pa) => (
                <Chip
                  key={pa.PerformanceAreaID}
                  label={pa.PerformanceAreaName}
                  size="small"
                  variant="soft"
                  color="primary"
                />
              ))
              : '—'}
          </Stack>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {fDate(WorkShopDate) || '-'}
        </TableCell>

        <TableCell sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            <Chip label={Suppliers.length} size="small" color="primary" variant="soft" />
            <Tooltip title="Edit invitation">
              <IconButton
                component={RouterLink}
                href={paths.dashboard.RiskAnalysis.RiskMitigation.workshop.editInvitation(WorkshopInvitationMstID)}
                color="default"
                size="small"
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            <Chip label={TotalParticipants ?? 0} size="small" color="success" variant="soft" />
            <Tooltip title="View participation">
              <IconButton
                component={RouterLink}
                href={paths.dashboard.RiskAnalysis.RiskMitigation.workshop.participation(WorkshopInvitationMstID)}
                color="default"
                size="small"
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>

        <TableCell sx={{ px: 1, textAlign: 'center' }}>
          <Tooltip title="Delete">
            <IconButton color="error" size="small" onClick={confirm.onTrue}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      {/* Detail row — suppliers */}
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2, px: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Invited Suppliers ({Suppliers.length})
              </Typography>

              {Suppliers.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No suppliers invited yet.
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Supplier Name</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Participation</TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Suppliers.map((supplier, idx) => (
                        <TableRow key={supplier.SupplierID ?? idx}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{supplier.SupplierName || '-'}</TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center">
                              <Iconify
                                icon={getFlagByCountryCode(supplier?.CountryName)}
                                sx={{ borderRadius: 0.65, border: '1px gray ', width: 24, mr: 1 }}
                              />
                              {supplier.CountryName}
                            </Stack>
                          </TableCell>
                          <TableCell>{supplier.PhoneNumber || '-'}</TableCell>
                          <TableCell>{supplier.OnBoardingEmail || '-'}</TableCell>
                          <TableCell><Chip label={supplier.Participants || '-'} size="small" color={supplier.Participants > 0 ? "success" : "error"} variant="soft" /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete this workshop?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

WorkshopMitigationTableRow.propTypes = {
  row: PropTypes.object,
  sno: PropTypes.number,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onParticipationRow: PropTypes.func,
};
