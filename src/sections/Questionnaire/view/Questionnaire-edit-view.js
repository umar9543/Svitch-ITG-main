'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import QuestionnaireNewEditForm from '../Questionnaire-new-edit-form';

// ----------------------------------------------------------------------

export default function QuestionnaireEditView({ id }) {
  const settings = useSettingsContext();

  const currentQuestionnaire = _userList.find((user) => user.id === id);

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
            name: 'Questionnaire',
            href: paths.dashboard.Questionnaire.root,
          },
          { name: currentQuestionnaire?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <QuestionnaireNewEditForm currentQuestionnaire={currentQuestionnaire} />
    </Container>
  );
}

QuestionnaireEditView.propTypes = {
  id: PropTypes.string,
};
