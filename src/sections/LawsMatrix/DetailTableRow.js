import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { useBoolean } from 'src/hooks/use-boolean';
import { _roles } from 'src/_mock';
import Iconify from 'src/components/iconify';
import { Button, IconButton, Tooltip } from '@mui/material';
import { ConfirmDialog } from 'src/components/custom-dialog';
import LawsMatrixQuickEditForm from './LawsMatrix-quick-edit-form';

// ----------------------------------------------------------------------

export default function DetailTableRow({ row, selected, onDeleteRow, onEditRow, onUpdateRow }) {
  const { InitiativeDatabaseID, LawDatabaseID } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {/* <RHFTextField name="contact" placeholder="+1 234567890..." /> */}
          {InitiativeDatabaseID?.Initiavtive}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {/* <RHFAutocomplete
            name="JobTitle"
            autoHighlight
            placeholder="Select Job Title"
            options={_roles.map((option) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
          /> */}
          {LawDatabaseID?.LawDescription}
        </TableCell>

        <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton
            color={quickEdit.value ? 'inherit' : 'default'}
            onClick={() => {
              //   onEditRow();
              //   quickEdit.onTrue();
            }}
          >
            <Iconify icon="solar:pen-bold" />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => {
              confirm.onTrue();
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />

      <LawsMatrixQuickEditForm
        currentLawsMatrix={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
        onUpdateRow={onUpdateRow}
      />
    </>
  );
}

DetailTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
