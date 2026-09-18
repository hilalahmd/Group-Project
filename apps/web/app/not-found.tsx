import Link from "next/link";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <h1 className="text-9xl font-bold text-slate-200">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mt-4">Page not found</h2>
      <p className="text-slate-500 mt-2 mb-8 max-w-md">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/dashboard">
        <Button variant="primary" className="h-11 px-8 text-base font-semibold">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
