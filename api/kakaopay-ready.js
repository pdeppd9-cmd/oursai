export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const origin = req.headers.origin || "https://oursai.vercel.app";
    const secretKey = process.env.KAKAOPAY_SECRET_KEY;
    const cid = process.env.KAKAOPAY_CID || "TC0ONETIME";

    const partner_order_id = `order_${Date.now()}`;
    const partner_user_id = "woorisai_user";

    const response = await fetch(
      "https://open-api.kakaopay.com/online/v1/payment/ready",
      {
        method: "POST",
        headers: {
          Authorization: `SECRET_KEY ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cid,
          partner_order_id,
          partner_user_id,
          item_name: "우리사이 프리미엄 해석",
          quantity: 1,
          total_amount: 990,
          tax_free_amount: 0,
          approval_url: `${origin}/pay/success`,
          cancel_url: `${origin}/pay/cancel`,
          fail_url: `${origin}/pay/fail`,
        }),
      }
    );

    const data = await response.json();

    return res.status(200).json({
      ...data,
      partner_order_id,
      partner_user_id,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "payment ready failed" });
  }
}