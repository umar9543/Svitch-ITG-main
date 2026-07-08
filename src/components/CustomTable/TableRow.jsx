import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { useBoolean } from 'src/hooks/use-boolean';
import { RHFAutocomplete, RHFTextField } from '../hook-form';
import Iconify from '../iconify';
import { _roles } from 'src/_mock';

// ----------------------------------------------------------------------

export default function DetailTableRow({ row, selected, onDeleteRow }) {
  const { Name, Email, PhoneNo, DepartmentNo } = row;

  const confirm = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <RHFTextField name="contact" placeholder="+1 234567890..." />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <RHFAutocomplete
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
          />{' '}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <RHFTextField name="Name" placeholder="John..." />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <RHFTextField name="jobTitle" placeholder="Developer" />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <RHFTextField name="Mobile" placeholder="+1 234567890..." />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <RHFTextField name="Email" type="mail" placeholder="john@mail.com..." />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Iconify icon="solar:pen-bold" />
        </TableCell>
      </TableRow>
    </>
  );
}

DetailTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
