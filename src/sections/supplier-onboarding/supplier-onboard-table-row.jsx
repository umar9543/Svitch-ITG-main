import PropTypes from 'prop-types';
import { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { fDate, fTime } from 'src/utils/format-time';

import EmailFormDialog from './supplier-onboard-email-dialog';
import { encrypt } from 'src/api/encryption';
import { encryptLink } from 'src/utils/LinkEncryption';

import { APP_URL } from 'src/config-global';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function SupplierOnboardTableRow({ row, selectedData, FetchUpdatedData, sno }) {
  const {
    isEmailSent = 'True',
    LastLoginDateFormat1,
    ReleaseDate,
    PartyType,
    CustomerName,
    Status,
    VenderName,
    SupplierID,
    OnBoardingDTLID,
    email,
  } = row;

  const { enqueueSnackbar } = useSnackbar();

  function formatDate(dateString) {
    // Create a new Date object from the input string
    const date = new Date(dateString);

    // Extract the day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const year = date.getFullYear();

    // Return the formatted date as dd.mm.yyyy
    return `${day}-${month}-${year}`;
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const VID = encryptLink(SupplierID);
  const BID = encryptLink(OnBoardingDTLID);
  const linkToCopy = `${APP_URL}SupplierOnboard/VID=${VID}&OnBoardingDTLID=${BID}`; // Your specific link

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => {
        enqueueSnackbar(
          'Link copied to clipboard',
          {
            variant: 'success',
          },
          {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          }
        );
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
      });
  };

  return (
    <>
      <TableRow hover>
        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{sno}</TableCell> */}

        {/* <TableCell sx={{ whiteSpace: 'wrap' }}>{CustomerName}</TableCell> */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{VenderName}</TableCell>
        <TableCell sx={{ whiteSpace: 'wrap' }}>{PartyType}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(ReleaseDate)}</TableCell>

        <TableCell>
          <Label variant="soft" color={Status === 'Not Invited' ? 'default' : 'success'}>
            {Status === 'Not Invited'
              ? 'Not Invited'
              : Status === 'Responded'
                ? 'Responded'
                : 'Invited'}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {/* {LastLoginDateFormat1 === '1/1/1900 12:00:00 AM' ? (
            <Label variant="soft" color="error">
              Never logged in
            </Label>
          ) : (
            <ListItemText
              primary={fDate(LastLoginDateFormat1)}
              secondary={fTime(LastLoginDateFormat1)}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
              }}
            />
          )} */}
          <IconButton onClick={() => handleCopyLink()}>
            <Iconify icon="mdi:link-variant" />
          </IconButton>
        </TableCell>

        <TableCell align="center">
          <IconButton onClick={handleDialogOpen}>
            <Iconify icon="mdi:email-edit-outline" />
          </IconButton>
        </TableCell>
      </TableRow>

      <EmailFormDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        supplierData={row}
        linkToCopy={linkToCopy}
        FetchNewData={() => {
          FetchUpdatedData();
        }}
      />
    </>
  );
}
SupplierOnboardTableRow.propTypes = {
  row: PropTypes.object,
  selectedData: PropTypes.object,
  FetchUpdatedData: PropTypes.func,
};
