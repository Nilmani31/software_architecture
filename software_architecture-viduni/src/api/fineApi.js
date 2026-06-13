const API_BASE_URL = "http://localhost:5000/api";

export async function getFineDetails(referenceNo, categoryId) {
  // The backend expects ref and categoryCode as query params for lookup:
  // GET /api/fines/lookup?ref=TF-XXX&categoryCode=OVS
  const response = await fetch(
    `${API_BASE_URL}/fines/lookup?ref=${encodeURIComponent(referenceNo)}&categoryCode=${encodeURIComponent(categoryId)}`
  );

  if (!response.ok) {
    throw new Error("Fine not found, expired, or already paid.");
  }

  const data = await response.json();
  
  // The backend returns { fine: { ... } }
  // We need to map it so the frontend components get the keys they expect directly:
  // Component expects: referenceNo, categoryId, categoryName, district, officerName, status, amount
  const rawFine = data.fine;
  if (!rawFine) {
    throw new Error("Invalid response format from server.");
  }

  return {
    referenceNo: rawFine.referenceNumber,
    categoryId: rawFine.category ? rawFine.category.categoryCode : "",
    categoryName: rawFine.category ? rawFine.category.name : "",
    district: rawFine.district || "",
    officerName: rawFine.officer ? rawFine.officer.name : "Unknown",
    status: rawFine.isPaid ? "Paid" : "Unpaid",
    amount: rawFine.category ? rawFine.category.amount : 0,
    isPaid: rawFine.isPaid
  };
}

export async function payFine(paymentData) {
  // Map payment screen data to what POST /api/payments/pay expects:
  // { referenceNumber, categoryCode, paymentMethod, cardNumber, cardExpiry, cardCVV, paymentChannel }
  const body = {
    referenceNumber: paymentData.referenceNo,
    categoryCode: paymentData.categoryId,
    paymentMethod: "CARD", // Since it is card payment in this screen
    cardNumber: paymentData.cardNumber,
    cardExpiry: paymentData.expiryDate,
    cardCVV: paymentData.cvv,
    paymentChannel: "WEB_PORTAL"
  };

  const response = await fetch(`${API_BASE_URL}/payments/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Payment could not be completed. Please try again.");
  }

  return response.json();
}