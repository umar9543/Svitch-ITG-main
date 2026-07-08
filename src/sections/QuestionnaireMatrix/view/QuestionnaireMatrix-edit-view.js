'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import QuestionnaireMatrixNewEditForm from '../QuestionnaireMatrix-new-edit-form';

// ----------------------------------------------------------------------

export default function QuestionnaireMatrixEditView({ id }) {
  const settings = useSettingsContext();

  const currentQuestionnaireMatrix = _userList.find((user) => user.id === id);

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
            name: 'QuestionnaireMatrix',
            href: paths.dashboard.QuestionnaireMatrix.root,
          },
          { name: currentQuestionnaireMatrix?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <QuestionnaireMatrixNewEditForm currentQuestionnaireMatrix={currentQuestionnaireMatrix} />
    </Container>
  );
}

QuestionnaireMatrixEditView.propTypes = {
  id: PropTypes.string,
};
