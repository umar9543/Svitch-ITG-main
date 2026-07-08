import PropTypes from 'prop-types';
import { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { fDate, fTime } from 'src/utils/format-time';

import EmailFormDialog from './survey-invite-email-dialog';
import { encrypt } from 'src/api/encryption';
import { encryptLink } from 'src/utils/LinkEncryption';

import { APP_URL } from 'src/config-global';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';
import { Tooltip } from '@mui/material';

// ----------------------------------------------------------------------

export default function SurveyInviteTableRow({ row, selectedData, FetchUpdatedData, sno }) {
  const {
    isEmailSent = 'True',
    Context,
    SupplierAssessmentMstID,
    VenderLibraryID,
    BestBefore,
    SurveyNo,
    CountryName,
    Status,
    VenderName,
    InvitationID,
  } = row;

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

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
  const VID = encryptLink(VenderLibraryID);
  const inviID = encryptLink(InvitationID);
  // console.log('surveyNo', SurveyNo);
  const encryptedSvNo = encryptLink(SurveyNo);
  const OTP = Math.floor(1000 + Math.random() * 9000);

  //create 72hr time expiry for OTP
  // const expiryDate = new Date();
  // expiryDate.setHours(expiryDate.getHours() + 72);
  const expiryDateISO = BestBefore.toISOString();
  const encryptedExpiryDate = encryptLink(expiryDateISO);

  const encryptedOTP = encryptLink(OTP.toString());
  const linkToCopy = `${APP_URL}SurveyForm/VID=${VID}&invd=${inviID}&O12P=${encryptedOTP}&svNo=${encryptedSvNo}&Xkp=${encryptedExpiryDate}`; // Your specific link
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const NavigateToResult = () => {
    router.push(paths.dashboard.RiskAnalysis.RiskMitigation.surveyResult(SupplierAssessmentMstID));
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
        <TableCell sx={{ whiteSpace: 'wrap' }}>{SurveyNo}</TableCell>
        <TableCell sx={{ whiteSpace: 'wrap' }}>{Context}</TableCell>
        <TableCell sx={{ whiteSpace: 'wrap' }}>{CountryName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(BestBefore)}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={Status === 'Invited' || Status === 'Responded' ? 'success' : 'default'}
          >
            {Status === 'Invited'
              ? 'Invited'
              : Status === 'Responded'
                ? 'Responded'
                : 'Not Invited'}
          </Label>
        </TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>
          
          <IconButton onClick={() => handleCopyLink()}>
            <Iconify icon="mdi:link-variant" />
          </IconButton>
        </TableCell> */}

        <TableCell align="center">
          <Tooltip title="Send Email">
            <IconButton onClick={handleDialogOpen}>
              <Iconify icon="mdi:email-edit-outline" />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell align="center">
          {SupplierAssessmentMstID === '0' ? (
            <Tooltip title="Survey not completed">
              <IconButton>
                <Iconify icon="uil:clipboard-blank" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Mark/View Survey Result">
              <IconButton onClick={NavigateToResult}>
                <Iconify icon="uil:clipboard-notes" />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>

      <EmailFormDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        supplierData={row}
        linkToCopy={linkToCopy}
        OTP={OTP}
        FetchNewData={() => {
          FetchUpdatedData();
        }}
      />
    </>
  );
}
SurveyInviteTableRow.propTypes = {
  row: PropTypes.object,
  selectedData: PropTypes.object,
  FetchUpdatedData: PropTypes.func,
};
