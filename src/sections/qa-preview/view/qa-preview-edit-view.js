'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _kpiList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import QaPreviewNewEditForm from '../qa-preview-new-edit-form';

// ----------------------------------------------------------------------

export default function QaPreviewEditView({ id }) {
  const settings = useSettingsContext();

  const currentKpi = _kpiList.find((kpi) => kpi.id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Qa Preview',
            href: paths.dashboard.kpi.root,
          },
          { name: currentKpi?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <QaPreviewNewEditForm currentKpi={currentKpi} />
    </Container>
  );
}

QaPreviewEditView.propTypes = {
  id: PropTypes.string,
};
