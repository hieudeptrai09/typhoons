import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-100 px-4">
      <h1 className="mb-2 text-6xl font-bold text-gray-300">404</h1>
      <p className="mb-6 text-lg text-gray-500">Page not found</p>
      <Link
        href="/"
        className="rounded-full bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
