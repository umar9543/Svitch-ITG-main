'use client';
import { Container } from '@mui/system';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { Button, Card, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Scrollbar from 'src/components/scrollbar';

const page = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Supplier Database"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Supplier Database', href: paths.dashboard.customerDatabase.root },
            { name: 'Conrad Score Card' },
          ]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     href={'/dashboard/supplier/add-supplier'}
          //     variant="contained"
          //     color="primary"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     New Supplier
          //   </Button>
          // }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <Scrollbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>No. Employee</TableCell>
                  <TableCell>
                    <TableRow>Over 500</TableRow>
                    <TableRow>Over 300</TableRow>
                    <TableRow>Over 100</TableRow>
                    <TableRow>Under 100</TableRow>
                  </TableCell>
                  <TableCell>
                    <TableRow>20</TableRow>
                    <TableRow>15</TableRow>
                    <TableRow>10</TableRow>
                    <TableRow>5</TableRow>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>% of Export Business</TableCell>
                  <TableCell>
                    <TableRow>100%</TableRow>
                    <TableRow>Above 75%</TableRow>
                    <TableRow>Above 50%</TableRow>
                    <TableRow>Below 50%</TableRow>
                  </TableCell>
                  <TableCell>
                    <TableRow>20</TableRow>
                    <TableRow>15</TableRow>
                    <TableRow>10</TableRow>
                    <TableRow>0</TableRow>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Experience in Business Type</TableCell>
                  <TableCell>
                    <TableRow>Distribustion</TableRow>
                    <TableRow>Wholesale</TableRow>
                    <TableRow>Importer</TableRow>
                  </TableCell>
                  <TableCell>
                    <TableRow>5</TableRow>
                    <TableRow>5</TableRow>
                    <TableRow>5</TableRow>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Shipping Terms</TableCell>
                  <TableCell>
                    <TableRow>FOB</TableRow>
                    <TableRow>FCA</TableRow>
                    <TableRow>Ex-Factory / Local Delievery</TableRow>
                  </TableCell>
                  <TableCell>
                    <TableRow>20</TableRow>
                    <TableRow>10</TableRow>
                    <TableRow>0</TableRow>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Planned Annual Conrad Turnover (USD)</TableCell>
                  <TableCell>
                    <TableRow>Over 200,000 USD</TableRow>
                    <TableRow>Over 150,000 USD</TableRow>
                    <TableRow>Over 100,000 USD</TableRow>
                    <TableRow>Under 50,000 USD</TableRow>
                  </TableCell>
                  <TableCell>
                    <TableRow>20</TableRow>
                    <TableRow>15</TableRow>
                    <TableRow>10</TableRow>
                    <TableRow>5</TableRow>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Business Type</TableCell>
                  <TableCell>
                    <TableRow>Manufacturer</TableRow>
                    <TableRow>Trader</TableRow>
                  </TableCell>
                  <TableCell>
                    <TableRow>20</TableRow>
                    <TableRow>10</TableRow>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Years in Business</TableCell>
                  <TableCell>
                    <TableRow>Over 10</TableRow>
                    <TableRow>Over 5</TableRow>
                    <TableRow>Over 2</TableRow>
                    <TableRow>Over 1</TableRow>
                  </TableCell>
                  <TableCell>
                    <TableRow>20</TableRow>
                    <TableRow>15</TableRow>
                    <TableRow>10</TableRow>
                    <TableRow>5</TableRow>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Years in European Business</TableCell>
                  <TableCell>
                    <TableRow>Over 10</TableRow>
                    <TableRow>Over 5</TableRow>
                    <TableRow>Over 2</TableRow>
                    <TableRow>Over 1</TableRow>
                  </TableCell>
                  <TableCell>
                    <TableRow>20</TableRow>
                    <TableRow>15</TableRow>
                    <TableRow>10</TableRow>
                    <TableRow>5</TableRow>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>% of Business in Europe</TableCell>
                  <TableCell>
                    <TableRow>Over 50%</TableRow>
                    <TableRow>Over 25%</TableRow>
                    <TableRow>Over 10%</TableRow>
                    <TableRow>Under 10%</TableRow>
                  </TableCell>
                  <TableCell>
                    <TableRow>20</TableRow>
                    <TableRow>15</TableRow>
                    <TableRow>10</TableRow>
                    <TableRow>0</TableRow>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payment Terms</TableCell>
                  <TableCell>
                    <TableRow>T/T</TableRow>
                    <TableRow>L/C</TableRow>
                    <TableRow>Advanced Payment</TableRow>
                  </TableCell>
                  <TableCell>
                    <TableRow>20</TableRow>
                    <TableRow>10</TableRow>
                    <TableRow>0</TableRow>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bonus Agreement / Scale in USD</TableCell>
                  <TableCell>
                    <TableRow>Unconditional &gt;= 2%</TableRow>
                    <TableRow>Unconditional &gt;= 1%</TableRow>
                    <TableRow>Conditional</TableRow>
                  </TableCell>
                  <TableCell>
                    <TableRow>20</TableRow>
                    <TableRow>10</TableRow>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>List of Certifications and Patents</TableCell>
                  <TableCell>
                    <TableRow>Bonus Score</TableRow>
                  </TableCell>
                  <TableCell>
                    <TableRow>5 bonus per certificate</TableRow>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
};

export default page;
