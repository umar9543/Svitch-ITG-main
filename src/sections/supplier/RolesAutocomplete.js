import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const roles = [
  'Recommended',
  'Discouraged',
  'Unviewed',
  // Add more roles as needed
];

function RolesAutocomplete({ label, placeholder, multiple, helperText }) {
  const [value, setValue] = useState(multiple ? [] : null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getBackgroundColor = (option) => {
    if (option === 'Recommended') {
      return 'rgba(39, 245, 118, 0.22)';
    }
    if (option === 'Discouraged') {
      return 'rgba(245, 39, 39, 0.22)';
    }
    return 'transparent';
  };

  const getTextColor = (option) => {
    if (option === 'Recommended' || option === 'Discouraged') {
      return 'black';
    }
    return 'black';
  };

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      options={roles}
      getOptionLabel={(option) => option}
      renderOption={(props, option) => (
        <li {...props} key={option} style={{ backgroundColor: getBackgroundColor(option) }}>
          {option}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          // label={label}
          placeholder={placeholder}
          helperText={helperText}
          error={false}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // Disable autocomplete and autofill
          }}
          InputProps={{
            ...params.InputProps,
            style: {
              backgroundColor: getBackgroundColor(value),
              // color: getTextColor(value),
            },
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
