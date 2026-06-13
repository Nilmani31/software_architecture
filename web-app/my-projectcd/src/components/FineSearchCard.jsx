import { useState } from "react";

export default function FineSearchCard({ onSearch, loading }) {
  const [referenceNo, setReferenceNo] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(referenceNo.trim(), categoryId.trim());
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Find Your Traffic Fine
      </h2>

      <p className="text-gray-500 mt-2">
        Enter the details shown on your traffic fine sheet.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block font-medium text-gray-700">
            Fine Reference Number
          </label>
          <input
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
            placeholder="Example: TF-2026-001"
            className="mt-2 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            This number is printed on your fine sheet.
          </p>
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Fine Category Identifier
          </label>
          <input
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="Example: SPEEDING"
            className="mt-2 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 disabled:bg-blue-300"
        >
          {loading ? "Searching..." : "Search Fine"}
        </button>
      </form>
    </div>
  );
}