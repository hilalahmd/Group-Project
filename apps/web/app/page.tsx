import Link from 'next/link';
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold text-sm">
              T
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Taskio</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link href="/register">
              <Button variant="primary" className="rounded-full px-5">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center items-center text-center">
        <section className="max-w-3xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-red-600 mr-2"></span> Project management, refined.
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl leading-tight">
            Streamline your team&apos;s workflow.
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Manage projects, track tasks, and collaborate seamlessly with custom boards and clear timelines. No clutter. Just focus.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/register">
              <Button variant="primary" size="lg" className="rounded-full px-8 text-base">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
               <Button variant="outline" size="lg" className="rounded-full px-8 text-base font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-400 font-medium">
          <p>&copy; {new Date().getFullYear()} Taskio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
