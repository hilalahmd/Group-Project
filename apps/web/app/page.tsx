import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-indigo-600">FlowBoard</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/boards"
              className="text-sm font-semibold text-white bg-black px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors shadow-sm"
            >
              📋 Boards & Templates
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center items-center text-center">
        <section className="max-w-3xl space-y-6">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            Project Management Made Simple
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Streamline your team&apos;s workflow with FlowBoard
          </h2>
          <p className="text-lg text-slate-600">
            Manage projects, track tasks, and collaborate seamlessly with custom boards and clear timelines.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/boards"
              className="rounded-lg bg-black px-6 py-3 text-base font-bold text-white shadow-lg hover:bg-zinc-800 transition-all flex items-center gap-2"
            >
              📋 Open Boards & Templates Hub
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow hover:bg-indigo-700 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </section>
      </main>

    <section className="py-16 px-4">
  <div className="text-center max-w-2xl mx-auto">
    {/* Heading with Taskio */}
    <h1 className="text-3xl font-semibold text-gray-800 mb-6">
      Get started with <span className="text-gray-900 font-bold">Taskio</span> today
    </h1>

    {/* Form Container */}
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm max-w-md mx-auto">
      <input 
        type="email" 
        placeholder="Enter your email" 
        className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent placeholder-gray-400"
        required
      />
      
      <button 
        type="submit" 
        className="w-full sm:w-auto px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
        Subscribe
      </button>
    </div>
  </div>
</section>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} FlowBoard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
