'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { Get, Post } from 'src/utils/AxiosHelper';
import { decryptObjectKeys, decryptRecursiveObjectKeys } from 'src/utils/getDecryption';
import { encrypt } from 'src/api/encryption';
import { useSnackbar } from 'src/components/snackbar';
import { LoadingScreen } from 'src/components/loading-screen';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import sanitizeFileName from 'src/utils/sanitizeFileName';
import { fDate, fTime } from 'src/utils/format-time';

const formatTimeStr = (timeStr) => {
  if (!timeStr) return '';
  try {
    return fTime(new Date(`1970-01-01T${timeStr}`));
  } catch {
    return timeStr;
  }
};

// ----------------------------------------------------------------------

export default function WorkshopParticipationForm({ workshopId }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [workshop, setWorkshop] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [timeZones, setTimeZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileInputRefs = useRef({});

  const fetchData = useCallback(async () => {
    if (!workshopId) return;
    try {
      setLoading(true);

      const [workshopRes, attendanceRes, tzRes] = await Promise.all([
        Get(`GetWorkshopInvitationByID?WorkshopInvitationMstID=${workshopId}`),
        Get(`GetWorkshopAttendanceByID?WorkshopInvitationMstID=${workshopId}`),
        Get('GetTimeZones'),
      ]);

      const workshopRaw = workshopRes?.data?.ServiceRes ?? [];
      const workshopDecrypted = decryptRecursiveObjectKeys(workshopRaw);
      setWorkshop(Array.isArray(workshopDecrypted) ? workshopDecrypted[0] : workshopDecrypted);

      const tzDecrypted = decryptObjectKeys(tzRes?.data?.ServiceRes ?? []);
      setTimeZones(tzDecrypted);

      const attendanceRaw = attendanceRes?.data?.ServiceRes ?? [];
      const decrypted = decryptObjectKeys(attendanceRaw);

      const toBit = (val) => (val === '1' || val === 'true' || val === 'True' || val === 'Yes' ? '1' : '0');
      const suppliers = (Array.isArray(decrypted) ? decrypted : []).map((s) => ({
        SupplierID: s.SupplierID ?? '',
        SupplierName: s.SupplierName ?? '',
        CountryName: s.CountryName ?? '',
        IsRegistered: toBit(s.IsRegistered),
        IsAttended: toBit(s.IsAttended),
        Participants: s.Participants ?? '0',
        CertificateURL: s.CertificateURL ?? '',
        CertificateFile: null,
        CertificateFileName: '',
      }));
      setParticipants(suppliers);
    } catch (e) {
      console.error('Error loading workshop participation data', e);
      setWorkshop({});
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  }, [workshopId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateParticipant = (index, field, value) => {
    setParticipants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleFileSelect = (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const sanitized = sanitizeFileName(file.name);
    const renamedFile = new File([file], sanitized, { type: file.type });
    updateParticipant(index, 'CertificateFile', renamedFile);
    updateParticipant(index, 'CertificateFileName', sanitized);
  };

  const handleRemoveFile = (index) => {
    updateParticipant(index, 'CertificateFile', null);
    updateParticipant(index, 'CertificateFileName', '');
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = '';
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append('WorkshopInvitationMstID', encrypt(String(workshopId)));
      formData.append('SupplierCount', String(participants.length));

      participants.forEach((p, i) => {
        formData.append(`Suppliers[${i}].SupplierID`, encrypt(String(p.SupplierID)));
        formData.append(`Suppliers[${i}].IsRegistered`, encrypt(p.IsRegistered));
        formData.append(`Suppliers[${i}].IsAttended`, encrypt(p.IsAttended));
        formData.append(`Suppliers[${i}].Participants`, encrypt(String(p.Participants)));
        if (p.CertificateFile) {
          formData.append(`Suppliers[${i}].CertificateFile`, p.CertificateFile);
        }
      });

      await Post('SaveWorkshopAttendance', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      enqueueSnackbar('Attendance saved successfully', { variant: 'success' });
      router.push(paths.dashboard.RiskAnalysis.RiskMitigation.workshop.root);
    } catch (err) {
      console.error('Error saving attendance', err);
      enqueueSnackbar(err?.message || 'Save failed', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  const w = workshop || {};
  const matchedTz = timeZones.find((tz) => String(tz.TimeZoneID) === String(w.TimeZoneID));
  const timeZoneDisplay = matchedTz ? `${matchedTz.TimeZoneName} (${matchedTz.UTCOffset})` : '';

  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Card sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Workshop Information
          </Typography>
          <Box
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
          >
            <TextField label="Workshop Name" value={w.WorkShopName ?? ''} disabled fullWidth />
            <TextField label="Description" value={w.Description ?? ''} disabled fullWidth multiline />
            <TextField label="Date" value={fDate(w.WorkShopDate) ?? ''} disabled fullWidth />
            <TextField label="Time Zone" value={timeZoneDisplay} disabled fullWidth />
            <TextField label="Start Time" value={formatTimeStr(w.StartTime)} disabled fullWidth />
            <TextField label="End Time" value={formatTimeStr(w.EndTime)} disabled fullWidth />
            <TextField label="Invitation Link" value={w.InvitationLink ?? ''} disabled fullWidth sx={{ gridColumn: 'span 2' }} />
          </Box>
        </Card>
      </Grid>

      <Grid xs={12}>
        <Card sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Supplier Attendance
          </Typography>
          <TableContainer>
            <Scrollbar>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Supplier Name</TableCell>
                    <TableCell align="center">Registered</TableCell>
                    <TableCell align="center">Attended</TableCell>
                    <TableCell align="center">Participants</TableCell>
                    <TableCell>Certificate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {participants.map((row, index) => (
                    <TableRow key={row.SupplierID ?? index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{row.SupplierName}</Typography>
                          {row.CountryName && (
                            <Typography variant="caption" color="text.secondary">
                              {row.CountryName}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <RadioGroup
                          row
                          value={row.IsRegistered}
                          onChange={(e) => updateParticipant(index, 'IsRegistered', e.target.value)}
                          sx={{ justifyContent: 'center' }}
                        >
                          <FormControlLabel value="1" control={<Radio size="small" />} label="Yes" />
                          <FormControlLabel value="0" control={<Radio size="small" />} label="No" />
                        </RadioGroup>
                      </TableCell>
                      <TableCell align="center">
                        <RadioGroup
                          row
                          value={row.IsAttended}
                          onChange={(e) => updateParticipant(index, 'IsAttended', e.target.value)}
                          sx={{ justifyContent: 'center' }}
                        >
                          <FormControlLabel value="1" control={<Radio size="small" />} label="Yes" />
                          <FormControlLabel value="0" control={<Radio size="small" />} label="No" />
                        </RadioGroup>
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          inputProps={{ min: 0 }}
                          value={row.Participants}
                          onChange={(e) => updateParticipant(index, 'Participants', e.target.value)}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          ref={(el) => { fileInputRefs.current[index] = el; }}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileSelect(index, e)}
                        />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {row.CertificateURL && !row.CertificateFile && (
                            <Chip
                              label="View Certificate"
                              size="small"
                              component="a"
                              href={row.CertificateURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              clickable
                              color="success"
                              variant="soft"
                              icon={<Iconify icon="eva:external-link-fill" width={16} />}
                            />
                          )}

                          {row.CertificateFile ? (
                            <Chip
                              label={row.CertificateFileName}
                              size="small"
                              onDelete={() => handleRemoveFile(index)}
                              icon={<Iconify icon="eva:file-text-fill" width={16} />}
                              sx={{ maxWidth: 180 }}
                            />
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                              // color="primary"
                              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                              onClick={() => fileInputRefs.current[index]?.click()}
                            >
                              {row.CertificateURL ? 'Replace' : 'Upload'}
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {participants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          No suppliers found for this workshop
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
      </Grid>

      <Grid xs={12}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => router.push(paths.dashboard.RiskAnalysis.RiskMitigation.workshop.root)}
          >
            Cancel
          </Button>
          <LoadingButton variant="contained" color="primary"
            loading={saving} onClick={handleSave}>
            Save Attendance
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>
  );
}
