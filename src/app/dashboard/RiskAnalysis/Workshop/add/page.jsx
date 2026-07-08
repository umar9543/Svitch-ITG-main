'use client';
import { Button } from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import WorkshopNewEditForm from '../../../../../sections/Workshop/Workshop-new-edit-form';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Workshop "
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.Workshop.root },
            { name: 'Workshop', href: paths.dashboard.RiskAnalysis.Workshop.root },
            { name: 'Conduct Workshop' },
          ]}
          //   action={
          //     <Button
          //       component={RouterLink}
          //       href={'/dashboard/RiskAnalysis/Workshop/add'}
          //       variant="contained"
          //       color="primary"
          //       startIcon={<Iconify icon="mingcute:add-line" />}
          //     >
          //       Add Law
          //     </Button>
          //   }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <WorkshopNewEditForm />
      </Container>
    </>
  );
};

export default page;
