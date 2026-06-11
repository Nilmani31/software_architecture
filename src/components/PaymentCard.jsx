import { useState } from "react";

export default function PaymentCard({ fine, onPay, loading }) {
  const [form, setForm] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    driverPhone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onPay({
      referenceNo: fine.referenceNo,
      categoryId: fine.categoryId,
      amount: fine.amount,
      ...form,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Secure Payment
      </h2>

      <p className="text-gray-500 mt-2">
        Enter your payment details to complete the fine payment.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Card Holder Name"
          name="cardHolderName"
          value={form.cardHolderName}
          onChange={handleChange}
          placeholder="Rashmika Harshamal"
        />

        <Input
          label="Card Number"
          name="cardNumber"
          value={form.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expiry Date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
          />

          <Input
            label="CVV"
            name="cvv"
            value={form.cvv}
            onChange={handleChange}
            placeholder="123"
          />
        </div>

        <Input
          label="Driver Phone Number"
          name="driverPhone"
          value={form.driverPhone}
          onChange={handleChange}
          placeholder="0771234567"
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-green-300"
        >
          {loading ? "Processing Payment..." : `Pay Rs. ${fine.amount}.00`}
        </button>
      </form>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="mt-2 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
      />
    </div>
  );
}