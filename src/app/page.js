'use client';
import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

// export const metadata = {
//   title: 'Dashboard: App',
// };

export default function HomePage() {
  return (
    <>
      <AuthGuard>
        <DashboardLayout>
          <OverviewAppView />
        </DashboardLayout>
      </AuthGuard>
    </>
  );
}
