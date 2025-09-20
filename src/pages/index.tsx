import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Entrepreneur Shaadi - Connect Verified Founders</title>
        <meta name="description" content="A founder verification and matching platform using MCA data" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Entrepreneur Shaadi
                </h1>
              </div>
              <nav className="flex space-x-8">
                <Link href="/auth/login" className="text-gray-500 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Sign Up
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Connect with</span>
              <span className="block text-blue-600">Verified Founders</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              India's first platform that verifies founders through official MCA data. 
              Build trust, create meaningful connections, and find your perfect co-founder or business partner.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/auth/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                  Get Started
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link href="/browse" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  Browse Founders
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Built for Trust & Verification
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <span className="text-xl">🛡️</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">MCA Verification</p>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Verify founders using official Director Identification Numbers (DIN) and Company Identification Numbers (CIN).
                  </dd>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <span className="text-xl">🎯</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Smart Matching</p>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    AI-powered matching based on industry experience, company stage, and professional goals.
                  </dd>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <span className="text-xl">👥</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Rich Profiles</p>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Comprehensive founder profiles with verified company history, roles, and achievements.
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-400">
              © 2025 Entrepreneur Shaadi. Built with ❤️ for the entrepreneurial ecosystem in India.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}