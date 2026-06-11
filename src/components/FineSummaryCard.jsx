export default function FineSummaryCard({ fine }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-700">
      <h2 className="text-2xl font-bold text-gray-800">Fine Summary</h2>

      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <Info label="Reference No" value={fine.referenceNo} />
        <Info label="Category ID" value={fine.categoryId} />
        <Info label="Category" value={fine.categoryName} />
        <Info label="District" value={fine.district} />
        <Info label="Officer" value={fine.officerName} />
        <Info label="Status" value={fine.status} />
      </div>

      <div className="mt-6 bg-red-50 rounded-xl p-4">
        <p className="text-sm text-red-600 font-medium">Amount to Pay</p>
        <p className="text-3xl font-bold text-red-700">
          Rs. {fine.amount}.00
        </p>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-400">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}