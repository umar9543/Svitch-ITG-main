'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _userCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import PreAuditReportCardList from '../PreAuditReport-card-list';

// ----------------------------------------------------------------------

export default function PreAuditReportCardsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Pre Audit Report Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Audit Database', href: paths.dashboard.audit.root },
          { name: 'Pre Audit Report', href: paths.dashboard.audit.PreAuditReport },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={'#'}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Pre Audit Report
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PreAuditReportCardList PreAuditReports={_userCards} />
    </Container>
  );
}
