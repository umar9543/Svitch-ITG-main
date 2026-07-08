import PropTypes from 'prop-types';
import { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import EmailFormDialog from './compliance-status-email-dialog';
import { encrypt } from 'src/api/encryption';
import { enqueueSnackbar } from 'notistack';
import { encryptLink } from 'src/utils/LinkEncryption';

import { APP_URL } from 'src/config-global';
import { LinearProgress, Link, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { getCountries } from 'src/utils/Countries';

// ----------------------------------------------------------------------

export default function CompliantStatusTableRow({ row, selectedData, FetchUpdatedData, sno }) {
  const {
    isEmailSent = 'True',
    VenderLibraryID,
    VenderName,
    CountryName,
    CertificateTo,
    FileName2,
    Status,
    ReminderStatus,
  } = row;

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

  const countries = getCountries();

  const getFlagByCountryCode = (countryName) => {
    const country = countries?.find((c) => c.label.toLowerCase() === countryName?.toLowerCase());
    return country ? `flagpack:${country?.code?.toLowerCase()}` : '';
  };

  const statusDays = Status.split(' ')[0];

  const [dialogOpen, setDialogOpen] = useState(false);
  const VID = encryptLink(VenderLibraryID);
  const OTP = Math.floor(1000 + Math.random() * 9000);

  const expiryDate = new Date();
  // Set the expiry date to 1 month from now
  expiryDate.setMonth(expiryDate.getMonth() + 1);
  const expiryDateISO = expiryDate.toISOString();
  const encryptedExpiryDate = encryptLink(expiryDateISO);

  const encryptedOTP = encryptLink(OTP.toString());
  const linkToCopy = `${APP_URL}UPct1f/VID=${VID}&O12P=${encryptedOTP}&Xkp=${encryptedExpiryDate}`; // Your specific link

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
        <TableCell>{VenderName}</TableCell>
        <TableCell sx={{ whiteSpace: 'wrap', textAlign: 'center' }}>
          <Stack direction="row" alignItems="center">
            <Iconify
              icon={getFlagByCountryCode(CountryName)}
              sx={{ borderRadius: 0.65, border: '1px gray ', width: 28, mr: 1 }}
            />
            {CountryName}
          </Stack>
        </TableCell>
        {/* <TableCell sx={{ whiteSpace: 'wrap', textAlign: 'center' }}>{Certificate}</TableCell> */}
        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {CertificateTo === 'Not Uploaded' ? '-' : formatDate(CertificateTo)}
        </TableCell>

        <TableCell>
          <Stack sx={{ typography: 'caption', color: 'text.secondary' }}>
            <LinearProgress
              value={statusDays > 90 || statusDays == 0 ? 100 : (statusDays / 90) * 100} // Assuming a year-based progress
              variant="determinate"
              color={
                statusDays === 'Expired'
                  ? 'error'
                  : statusDays === 'Not'
                    ? 'error'
                    : statusDays < 60
                      ? 'warning'
                      : 'success'
              }
              sx={{ mb: 1, height: 6, maxWidth: 80 }}
            />
            {Status}
          </Stack>
        </TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={
              (ReminderStatus == 'No Reminders' && 'default') ||
              (ReminderStatus == '1st Reminder' && 'info') ||
              (ReminderStatus == '2nd Reminder' && 'warning') ||
              'error'
            }
          >
            {ReminderStatus}
          </Label>
        </TableCell>
        <TableCell>
          {Status !== 'Not Uploaded' ? (
            <Link href={FileName2} target="_blank" rel="noopener noreferrer">
              <IconButton>
                <Iconify icon="uiw:file-pdf" width="26" height="26" />
              </IconButton>
            </Link>
          ) : (
            <IconButton>
              <Iconify icon="uiw:file-pdf" width="26" height="26" />
            </IconButton>
          )}
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
        expiryDateISO={expiryDateISO}
        OTP={OTP}
        FetchNewData={() => {
          FetchUpdatedData();
        }}
      />
    </>
  );
}
CompliantStatusTableRow.propTypes = {
  row: PropTypes.object,
  selectedData: PropTypes.object,
  FetchUpdatedData: PropTypes.func,
};
