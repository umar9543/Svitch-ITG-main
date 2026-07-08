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

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import LawsMatrixQuickEditForm from './LawsMatrix-quick-edit-form';

// ----------------------------------------------------------------------

export default function LawsMatrixTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { PerformancAarea, Initiatives } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ fontWeight: 'bold' }}>{PerformancAarea}</TableCell>

        <TableCell style={{ whiteSpace: 'pre-wrap' }}>
          {Initiatives['LKSG']?.join('\n\n') || ''}
        </TableCell>
        <TableCell style={{ whiteSpace: 'pre-wrap' }}>
          {Initiatives['amfori PAs']?.join('\n\n') || ''}
        </TableCell>
        <TableCell style={{ whiteSpace: 'pre-wrap' }}>
          {Initiatives['SDGs']?.join('\n\n') || ''}
        </TableCell>
        <TableCell style={{ whiteSpace: 'pre-wrap' }}>
          {Initiatives['GRI']?.join('\n\n') || ''}
        </TableCell>
        <TableCell style={{ whiteSpace: 'pre-wrap' }}>
          {Initiatives['EU ESRS']?.join('\n\n') || ''}
        </TableCell>
        <TableCell style={{ whiteSpace: 'pre-wrap' }}>
          {Initiatives['ESG']?.join('\n\n') || ''}
        </TableCell>

        {/* <TableCell sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton
              color={quickEdit.value ? 'inherit' : 'default'}
              onClick={() => {
                onEditRow();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>  
          <Tooltip title="Delete" placement="top" arrow>
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </TableCell> */}
      </TableRow>

      <LawsMatrixQuickEditForm
        currentLawsMatrix={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
      />

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

LawsMatrixTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
