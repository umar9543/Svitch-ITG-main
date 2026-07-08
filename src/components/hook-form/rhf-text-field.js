import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export default function RHFTextField({ name, helperText, type, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          onWheel={(e) => e.target.blur()} // Prevent scroll value change
          type={type}
          // value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(event) => {
            const inputValue = event.target.value;
            if (type === 'number') {
              field.onChange(Number(inputValue));
            } else {
              // Allow only English letters and all special characters
              const filteredValue = inputValue.replace(/[^\x00-\x7F]/g, '');
              field.onChange(filteredValue);
            }
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}

RHFTextField.propTypes = {
  helperText: PropTypes.object,
  name: PropTypes.string,
  type: PropTypes.string,
};
