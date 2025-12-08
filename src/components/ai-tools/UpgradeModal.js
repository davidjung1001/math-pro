"use client";

export default function UpgradeModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Unlock This Feature</h2>
        <p className="mb-6">
          This tool is available only for logged-in users or Pro plan subscribers.
          Please log in or upgrade to access all AI tools.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={() => window.location.href = "/pricing"}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Upgrade / Login
          </button>
        </div>
      </div>
    </div>
  );
}
