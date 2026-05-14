export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const secretKey = process.env.KAKAOPAY_SECRET_KEY;
    const cid = process.env.KAKAOPAY_CID || "TC0ONETIME";

    const { tid, pg_token, partner_order_id, partner_user_id } = req.body;

    const response = await fetch(
      "https://open-api.kakaopay.com/online/v1/payment/approve",
      {
        method: "POST",
        headers: {
          Authorization: `SECRET_KEY ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cid,
          tid,
          pg_token,
          partner_order_id,
          partner_user_id,
        }),
      }
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "approve failed" });
  }
}