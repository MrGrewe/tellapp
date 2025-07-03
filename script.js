const form = document.getElementById('tellonym-form');
const imagesDiv = document.getElementById('images');

// HIER die URL zu deinem PHP-Backend eintragen:
const PHP_ENDPOINT = 'https://mein-php-host.tld/tellonym-fetcher.php';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  imagesDiv.innerHTML = '';
  const username = document.getElementById('username').value.trim();
  if (!username) return;

  imagesDiv.innerHTML = '<div>Lade Profilbilder...</div>';

  try {
    const res = await fetch(`${PHP_ENDPOINT}?username=${encodeURIComponent(username)}`);
    if (!res.ok) throw new Error('Fehler beim Laden der Daten.');
    const data = await res.json();
    if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
      imagesDiv.innerHTML = '<div>Keine Profilbilder gefunden.</div>';
      return;
    }
    imagesDiv.innerHTML = '';
    data.images.forEach((imgUrl, idx) => {
      const wrapper = document.createElement('div');
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = `Profilbild ${idx+1}`;
      img.className = 'profile-image';
      const download = document.createElement('a');
      download.href = imgUrl;
      download.download = `tellonym_${username}_${idx+1}.jpg`;
      download.className = 'download-btn';
      download.innerText = 'Download';
      wrapper.appendChild(img);
      wrapper.appendChild(document.createElement('br'));
      wrapper.appendChild(download);
      imagesDiv.appendChild(wrapper);
    });
  } catch (err) {
    imagesDiv.innerHTML = `<div style="color:#e00;">${err.message || 'Unbekannter Fehler.'}</div>`;
  }
}); 