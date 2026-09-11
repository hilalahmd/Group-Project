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
              href="/register"
              className="rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow hover:bg-indigo-700 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} FlowBoard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
