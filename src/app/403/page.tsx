import Link from "next/link"

export default function ForbiddenPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-6">
            <div className="text-center space-y-4 max-w-md bg-white p-12 rounded-2xl shadow-xl ring-1 ring-neutral-200">
                <h1 className="text-6xl font-black text-red-600">403</h1>
                <h2 className="text-2xl font-bold text-neutral-900 leading-tight">Access Denied</h2>
                <p className="text-neutral-500 font-medium pb-4">
                    You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-neutral-900 text-white font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-lg hover:shadow-xl active:scale-95"
                >
                    Return Home
                </Link>
            </div>
        </div>
    )
}
