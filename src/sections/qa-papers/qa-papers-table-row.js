import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// import QaPapersQuickEditForm from './qa-papers-quick-edit-form';

// ----------------------------------------------------------------------

// const formatDate = (dateString) => {
//   const date = new Date(dateString);

//   const day = date.getDate();
//   const month = date.getMonth() + 1; // Months are zero-based in JS
//   const year = date.getFullYear();

//   return `${day}/${month}/${year}`;
// };

export default function QaPapersTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { SurveyMarket, SurveyNo, Context, SurveyDateFrom, SurveyDateTo, PerformanceAreas } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{SurveyNo}</TableCell>
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
        <TableCell>{Context}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{SurveyDateFrom}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{SurveyDateTo}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', align: 'right' }}>
          <Tooltip title="View Details" placement="top" arrow>
            <IconButton color="default" onClick={() => onEditRow()}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
          </Tooltip>

          {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </TableCell>
      </TableRow>

      {/* <QaPapersQuickEditForm currentKpi={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

QaPapersTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
