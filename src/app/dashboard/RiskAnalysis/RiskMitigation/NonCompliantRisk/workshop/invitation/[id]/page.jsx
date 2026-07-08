'use client';

import { useParams } from 'src/routes/hooks';
import { useCallback, useEffect, useState } from 'react';
import { Get } from 'src/utils/AxiosHelper';
import { decryptRecursiveObjectKeys } from 'src/utils/getDecryption';
import { WorkshopInvitationCreateView } from 'src/sections/workshop-mitigation/view';
import { LoadingScreen } from 'src/components/loading-screen';

export default function WorkshopInvitationEditPage() {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkshop = useCallback(async () => {
    if (!id) return;
    try {
      const res = await Get(`GetWorkshopInvitationByID?WorkshopInvitationMstID=${id}`);
      const raw = res?.data?.ServiceRes ?? [];
      const decrypted = decryptRecursiveObjectKeys(raw);
      setWorkshop(Array.isArray(decrypted) ? decrypted[0] : decrypted);
    } catch (e) {
      console.error('Error fetching workshop invitation', e);
      setWorkshop(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkshop();
  }, [fetchWorkshop]);

  if (loading) return <LoadingScreen />;

  return <WorkshopInvitationCreateView workshopId={id} currentWorkshop={workshop} />;
}
