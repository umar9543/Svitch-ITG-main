'use client';
import { Box, Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import UserNewEditForm from '../../../../sections/user/view/user-create-view';
import { decrypt } from 'src/api/encryption';
// import CustomerForm from 'src/components/CustomerForm';

const page = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* <CustomBreadcrumbs
          heading="Add a new Customer"
          links={[
            {
              name: 'Dashboard',
              // href: paths.dashboard.root,
            },
            {
              name: 'Customer Database',
              href: paths.dashboard.job.root,
            },
            { name: 'Add Customer' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        /> */}
        <UserNewEditForm />
      </Container>
    </>
  );
};

export default page;
