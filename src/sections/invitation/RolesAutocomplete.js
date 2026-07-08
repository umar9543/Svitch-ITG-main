import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const roles = [
  'Administrator',
  'Editor',
  'Contributor',
  'Subscriber',
  // Add more roles as needed
];

function RolesAutocomplete({ label, placeholder, multiple, helperText }) {
  const [value, setValue] = useState(multiple ? [] : null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      options={roles}
      getOptionLabel={(option) => option}
      renderOption={(props, option) => (
        <li {...props} key={option}>
          {option}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          helperText={helperText}
          error={false}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // Disable autocomplete and autofill
          }}
        />
      )}
      multiple={multiple}
    />
  );
}

RolesAutocomplete.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  helperText: PropTypes.node,
};

export default RolesAutocomplete;
