'use client';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import FactorMappingNewEditForm from 'src/sections/FactorMapping/FactorMapping-new-edit-form';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Factor Mapping "
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.FactorMapping.root },
            { name: 'Factor Mapping', href: paths.dashboard.RiskAnalysis.FactorMapping.root },
            // { name: 'List' },
          ]}
          //   action={
          //     <Button
          //       component={RouterLink}
          //       href={'/dashboard/RiskAnalysis/FactorMapping/add'}
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

        <FactorMappingNewEditForm />
      </Container>
    </>
  );
};

export default page;
