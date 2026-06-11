import { useState } from "react";
import Header from "../components/Header";
import StepIndicator from "../components/StepIndicator";
import FineSearchCard from "../components/FineSearchCard";
import FineSummaryCard from "../components/FineSummaryCard";
import PaymentCard from "../components/PaymentCard";
import AlertMessage from "../components/AlertMessage";
import { getFineDetails, payFine } from "../api/fineApi";

export default function PayFinePage() {
  const [fine, setFine] = useState(null);
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (referenceNo, categoryId) => {
    if (!referenceNo || !categoryId) {
      setAlertType("error");
      setMessage("Please enter fine reference number and category identifier.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const data = await getFineDetails(referenceNo, categoryId);

      setFine(data);
      setStep(2);
      setAlertType("success");
      setMessage("Fine details found. Please review before payment.");
    } catch (error) {
      setFine(null);
      setStep(1);
      setAlertType("error");
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentData) => {
    try {
      setLoading(true);
      setMessage("");

      await payFine(paymentData);

      setFine(null);
      setStep(3);
      setAlertType("success");
      setMessage(
        "Payment successful. SMS notification has been sent to the traffic police officer."
      );
    } catch (error) {
      setAlertType("error");
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <StepIndicator step={step} />

        <AlertMessage type={alertType} message={message} />

        <div className="grid lg:grid-cols-2 gap-6">
          <FineSearchCard onSearch={handleSearch} loading={loading} />

          <div className="space-y-6">
            {fine ? (
              <>
                <FineSummaryCard fine={fine} />
                <PaymentCard
                  fine={fine}
                  onPay={handlePayment}
                  loading={loading}
                />
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="text-5xl mb-4">🚦</div>
                <h2 className="text-xl font-bold text-gray-800">
                  Ready to Pay Your Fine
                </h2>
                <p className="text-gray-500 mt-2">
                  Search your fine using the reference number and category
                  identifier to continue payment.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}