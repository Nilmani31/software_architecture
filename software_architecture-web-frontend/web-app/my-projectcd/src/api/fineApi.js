const API_BASE_URL = "http://localhost:8080/api/fines";

export async function getFineDetails(referenceNo, categoryId) {
  const response = await fetch(
    `${API_BASE_URL}/verify?referenceNo=${referenceNo}&categoryId=${categoryId}`
  );

  if (!response.ok) {
    throw new Error("Fine not found, expired, or already paid.");
  }

  return response.json();
}

export async function payFine(paymentData) {
  const response = await fetch(`${API_BASE_URL}/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error("Payment could not be completed. Please try again.");
  }

  return response.json();
}