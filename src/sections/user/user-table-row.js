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
import UserQuickEditForm from './user-quick-edit-form';
import { Box, Stack, border } from '@mui/system';
import { useRouter } from 'next/navigation';
import { getCountries } from 'src/utils/Countries';
import { useEffect, useState } from 'react';
import { Get } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';
import { RHFAutocomplete } from 'src/components/hook-form';
import { Autocomplete, TextField } from '@mui/material';

// ----------------------------------------------------------------------

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const {
    name,
    avatarUrl,
    company,
    role,
    status,
    email,
    LogoPath,
    CustomerName,
    Country,
    AttachmentName,
    CustomerID,
    UserID,
  } = row;

  const confirm = useBoolean();

  const router = useRouter();

  const quickEdit = useBoolean();

  const popover = usePopover();

  const countries = getCountries();

  // const [attachmentData, setAttachmentData] = useState([]);
  // const GetAttachmentDocList = async () => {
  //   const response = await Get(`GetCustomerRefAndAttachment?UserID=225&CustomerID=${CustomerID}`);
  //   const data = decryptObjectKeys(response.data.ServiceRes);
  //   setAttachmentData(data);
  //   console.log(data);
  // };

  // useEffect(() => {
  //   console.log('customerID', CustomerID);
  //   console.log('userID', UserID);
  //   GetAttachmentDocList();
  // }, []);

  // const selectedCountry = country?.find((c) => c.Country_id === CountryID);

  const getFlagByCountryCode = (countryName) => {
    const country = countries?.find((c) => c.label.toLowerCase() === countryName?.toLowerCase());
    return country ? `flagpack:${country?.code?.toLowerCase()}` : '';
  };
  const string = AttachmentName;
  const attachmentNames = string.split(',');

  // const options = attachmentData
  //   .map((option) => option.AttachmentType)
  //   .filter((value, index, self) => value && self.indexOf(value) === index);

  // getFlagByCountryCode(Country);

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={CustomerName} src={LogoPath} sx={{ mr: 2 }} />

          {/* <ListItemText
            primary={name}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          /> */}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{CustomerName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Stack direction="row" alignItems="center">
            <Iconify
              icon={getFlagByCountryCode(Country)}
              sx={{ borderRadius: 0.65, border: '1px gray ', width: 28, mr: 1 }}
            />{' '}
            {Country}
          </Stack>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {attachmentNames[0] !== '' ? (
            <Autocomplete
              name="Document"
              autoHighlight
              value={attachmentNames[0]}
              placeholder="Document"
              options={attachmentNames}
              renderInput={(params) => <TextField {...params} placeholder="Document" />}
            />
          ) : (
            <p style={{ paddingLeft: '10px' }}>No Document Found</p>
          )}
          {/* {AttachmentName} */}
        </TableCell>
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

        <TableCell
          align="right"
          sx={{ px: 1, whiteSpace: 'nowrap', display: 'flex', justifyContent: 'end', gap: 2 }}
        >
          {/* <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip> */}
          {/* <Tooltip title="Delete" placement="top" arrow>
            <Box onClick={() => {}} sx={{ color: 'error.main', cursor: 'pointer' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </Box>
          </Tooltip> */}
          <Tooltip title="Edit" placement="top" arrow>
            <Box
              onClick={() => {
                router.push(`/dashboard/customer-database/${CustomerID}`);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <Iconify icon="solar:pen-bold" />
            </Box>
          </Tooltip>
          {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </TableCell>
      </TableRow>

      <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

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

UserTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
