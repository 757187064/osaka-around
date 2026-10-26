"""Re-download reviewed Commons files. Never automatically select search results.
The manifest in data/photos.json preserves the specific verified subject and licence.
"""
import json, subprocess, urllib.parse
from pathlib import Path
root=Path(__file__).resolve().parents[1]
photos=json.loads((root/'data/photos.json').read_text())
for key,p in photos.items():
 target=root/p['path']
 if target.exists(): continue
 title=urllib.parse.unquote(p['source'].split('/wiki/')[-1])
 url='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(dict(action='query',titles=title,prop='imageinfo',iiprop='url',iiurlwidth=1000,format='json'))
 result=json.loads(subprocess.check_output(['curl','-fLsS','--retry','2',url]))
 info=next(iter(result['query']['pages'].values()))['imageinfo'][0]
 subprocess.run(['curl','-fLsS','--retry','2','--output',str(target),info.get('thumburl',info['url'])],check=True)
 print('Downloaded reviewed photograph:',key)
