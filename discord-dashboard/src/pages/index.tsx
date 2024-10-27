import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

import { useServerData } from '../hooks/useServerData';

import Navigation from '../components/Navigation';
import MemberList from '../components/MemberList';
import ServerStats from '../components/ServerStats';
import MemberActivity from '../components/MemberActivity';
import RoleManagement from '../components/RoleManagement';

const Index = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);

  const { serverData, isLoading } = useServerData(selectedServerId);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!serverData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No servers found.</p>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2">
            <MemberList
              serverId={selectedServerId}
              setSelectedServerId={setSelectedServerId}
            />
            {selectedServerId && (
              <>
                <ServerStats serverId={selectedServerId} />
                <MemberActivity serverId={selectedServerId} />
                <RoleManagement serverId={selectedServerId} />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Index;