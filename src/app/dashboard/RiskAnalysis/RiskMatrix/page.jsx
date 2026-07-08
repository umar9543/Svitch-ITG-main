'use client';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { Container } from '@mui/system';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';

const page = () => {
  const settings = useSettingsContext();
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Risk Matrix"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Risk Analysis', href: paths.dashboard.RiskAnalysis.root },
            { name: 'Risk Matrix' },
            // { name: 'List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card sx={{ p: 3 }}>
          <Scrollbar sx={{ my: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">LkSG</TableCell>
                    <TableCell align="left">amfori PAs</TableCell>
                    <TableCell align="left">SDGs</TableCell>
                    <TableCell align="left">GRI</TableCell>
                    <TableCell align="center">EU ESRS</TableCell>
                    <TableCell align="center">ESG</TableCell>
                    <TableCell align="center">Rask Factor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="left">2(2.1)Minimum age of work</TableCell>
                    <TableCell align="left">PA 8: No Child Labour</TableCell>
                    <TableCell align="left">8. Decent Work and economic growth</TableCell>
                    <TableCell align="left">
                      408-1 Operation and supplier at significant risk
                    </TableCell>
                    <TableCell align="left">ESRS 2 SBM-3 (b)</TableCell>
                    <TableCell align="left">Social</TableCell>
                    <TableCell align="center">
                      <TextField
                        placeholder="0-5"
                        variant="outlined"
                        sx={{ '& input': { textAlign: 'center' }, width: 100 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">2(2.1)Minimum age of work</TableCell>
                    <TableCell align="left">PA 8: No Child Labour</TableCell>
                    <TableCell align="left">8. Decent Work and economic growth</TableCell>
                    <TableCell align="left">
                      408-1 Operation and supplier at significant risk
                    </TableCell>
                    <TableCell align="left">ESRS 2 SBM-3 (b)</TableCell>
                    <TableCell align="left">Social</TableCell>
                    <TableCell align="center">
                      <TextField
                        placeholder="0-5"
                        variant="outlined"
                        sx={{ '& input': { textAlign: 'center' }, width: 100 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">2(2.1)Minimum age of work</TableCell>
                    <TableCell align="left">PA 8: No Child Labour</TableCell>
                    <TableCell align="left">8. Decent Work and economic growth</TableCell>
                    <TableCell align="left">
                      408-1 Operation and supplier at significant risk
                    </TableCell>
                    <TableCell align="left">ESRS 2 SBM-3 (b)</TableCell>
                    <TableCell align="left">Social</TableCell>
                    <TableCell align="center">
                      <TextField
                        placeholder="0-5"
                        variant="outlined"
                        sx={{ '& input': { textAlign: 'center' }, width: 100 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">2(2.1)Minimum age of work</TableCell>
                    <TableCell align="left">PA 8: No Child Labour</TableCell>
                    <TableCell align="left">8. Decent Work and economic growth</TableCell>
                    <TableCell align="left">
                      408-1 Operation and supplier at significant risk
                    </TableCell>
                    <TableCell align="left">ESRS 2 SBM-3 (b)</TableCell>
                    <TableCell align="left">Social</TableCell>
                    <TableCell align="center">
                      <TextField
                        placeholder="0-5"
                        variant="outlined"
                        sx={{ '& input': { textAlign: 'center' }, width: 100 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">2(2.1)Minimum age of work</TableCell>
                    <TableCell align="left">PA 8: No Child Labour</TableCell>
                    <TableCell align="left">8. Decent Work and economic growth</TableCell>
                    <TableCell align="left">
                      408-1 Operation and supplier at significant risk
                    </TableCell>
                    <TableCell align="left">ESRS 2 SBM-3 (b)</TableCell>
                    <TableCell align="left">Social</TableCell>
                    <TableCell align="center">
                      <TextField
                        placeholder="0-5"
                        variant="outlined"
                        sx={{ '& input': { textAlign: 'center' }, width: 100 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">2(2.1)Minimum age of work</TableCell>
                    <TableCell align="left">PA 8: No Child Labour</TableCell>
                    <TableCell align="left">8. Decent Work and economic growth</TableCell>
                    <TableCell align="left">
                      408-1 Operation and supplier at significant risk
                    </TableCell>
                    <TableCell align="left">ESRS 2 SBM-3 (b)</TableCell>
                    <TableCell align="left">Social</TableCell>
                    <TableCell align="center">
                      <TextField
                        placeholder="0-5"
                        variant="outlined"
                        sx={{ '& input': { textAlign: 'center' }, width: 100 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">2(2.1)Minimum age of work</TableCell>
                    <TableCell align="left">PA 8: No Child Labour</TableCell>
                    <TableCell align="left">8. Decent Work and economic growth</TableCell>
                    <TableCell align="left">
                      408-1 Operation and supplier at significant risk
                    </TableCell>
                    <TableCell align="left">ESRS 2 SBM-3 (b)</TableCell>
                    <TableCell align="left">Social</TableCell>
                    <TableCell align="center">
                      <TextField
                        placeholder="0-5"
                        variant="outlined"
                        sx={{ '& input': { textAlign: 'center' }, width: 100 }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
};

export default page;
