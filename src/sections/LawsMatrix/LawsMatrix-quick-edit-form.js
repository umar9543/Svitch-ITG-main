import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { countries } from 'src/assets/data';
import { USER_STATUS_OPTIONS } from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { Get } from 'src/utils/AxiosHelper';
import { decryptObjectKeys } from 'src/utils/getDecryption';

// ----------------------------------------------------------------------

export default function LawsMatrixQuickEditForm({ currentLawsMatrix, open, onClose, onUpdateRow }) {
  const { enqueueSnackbar } = useSnackbar();

  const [Initiative, setInitiative] = useState([]);
  const [Laws, setLaws] = useState([]);

  // Validation Schema
  const NewLawsMatrixSchema = Yup.object().shape({
    InitiativeDatabaseID: Yup.object().required('Initiative is required').shape({
      InitiativeDatabaseID: Yup.string().required(),
      Initiavtive: Yup.string().required(),
    }),
    LawDatabaseID: Yup.object().required('Law is required').shape({
      LawDatabaseID: Yup.string().required(),
      LawDescription: Yup.string().required(),
    }),
  });

  const GetInitiatives = async () => {
    try {
      const res = await Get(`GetInitiativeDatabase`);
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setInitiative(decryptedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GetInitiatives();
  }, []);

  const defaultValues = useMemo(
    () => ({
      InitiativeDatabaseID: currentLawsMatrix?.InitiativeDatabaseID || null,
      LawDatabaseID: currentLawsMatrix?.LawDatabaseID || null,
    }),
    [currentLawsMatrix]
  );

  const methods = useForm({
    resolver: yupResolver(NewLawsMatrixSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const GetLawDatabase = async () => {
    try {
      const res = await Get(
        `GetLawDatabase_RiskMatrix?InitiativeDatabaseID=${values?.InitiativeDatabaseID?.InitiativeDatabaseID}`
      );
      const decryptedData = decryptObjectKeys(res.data.ServiceRes);
      setLaws(decryptedData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLaw = async () => {
    await GetLawDatabase();
  };

  useEffect(() => {
    fetchLaw();
  }, [currentLawsMatrix?.InitiativeDatabaseID, values?.InitiativeDatabaseID]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Pass updated data back to parent component
      const updatedRow = {
        InitiativeDatabaseID: data.InitiativeDatabaseID,
        LawDatabaseID: data.LawDatabaseID,
      };

      onUpdateRow(updatedRow);

      enqueueSnackbar('Row updated successfully!', { variant: 'success' });
      reset(); // Reset form
      onClose(); // Close modal
    } catch (error) {
      console.error('Update failed:', error);
      enqueueSnackbar('Failed to update row.', { variant: 'error' });
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Controller
              name="InitiativeDatabaseID"
              control={control}
              render={({ field }) => (
                <RHFAutocomplete
                  {...field}
                  label="Initiative"
                  options={Initiative}
                  getOptionLabel={(option) => option?.Initiavtive || ''}
                  isOptionEqualToValue={(option, value) =>
                    option?.InitiativeDatabaseID === value?.InitiativeDatabaseID
                  }
                  value={field.value}
                  onChange={(event, value) => {
                    setValue('InitiativeDatabaseID', value);
                    setValue('LawDatabaseID', null); // Clear Law when Initiative changes
                    fetchLaw();
                  }}
                />
              )}
            />

            <Controller
              name="LawDatabaseID"
              control={control}
              render={({ field }) => (
                <RHFAutocomplete
                  {...field}
                  label="Law"
                  options={Laws}
                  getOptionLabel={(option) => option?.LawDescription || ''}
                  isOptionEqualToValue={(option, value) =>
                    option?.LawDatabaseID === value?.LawDatabaseID
                  }
                  value={field.value}
                  onChange={(event, value) => setValue('LawDatabaseID', value)}
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

LawsMatrixQuickEditForm.propTypes = {
  currentLawsMatrix: PropTypes.shape({
    InitiativeDatabaseID: PropTypes.shape({
      InitiativeDatabaseID: PropTypes.string.isRequired,
      Initiavtive: PropTypes.string.isRequired,
    }),
    LawDatabaseID: PropTypes.shape({
      LawDatabaseID: PropTypes.string.isRequired,
      LawDescription: PropTypes.string.isRequired,
    }),
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateRow: PropTypes.func.isRequired,
};
