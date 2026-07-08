import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';

import Iconify from '../iconify';

// ----------------------------------------------------------------------

export default function UploadBox({ placeholder, error, disabled, sx, ...other }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    disabled,
    ...other,
  });

  const hasError = isDragReject || error;

  return (
    <Box
      {...getRootProps()}
      sx={{
        m: 0.5,
        width: 82,
        height: 40,
        flexShrink: 0,
        padding: '0px 5px',
        display: 'flex',
        borderRadius: 1,
        cursor: 'pointer',
        alignItems: 'center',
        color: 'text.disabled',
        justifyContent: 'center',
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        border: (theme) => `dashed 1px ${alpha(theme.palette.primary.main, 0.16)}`,
        color: 'primary.main',
        ...(isDragActive && {
          opacity: 0.72,
        }),
        ...(disabled && {
          opacity: 0.48,
          pointerEvents: 'none',
        }),
        ...(hasError && {
          color: 'error.main',
          borderColor: 'error.main',
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        }),
        '&:hover': {
          opacity: 0.72,
        },
        ...sx,
      }}
    >
      <input {...getInputProps()} />
      <Iconify icon="eva:cloud-upload-fill" width={28} />
      {placeholder}
    </Box>
  );
}

UploadBox.propTypes = {
  disabled: PropTypes.object,
  error: PropTypes.bool,
  placeholder: PropTypes.object,
  sx: PropTypes.object,
};
