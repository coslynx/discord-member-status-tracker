import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

import { useServerData } from '../hooks/useServerData';
import { useMemberStatus } from '../hooks/useMemberStatus';
import { useMemberDetails } from '../hooks/useMemberDetails';

import Navigation from '../components/Navigation';
import MemberList from '../components/MemberList';
import MemberDetails from '../components/MemberDetails';
import ServerStats from '../components/ServerStats';
import MemberActivity from '../components/MemberActivity';
import RoleManagement from '../components/RoleManagement';

const Server = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { serverId } = router.query;

  const { serverData, isLoading } = useServerData(serverId as string);
  const { memberStatuses, isMemberStatusLoading } = useMemberStatus(
    serverId as string,
  );
  const { memberDetails, isMemberDetailsLoading } = useMemberDetails(
    serverId as string,
  );

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (isLoading || isMemberStatusLoading || isMemberDetailsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!serverData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Server not found.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Discord Member Status Dashboard - {serverData.name}</title>
      </Head>
      <main className="container mx-auto p-4">
        <Navigation />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2">
            <MemberList
              members={memberStatuses}
              selectedMemberId={selectedMemberId}
              setSelectedMemberId={setSelectedMemberId}
            />
            {selectedMemberId && (
              <MemberDetails
                member={memberDetails}
                serverId={serverId as string}
              />
            )}
          </div>
          <div className="col-span-1">
            <ServerStats serverData={serverData} />
            <MemberActivity serverId={serverId as string} />
            <RoleManagement serverId={serverId as string} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Server;