// Falls fetch in deiner Node.js-Umgebung nicht global ist, importiere es:
// import fetch from 'node-fetch';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const username = req.query.username;
  if (!username || !/^[a-zA-Z0-9_.-]{3,32}$/.test(username)) {
    res.status(400).json({ images: [], error: "Ungültiger Username." });
    return;
  }

  const url = `https://tellonym.me/${encodeURIComponent(username)}`;
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    if (!response.ok) {
      res.status(404).json({ images: [], error: "Profil konnte nicht geladen werden." });
      return;
    }
    const html = await response.text();
    // Bild-URLs extrahieren
    const regex = /<img[^>]+src=["']([^"']+user-profile-picture[^"']+)["'][^>]*>/gi;
    const images = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      let imgUrl = match[1];
      if (!imgUrl.startsWith("http")) {
        imgUrl = "https://tellonym.me" + imgUrl;
      }
      if (!images.includes(imgUrl)) images.push(imgUrl);
      if (images.length >= 3) break;
    }
    if (images.length === 0) {
      res.status(404).json({ images: [], error: "Keine Profilbilder gefunden." });
      return;
    }
    res.status(200).json({ images });
  } catch (err) {
    res.status(500).json({ images: [], error: "Serverfehler: " + err.message });
  }
} 