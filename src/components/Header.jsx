export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-950 to-blue-700 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <p className="text-sm uppercase tracking-widest text-blue-200">
          Sri Lanka Police Department
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">
          Online Traffic Fine Payment Portal
        </h1>
        <p className="mt-3 text-blue-100 max-w-2xl">
          Pay your traffic fine securely using your fine reference number and
          category identifier.
        </p>
      </div>
    </header>
  );
}