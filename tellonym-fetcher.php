<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

function error($msg) {
    echo json_encode(["images" => [], "error" => $msg]);
    exit;
}

if (!isset($_GET['username']) || !preg_match('/^[a-zA-Z0-9_.-]{3,32}$/', $_GET['username'])) {
    error('Ungültiger Username.');
}

$username = $_GET['username'];
$url = "https://tellonym.me/" . urlencode($username);

// Seite laden
$options = [
    "http" => [
        "header" => "User-Agent: Mozilla/5.0\r\n"
    ]
];
$context = stream_context_create($options);
$html = @file_get_contents($url, false, $context);
if ($html === false) {
    error('Profil konnte nicht geladen werden.');
}

// Bilder extrahieren
$matches = [];
preg_match_all('/<img[^>]+src=["\\\']([^"\\\']+user-profile-picture[^"\\\']+)["\\\'][^>]*>/i', $html, $matches);
$images = array_slice(array_unique($matches[1]), 0, 3);

if (count($images) === 0) {
    error('Keine Profilbilder gefunden.');
}

// Absolute URLs sicherstellen
$images = array_map(function($img) {
    if (strpos($img, 'http') === 0) return $img;
    return 'https://tellonym.me' . $img;
}, $images);

echo json_encode(["images" => $images]); 