import ScorecardDetailView from 'src/sections/scorecard/view/scorecard-detail-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Scorecard Detail',
};

export default function ScorecardDetailPage({ params }) {
  const { id } = params;

  return <ScorecardDetailView id={id} />;
}
