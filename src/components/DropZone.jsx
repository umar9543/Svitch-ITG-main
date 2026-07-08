import { useCallback } from 'react';
// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
// DROPZONE
import { useDropzone } from 'react-dropzone';
import { Typography } from '@mui/material';
// LOCAL CUSTOM COMPONENT
// import { H5, Small } from "./Typography";

// ========================================================
// interface Props {
//   title?: string;
//   imageSize?: string;
//   name?: string;
//   onChange: (files: File[]) => void;
//   dropZoneBorderColor: string;
// }
// ========================================================

export default function DropZone({
  onChange,
  title = 'Drop image',
  imageSize = 'Accepts images only',
  name,
  dropZoneBorderColor,
}) {
  const onDrop = useCallback((acceptedFiles) => onChange(acceptedFiles), [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // maxFiles: 10,
    multiple: false,
    accept: { 'image/*': ['.png', '.gif', '.jpeg', '.jpg'] },
  });

  return (
    <Box
      py={4}
      px={{ md: 10, xs: 4 }}
      display="flex"
      justifyContent="center"
      minHeight="200px"
      alignItems="center"
      borderRadius="8px"
      border={`1.5px dashed ${dropZoneBorderColor}`} // Apply dynamic border color here
      flexDirection="column"
      textAlign="center"
      bgcolor={isDragActive ? 'grey.200' : 'grey.100'}
      sx={{ transition: 'all 250ms ease-in-out', outline: 'none' }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      {/* <H5 mb={1} color={`${dropZoneBorderColor}`}>
        {title}
      </H5> */}

      {/* <Divider
        sx={{ "::before, ::after": { borderColor: "grey.300", width: 70 } }}
      >
        <Small color="text.disabled" px={1}>
          OR
        </Small>
      </Divider> */}
      <Typography color={`${dropZoneBorderColor}`} variant="h5">
        {title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: 70 }}>
        <Button
          type="button"
          variant="outlined"
          color="primary"
          sx={{ px: 4, my: 4 }}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          Upload new
        </Button>
      </Box>

      <Typography color="grey.600" variant="caption">
        {imageSize}
      </Typography>
    </Box>
  );
}
