#!/usr/bin/env python3
"""Inspect final APK resources and prevent private QR leakage into standard builds."""
import argparse, base64, hashlib, json, re, zipfile
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--qr', type=Path, help='Optional private QR PNG used in the personal build')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
private_bytes = args.qr.read_bytes() if args.qr else None
for variant in ('standard', 'personal'):
    apk = root / f'android/app/build/outputs/apk/{variant}/release/app-{variant}-release.apk'
    with zipfile.ZipFile(apk) as archive:
        # Android ZIP writers use UTF-8 names even without the ZIP UTF-8 flag.
        names_map = {}
        for info in archive.infolist():
            name = info.filename
            if not info.flag_bits & 0x800:
                try: name = name.encode('cp437').decode('utf8')
                except (UnicodeEncodeError, UnicodeDecodeError): pass
            names_map[name] = info.filename
        names = set(names_map)
        read = lambda name: archive.read(names_map[name])
        assert {'classes.dex', 'AndroidManifest.xml', 'assets/index.html', 'assets/emergency.html'} <= names
        assert not any(name.startswith('assets/handoff/source/') for name in names), 'Engineering source must stay outside the APK'
        emergency = archive.read('assets/emergency.html').decode()
        assert not re.search(r'<(?:script|img|link)[^>]+(?:src|href)=["\'](?:https?:)?//', emergency)
        for required in ('119', '110', '06-6445-9427', '050-3816-2787', '救急車', '紛失届'):
            assert required in emergency, required
        data = json.loads(read('assets/handoff/行程数据.json'))
        assert len(data['authoritativeCurrentData']['days']) == 15
        assert sum(s['nights'] for s in data['authoritativeCurrentData']['stays']) == 14
        assert 'food-map-evidence.json' in data['jsonData']
        assert 'weather-snapshot.json' in data['jsonData']
        text = read('assets/handoff/完整旅行内容.txt').decode()
        assert '萨莉亚' in text and 'K681' in text and '2026-12-16' in text
        assert 'package top.styletrip' not in text
        photos = [name for name in names if name.startswith('assets/assets/') and name.endswith(('.jpg', '.png'))]
        assert len(photos) >= 50
        if variant == 'standard':
            assert 'src="data:image/' not in emergency, 'Standard emergency page must not contain a personal QR'
            if private_bytes:
                encoded = base64.b64encode(private_bytes)
                for name in names:
                    raw = read(name)
                    assert private_bytes not in raw and encoded not in raw, 'Private QR leaked into standard APK: ' + name
        elif private_bytes:
            match = re.search(r'<img src="data:image/png;base64,([^"]+)"', emergency)
            assert match and base64.b64decode(match[1]) == private_bytes, 'Personal QR must match original PNG exactly'
    print(f'PASS {variant}: {apk.stat().st_size / 1048576:.1f} MiB, {len(photos)} offline photos; SHA256 {hashlib.sha256(apk.read_bytes()).hexdigest()}')
