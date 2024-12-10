import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function Notifications() {
  return (
    <div>
      <nav className="w-full bg-rawmats-secondary-700 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" passHref>
              <button className="text-white hover:bg-rawmats-primary-600 p-2 rounded-md">
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
            </Link>

            <div className="flex justify-center w-full">
              <h1 className="text-3xl text-white">
                <span className="font-bold">RAW</span>MATS
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-semibold text-gray-900">Notifications</h2>

        <div className="mt-4">
          <div className="bg-white p-4 rounded-md shadow-md mb-4">
            <p className="text-gray-700">notif here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
