import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import CertificateCard from './Certificate-card';

// ----------------------------------------------------------------------

export default function CertificateCardList({ Certificates }) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      {Certificates.map((Certificate) => (
        <CertificateCard key={Certificate.id} Certificate={Certificate} />
      ))}
    </Box>
  );
}

CertificateCardList.propTypes = {
  Certificates: PropTypes.array,
};
