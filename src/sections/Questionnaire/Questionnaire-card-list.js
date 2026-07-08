import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import QuestionnaireCard from './Questionnaire-card';

// ----------------------------------------------------------------------

export default function QuestionnaireCardList({ Questionnaires }) {
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
      {Questionnaires.map((Questionnaire) => (
        <QuestionnaireCard key={Questionnaire.id} Questionnaire={Questionnaire} />
      ))}
    </Box>
  );
}

QuestionnaireCardList.propTypes = {
  Questionnaires: PropTypes.array,
};
