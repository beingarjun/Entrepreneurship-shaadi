import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  position: string;
  profileCompletion: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication and load user data
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const response = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('authToken');
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const profileCompletion = user.profileCompletion || 25;

  return (
    <>
      <Head>
        <title>Dashboard - Entrepreneur Shaadi</title>
        <meta name="description" content="Your Entrepreneur Shaadi dashboard" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  💼💕 Entrepreneur Shaadi
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user.firstName}!
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Profile Completion Banner */}
          <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Complete Your Profile</h2>
                <p className="text-blue-100">
                  A complete profile gets 3x more matches!
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{profileCompletion}%</div>
                <div className="text-sm text-blue-100">Complete</div>
              </div>
            </div>
            <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Summary */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Your Profile
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </dd>
                      <dd className="text-sm text-gray-500">
                        {user.position} at {user.companyName}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/profile/edit" className="font-medium text-blue-600 hover:text-blue-500">
                    Edit profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Matches */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">💕</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        New Matches
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        0
                      </dd>
                      <dd className="text-sm text-gray-500">
                        Complete profile for matches
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/matches" className="font-medium text-blue-600 hover:text-blue-500">
                    View all matches
                  </Link>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">💬</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Messages
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        0
                      </dd>
                      <dd className="text-sm text-gray-500">
                        No new messages
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/messages" className="font-medium text-blue-600 hover:text-blue-500">
                    View messages
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/profile/edit" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center">
                <div className="text-3xl mb-2">📝</div>
                <h4 className="font-medium text-gray-900">Complete Profile</h4>
                <p className="text-sm text-gray-500 mt-1">Add photos, preferences, and business details</p>
              </Link>

              <Link href="/search" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center">
                <div className="text-3xl mb-2">🔍</div>
                <h4 className="font-medium text-gray-900">Find Matches</h4>
                <p className="text-sm text-gray-500 mt-1">Search for compatible entrepreneurs</p>
              </Link>

              <Link href="/verification" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center">
                <div className="text-3xl mb-2">✅</div>
                <h4 className="font-medium text-gray-900">Get Verified</h4>
                <p className="text-sm text-gray-500 mt-1">Verify your business credentials</p>
              </Link>

              <Link href="/premium" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center">
                <div className="text-3xl mb-2">⭐</div>
                <h4 className="font-medium text-gray-900">Go Premium</h4>
                <p className="text-sm text-gray-500 mt-1">Unlock advanced features</p>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-4">🌟</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Welcome to Entrepreneur Shaadi!</h4>
                  <p className="text-sm">
                    Complete your profile to start connecting with verified entrepreneurs.
                  </p>
                  <Link href="/profile/edit" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                    Complete Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}