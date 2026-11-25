import { provider } from "./_lib/llm.js";

export default function handler(_req, res) {
  const p = provider();
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ configured: Boolean(p), provider: p ? p.name : null, accessCode: Boolean(process.env.ACCESS_CODE) });
}
