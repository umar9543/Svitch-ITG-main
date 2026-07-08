'use client';
import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { OverviewAppView } from 'src/sections/overview/app/view';
import ScorecardDashboardView from 'src/sections/scorecard/view/scorecard-dashboard-view';

// ----------------------------------------------------------------------

// export const metadata = {
//   title: 'Dashboard: App',
// };

export default function HomePage() {
  return (
    <>
      <AuthGuard>
        <DashboardLayout>
          <ScorecardDashboardView />
        </DashboardLayout>
      </AuthGuard>
    </>
  );
}
