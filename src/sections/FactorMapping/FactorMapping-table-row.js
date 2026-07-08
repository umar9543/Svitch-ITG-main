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

import FactorMappingQuickEditForm from './FactorMapping-quick-edit-form';

// ----------------------------------------------------------------------

export default function FactorMappingTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { LawNo, LawDescription, Notes, role, Initiavtive, email, phoneNumber } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        {/* <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} />

          <ListItemText
            primary={name}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell> */}

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{123}</TableCell> */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{Initiavtive}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{LawNo}</TableCell>
        <TableCell sx={{ whiteSpace: '' }}>{LawDescription}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{Notes}</TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{role}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>29-08-2024</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', bgcolor: '#B3FFB3' }}>Performed</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', textDecoration: 'underline' }}>Show Link</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', textDecoration: 'underline' }}>View</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', textDecoration: 'underline' }}>Copy</TableCell> */}
        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{company}</TableCell> */}

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <RolesAutocomplete
            label="Result"
            placeholder="Select a Result"
            multiple={false} // Change to true if you want multiple selections
            helperText=""
          />
        </TableCell> */}
        {/* <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'active' && 'success') ||
              (status === 'pending' && 'warning') ||
              (status === 'banned' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell> */}

        <TableCell sx={{ px: 1, whiteSpace: 'nowrap' }}>
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
        </TableCell>
        {/* <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Iconify icon="mdi:microsoft-excel" />
        </TableCell> */}
      </TableRow>

      <FactorMappingQuickEditForm
        currentFactorMapping={row}
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

FactorMappingTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
