'use client';

import { useParams } from 'src/routes/hooks';
import { WorkshopParticipationView } from 'src/sections/workshop-mitigation/view';

export default function WorkshopParticipationPage() {
  const { slug } = useParams();

  return <WorkshopParticipationView workshopId={slug} />;
}
