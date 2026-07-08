import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import InvitationCard from './invitation-card';

// ----------------------------------------------------------------------

export default function InvitationCardList({ invitations }) {
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
      {invitations.map((invitation) => (
        <InvitationCard key={invitation.id} invitation={invitation} />
      ))}
    </Box>
  );
}

InvitationCardList.propTypes = {
  invitations: PropTypes.array,
};
