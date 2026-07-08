import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Checkbox, FormControlLabel, Link } from '@mui/material';

// ----------------------------------------------------------------------

export default function DetailTableRow({
  row,
  selected,
  handleQuestionSelect,
  selectedQuestions,
  selectedQuestionnaireMstIDs,
}) {
  const { Question, QuestionnaireMstID, Title } = row;
  const confirm = useBoolean();

  // Date In SQL format
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <TableRow hover selected={selectedQuestions.includes(QuestionnaireMstID)}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <FormControlLabel
            control={
              <Checkbox
                disabled={selectedQuestionnaireMstIDs?.length > 0}
                checked={selectedQuestions.includes(QuestionnaireMstID)}
                onChange={() => handleQuestionSelect(QuestionnaireMstID)}
              />
            }
            label=""
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{Title}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{Question}</TableCell>
      </TableRow>
    </>
  );
}

DetailTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  selectedQuestionnaireMstIDs: PropTypes.array,
};
