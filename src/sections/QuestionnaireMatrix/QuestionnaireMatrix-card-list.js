import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import QuestionnaireMatrixCard from './QuestionnaireMatrix-card';

// ----------------------------------------------------------------------

export default function QuestionnaireMatrixCardList({ QuestionnaireMatrixs }) {
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
      {QuestionnaireMatrixs.map((QuestionnaireMatrix) => (
        <QuestionnaireMatrixCard
          key={QuestionnaireMatrix.id}
          QuestionnaireMatrix={QuestionnaireMatrix}
        />
      ))}
    </Box>
  );
}

QuestionnaireMatrixCardList.propTypes = {
  QuestionnaireMatrixs: PropTypes.array,
};
