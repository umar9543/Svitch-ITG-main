'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _customers, JOB_DETAILS_TABS, JOB_PUBLISH_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';

import CustomerDetailsToolbar from '../customer-details-toolbar';
import CustomerDetailsContent from '../customer-details-content';
import CustomerDetailsCandidates from '../customer-details-candidates';

// ----------------------------------------------------------------------

export default function CustomerDetailsView({ id }) {
  const settings = useSettingsContext();

  const currentCustomer = _customers.filter((customer) => customer.id === id)[0];

  const [publish, setPublish] = useState(currentCustomer?.publish);

  const [currentTab, setCurrentTab] = useState('content');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {JOB_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === 'candidates' ? (
              <Label variant="filled">{currentCustomer?.candidates.length}</Label>
            ) : (
              ''
            )
          }
        />
      ))}
    </Tabs>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomerDetailsToolbar
        backLink={paths.dashboard.customer.root}
        editLink={paths.dashboard.customer.edit(`${currentCustomer?.id}`)}
        liveLink="#"
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={JOB_PUBLISH_OPTIONS}
      />
      {renderTabs}

      {currentTab === 'content' && <CustomerDetailsContent customer={currentCustomer} />}

      {currentTab === 'candidates' && (
        <CustomerDetailsCandidates candidates={currentCustomer?.candidates} />
      )}
    </Container>
  );
}

CustomerDetailsView.propTypes = {
  id: PropTypes.string,
};
