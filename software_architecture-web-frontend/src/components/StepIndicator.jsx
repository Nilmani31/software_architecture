export default function StepIndicator({ step }) {
  const steps = ["Search Fine", "Review Details", "Make Payment"];

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex justify-between gap-2">
      {steps.map((item, index) => {
        const active = step >= index + 1;

        return (
          <div key={item} className="flex-1 text-center">
            <div
              className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                active ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <p
              className={`mt-2 text-sm ${
                active ? "text-blue-800 font-semibold" : "text-gray-400"
              }`}
            >
              {item}
            </p>
          </div>
        );
      })}
    </div>
  );
}