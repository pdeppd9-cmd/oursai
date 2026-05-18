export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST만 허용됩니다." });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY가 설정되지 않았습니다." });
    }

    const { prompt, imageBase64, mimeType } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "prompt가 없습니다." });
    }

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: "이미지가 없습니다." });
    }

    const imageBuffer = Buffer.from(imageBase64, "base64");
    const file = new File([imageBuffer], "upload.png", { type: mimeType });

    const formData = new FormData();
    formData.append("model", "gpt-image-1");
    formData.append("image", file);
    formData.append("prompt", prompt);
    formData.append("size", "1024x1024");

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "이미지 생성 실패",
        detail: data,
      });
    }

    const b64 = data?.data?.[0]?.b64_json;

    if (!b64) {
      return res.status(500).json({
        error: "이미지 결과가 없습니다.",
        detail: data,
      });
    }

    return res.status(200).json({
      imageUrl: `data:image/png;base64,${b64}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "서버 오류",
      message: error.message,
    });
  }
}