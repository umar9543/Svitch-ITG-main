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
import RolesAutocomplete from './RolesAutocomplete';
import OnBoardingCoversheetQuickEditForm from './OnBoardingCoversheet-quick-edit-form';
import { Box, Stack } from '@mui/system';
import { useRouter } from 'next/navigation';
import { getCountries } from 'src/utils/Countries';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

export default function OnBoardingCoversheetTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  country,
}) {
  const {
    name,
    avatarUrl,
    company,
    SupplierCode,
    City,
    CountryID,
    ShortName,
    UserID,
    Email,
    VenderLibraryID,
    VenderName,
  } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  const router = useRouter();

  const countries = getCountries();

  const selectedCountry = country?.find((c) => c.Country_id === CountryID);

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

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{SupplierCode}</TableCell> */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{VenderName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{City}</TableCell>
        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{company}</TableCell> */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Stack direction="row" alignItems="center">
            <Iconify
              icon={getFlagByCountryCode(selectedCountry?.CountryName)}
              sx={{ borderRadius: 0.65, border: '1px gray ', width: 28, mr: 1 }}
            />
            {selectedCountry?.CountryName}
          </Stack>
        </TableCell>
        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>demo@mail.com</TableCell> */}
        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          <Tooltip title="Score Card" placement="top" arrow>
            <Box
              onClick={() => {
                router.push(`/dashboard/Onboarding/coversheet/${VenderLibraryID}`);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <img src={`/assets/icons/navbar/stats.svg`} sx={{ width: 1, height: 1 }} />
            </Box>
          </Tooltip>
        </TableCell>

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

        {/* <TableCell
          align="right"
          sx={{ px: 1, whiteSpace: 'nowrap', display: 'flex', justifyContent: 'end', gap: 2 }}
        >
          <Tooltip title="Delete" placement="top" arrow>
            <Box onClick={() => {}} sx={{ color: 'error.main', cursor: 'pointer' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </Box>
          </Tooltip>
          <Tooltip title="Edit" placement="top" arrow>
            <Box
              onClick={() => {
                router.push(`/dashboard/OnBoardingCoversheet/${VenderLibraryID}`);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <Iconify icon="solar:pen-bold" />
            </Box>
          </Tooltip>
        </TableCell>*/}
      </TableRow>

      <OnBoardingCoversheetQuickEditForm
        currentSupplier={row}
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

OnBoardingCoversheetTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
