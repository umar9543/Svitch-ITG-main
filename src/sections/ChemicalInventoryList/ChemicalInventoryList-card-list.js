import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import ChemicalInventoryListCard from './ChemicalInventoryList-card';

// ----------------------------------------------------------------------

export default function ChemicalInventoryListCardList({ ChemicalInventoryLists }) {
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
      {ChemicalInventoryLists.map((ChemicalInventoryList) => (
        <ChemicalInventoryListCard
          key={ChemicalInventoryList.id}
          ChemicalInventoryList={ChemicalInventoryList}
        />
      ))}
    </Box>
  );
}

ChemicalInventoryListCardList.propTypes = {
  ChemicalInventoryLists: PropTypes.array,
};
