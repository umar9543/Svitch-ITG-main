'use client';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
// import { QuestionnaireListView } from '../../../../sections/Questionnaire/view';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="amfori Report "
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
            { name: 'amfori Report' },
            // { name: 'List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card sx={{ p: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Rating</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Risk Factor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>A</TableCell>
                  <TableCell sx={{ textAlign: 'center', color: 'green' }}>0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>B</TableCell>
                  <TableCell sx={{ textAlign: 'center', color: 'green' }}>1</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>C</TableCell>
                  <TableCell sx={{ textAlign: 'center', color: 'green' }}>2</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4</TableCell>
                  <TableCell>D</TableCell>
                  <TableCell sx={{ textAlign: 'center', color: 'red' }}>3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>5</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>E</TableCell>
                  <TableCell sx={{ textAlign: 'center', color: 'red' }}>4</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>6</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>F</TableCell>
                  <TableCell sx={{ textAlign: 'center', color: 'red' }}>5</TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell>7</TableCell>
                  <TableCell>G</TableCell>
                  <TableCell sx={{ textAlign: 'center', color: 'red' }}>6</TableCell>
                </TableRow> */}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>
    </>
  );
};

export default page;
