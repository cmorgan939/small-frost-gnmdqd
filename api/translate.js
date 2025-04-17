export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, deepLKey } = req.body;

  try {
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `DeepL-Auth-Key ${deepLKey}`,
      },
      body: new URLSearchParams({
        text,
        target_lang: "ES",
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(errorDetails);
    }

    const data = await response.json();
    res.status(200).json({ translation: data.translations[0].text });
  } catch (err) {
    res.status(500).json({ error: "Translation failed", details: err.message });
  }
}
