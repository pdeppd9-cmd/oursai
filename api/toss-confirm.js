export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { paymentKey, orderId, amount } = req.body;

    if (!paymentKey || !orderId || !amount) {
      return res.status(400).json({
        error: "paymentKey, orderId, amount required",
      });
    }

    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({
        error: "TOSS_SECRET_KEY missing",
      });
    }

    const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString("base64");

    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${encryptedSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      error: "payment confirm failed",
    });
  }
}