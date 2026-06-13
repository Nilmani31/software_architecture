export default function AlertMessage({ type = "info", message }) {
  if (!message) return null;

  const styles = {
    success: "bg-green-100 border-green-400 text-green-800",
    error: "bg-red-100 border-red-400 text-red-800",
    info: "bg-blue-100 border-blue-400 text-blue-800",
  };

  return (
    <div className={`border-l-4 p-4 rounded-lg ${styles[type]}`}>
      {message}
    </div>
  );
}