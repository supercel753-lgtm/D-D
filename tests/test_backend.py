import os,subprocess,json,time,urllib.request,urllib.error
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
env=dict(os.environ)
env.pop('XAI_API_KEY',None);env.pop('XAI_MODEL',None)
env.update(PORT='18787',ALLOWED_ORIGINS='http://localhost:8000,https://example.github.io')
proc=subprocess.Popen(['node','server/server.js'],cwd=ROOT,env=env,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
def http(path, method='GET', body=None,origin=None):
 headers={'Content-Type':'application/json'}
 if origin:headers['Origin']=origin
 req=urllib.request.Request('http://127.0.0.1:18787'+path,data=json.dumps(body).encode() if body is not None else None,headers=headers,method=method)
 try:
  with urllib.request.urlopen(req,timeout=4) as r:return r.status,json.loads(r.read() or b'{}'),dict(r.headers)
 except urllib.error.HTTPError as e:return e.code,json.loads(e.read()),dict(e.headers)
try:
 for i in range(20):
  try:status,d,h=http('/health');break
  except Exception:time.sleep(.1)
 assert status==200 and d=={'status':'ok','aiConfigured':False},d
 status,d,h=http('/api/chat','POST',{'mode':'adventure','prompt':'Olá'},'http://localhost:8000')
 assert status==503 and 'não configurada' in d['error'],(status,d)
 assert h['Access-Control-Allow-Origin']=='http://localhost:8000'
 status,d,h=http('/api/chat','POST',{'mode':'adventure','prompt':'Olá'},'https://evil.example')
 assert status==403,(status,d)
 status,d,h=http('/nada')
 assert status==404,(status,d)
 print('PASS backend health, 503 sem credenciais, CORS, 404; chave ausente não bloqueia front-end.')
finally:
 proc.terminate()
 try:proc.wait(timeout=3)
 except subprocess.TimeoutExpired:proc.kill()
