import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import IndustryRatingCard from './IndustryRating-card';
import { useEffect } from 'react';
import { getDecryptedUserData } from 'src/utils/getUser';
import { useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function IndustryRatingCardList({ IndustryRatings }) {
  // const router = useRouter();
  // const [userID, setUserID] = useState(null);

  // // Fetch userID on client side using useEffect
  // useEffect(() => {
  //   const decryptedUserData = getDecryptedUserData();
  //   if (decryptedUserData && decryptedUserData[0] && decryptedUserData[0].UserID) {
  //     setUserID(decryptedUserData[0].UserID);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (userID.UserID != 1576) router.push(paths?.page403);
  // }, [router, userID]);

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
      {IndustryRatings.map((IndustryRating) => (
        <IndustryRatingCard key={IndustryRating.id} IndustryRating={IndustryRating} />
      ))}
    </Box>
  );
}

IndustryRatingCardList.propTypes = {
  IndustryRatings: PropTypes.array,
};
