import Link from 'next/link'; 

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 py-12">
      <div className="w-full max-w-sm space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] text-center">

        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            404
          </h1>
          <h2 className="text-sm font-medium text-gray-800">
            Page Not Found
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed px-2">
            The page you are looking for does not exist or has been moved. Please check the URL or return to the homepage.
          </p>
        </div>

        {/* زر العودة للصفحة الرئيسية */}
        <div className="space-y-4 pt-2">
          <Link
            href="/"
            className="flex w-full justify-center rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-gray-800 active:scale-[0.99]"
          >
            Return to Homepage
          </Link>
          
          <p className="text-xs text-gray-400">
            Need help?{" "}
            <a href="#" className="font-medium text-gray-800 hover:underline">
              Contact support
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}