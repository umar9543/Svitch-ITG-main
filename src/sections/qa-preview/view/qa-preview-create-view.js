'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import QaPreviewNewEditForm from '../qa-preview-new-edit-form';

// ----------------------------------------------------------------------

export default function QaPreviewCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <QaPreviewNewEditForm />
    </Container>
  );
}
