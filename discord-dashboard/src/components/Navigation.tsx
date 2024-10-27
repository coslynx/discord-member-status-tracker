import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Navigation = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Loading...</p>
    </div>;
  }

  if (status === 'unauthenticated') {
    return <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">
        Please log in to access the dashboard.
      </p>
    </div>;
  }

  return (
    <nav className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Discord Member Status Dashboard
        </h1>
      </div>
      <div className="flex items-center">
        <ul className="flex space-x-4">
          <li>
            <Link href="/">
              <a className="text-gray-600 hover:text-gray-800">Servers</a>
            </Link>
          </li>
          {session?.user && (
            <li>
              <span className="text-gray-600 hover:text-gray-800">
                {session.user.name}
              </span>
            </li>
          )}
          {session?.user && (
            <li>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700"
                onClick={() => router.push('/login')}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;