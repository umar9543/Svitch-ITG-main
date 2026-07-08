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

import BasicRatingQuickEditForm from './BasicRating-quick-edit-form';
import { Box } from '@mui/system';
import { RHFTextField } from 'src/components/hook-form';
import { Stack, TextField } from '@mui/material';
import { getCountries } from 'src/utils/Countries';

// ----------------------------------------------------------------------

export default function BasicRatingTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { CountryName, BasicName, LawDescription, CreationDate, RiskAnalysisBasicRateingMstID } =
    row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  const countries = getCountries();

  // const selectedCountry = country?.find((c) => c.Country_id === CountryID);

  const getFlagByCountryCode = (countryName) => {
    const country = countries?.find((c) => c.label.toLowerCase() === countryName?.toLowerCase());
    return country ? `flagpack:${country?.code?.toLowerCase()}` : '';
  };

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
        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{LawNo}</TableCell> */}
        <TableCell sx={{ whiteSpace: 'wrap' }}>{BasicName}</TableCell>
        <TableCell sx={{ whiteSpace: '' }}>
          {' '}
          <Stack direction="row" alignItems="center">
            <Iconify
              icon={getFlagByCountryCode(CountryName)}
              sx={{ borderRadius: 0.65, border: '1px gray ', width: 28, mr: 1 }}
            />
            {CountryName}
          </Stack>
        </TableCell>{' '}
        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton
              color={quickEdit.value ? 'inherit' : 'default'}
              // onClick={() => {
              //   onEditRow();
              //   popover.onClose();
              // }}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
        {/* <TableCell sx={{ whiteSpace: 'wrap' }}>{LawDescription}</TableCell> */}
        {/* <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>1</TableCell>

        <TableCell sx={{ px: 1, whiteSpace: 'nowrap', textAlign: 'center' }}>
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

      <BasicRatingQuickEditForm
        currentBasicRating={row}
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

BasicRatingTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
