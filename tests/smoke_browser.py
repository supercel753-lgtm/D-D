"""Browser integration harness. Browser policy blocks HTTP/file navigation in this environment;
serve a logically equivalent ES-module graph via in-memory Blob URLs after set_content.
Covers real DOM event wiring, UI state, and in-memory localStorage semantics.
"""
import re, pathlib, json, sys
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]


def bootstrap(page,store=None):
    content=(ROOT/'index.html').read_text()
    content=re.sub(r'<link rel="stylesheet"[^>]*>','',content)
    content=re.sub(r'<script type="module"[^>]*></script>','',content)
    page.set_content(content,wait_until='domcontentloaded')
    page.add_style_tag(content=(ROOT/'style.css').read_text())
    page.evaluate('''(s) => {window.__testStore=s||{};
     Object.defineProperty(window, 'localStorage',{configurable:true,value:{
       getItem(k){return Object.prototype.hasOwnProperty.call(window.__testStore,k)?window.__testStore[k]:null},
       setItem(k,v){window.__testStore[k]=String(v)}, removeItem(k){delete window.__testStore[k]}
     }}); }''',store or {})
    nodes={}
    def build(path):
        path=path.resolve()
        if path in nodes:return nodes[path]
        text=path.read_text()
        def replace(m):
            child=(path.parent/m.group(2)).resolve()
            if not child.is_file():raise AssertionError('Missing import '+str(child))
            return m.group(1)+build(child)+m.group(3)
        text=re.sub(r'''(from\s*["'])(\.\.?/[^"']+)(["'])''',replace,text)
        url=page.evaluate("s=>URL.createObjectURL(new Blob([s],{type:'text/javascript'}))",text)
        nodes[path]=url
        return url
    url=build(ROOT/'app.js')
    page.evaluate('async url=>{await import(url)}',url)


def main():
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  page=browser.new_page(viewport={'width':1440,'height':900},accept_downloads=True)
  page.set_default_timeout(6000)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  bootstrap(page)
  assert page.locator('.hero').count()==1
  # characters end to end
  page.locator('[data-view="characters"]').click()
  page.locator('#new-character').click()
  page.locator('[name="name"]').fill('Arven')
  page.locator('[name="race"]').select_option('Elfo')
  page.locator('[name="subrace"]').select_option('Alto')
  page.locator('[name="className"]').select_option('Mago')
  page.locator('#wizard-form button[type="submit"]').click()
  page.locator('#wizard-form button[type="submit"]').click()
  page.locator('[name="personality"]').fill('Curioso')
  page.locator('[name="skills"][value="Arcanismo"]').check()
  page.locator('#wizard-form button[type="submit"]').click()
  page.locator('#wizard-form button[type="submit"]').click()
  assert page.locator('h1').first.inner_text()=='Arven'
  assert page.locator('input[name="currentHP"]').input_value()!=''
  page.locator('#add-inventory input[name="name"]').fill('Mochila')
  page.locator('#add-inventory button').click()
  assert page.get_by_text('Mochila',exact=True).count()>=1
  page.locator('#sheet-conditions input[value="Caído"]').check()
  page.locator('#sheet-conditions button').click()
  page.locator('[data-view="campaigns"]').click()
  page.locator('#create-campaign input[name="name"]').fill('Vale das Luas')
  page.locator('#create-campaign button').click()
  assert page.locator('h1').first.inner_text()=='Vale das Luas'
  page.locator('#add-session input[name="name"]').fill('Sessão de abertura')
  page.locator('#add-session button').click()
  assert page.get_by_text('Sessão de abertura',exact=True).count()==1
  page.locator('#add-note input[name="title"]').fill('Dama dos Faróis')
  page.locator('#add-note textarea[name="body"]').fill('NPC original')
  page.locator('#add-note button').click()
  assert page.get_by_text('Dama dos Faróis',exact=True).count()==1
  page.locator('[data-view="bestiary"]').click()
  assert page.get_by_text('Sentinela de Musgo',exact=True).count()==1
  page.locator('#filter-type').select_option('Elemental')
  assert page.get_by_text('Espreitador de Cinzas',exact=True).count()==1
  assert page.get_by_text('Sentinela de Musgo',exact=True).count()==0
  page.locator('#filter-type').select_option('')
  page.locator('#monster-form input[name="name"]').fill('Falcão Sombrio')
  page.locator('#monster-form button.btn.primary').click()
  assert page.get_by_text('Falcão Sombrio',exact=True).count()==1
  # encounter created from bestiary action
  page.locator('[data-enc-monster="original_1"]').click()
  assert page.locator('h1').first.inner_text()=='Novo encontro'
  assert page.get_by_text('Sentinela de Musgo',exact=True).count()>=1
  page.locator('#add-enc-character button').click()
  assert page.get_by_text('Arven',exact=True).count()>=1
  page.locator('#roll-all-initiative').click()
  page.locator('#next-turn').click()
  page.locator('[data-view="dice"]').click()
  page.locator('#dice-form input[name="expression"]').fill('2d6+2')
  page.locator('#dice-form button.btn.primary').click()
  assert page.locator('.dice-result strong').count()==1
  page.locator('[data-view="library"]').click()
  page.locator('[data-library-tab="spells"]').click()
  assert page.get_by_text('Mísseis Mágicos',exact=True).count()==1
  page.locator('[data-view="settings"]').click()
  with page.expect_download() as down:
   page.locator('#export-backup').click()
  download=down.value
  assert download.suggested_filename.startswith('pixel-realms-backup-')
  raw=page.evaluate('localStorage.getItem("pixel-realms.v1")')
  obj=json.loads(raw)
  assert len(obj['characters'])==1 and len(obj['campaigns'])==1 and len(obj['encounters'])==1
  assert obj['characters'][0]['inventory'][0]['name']=='Mochila'
  assert obj['characters'][0]['conditions']==['Caído']
  print('PASS desktop CRUD/persist/dice/bestiary/campaign/encounters/backup',len(obj['characters']),len(obj['campaigns']),len(obj['encounters']))
  print('Browser errors:',errors)
  assert not errors, errors
  # CSS mobile surface
  page.set_viewport_size({'width':390,'height':844})
  assert page.locator('#navigation').is_visible()
  page.screenshot(path=str(ROOT/'tests'/'preview-mobile.png'),full_page=True)
  page.set_viewport_size({'width':1440,'height':900})
  page.locator('[data-view="dashboard"]').click()
  page.screenshot(path=str(ROOT/'tests'/'preview-desktop.png'),full_page=True)
  # re-render a fresh page with the same persisted store to simulate reload.
  newpage=browser.new_page(viewport={'width':1440,'height':900})
  fresh={"pixel-realms.v1":raw}
  bootstrap(newpage,fresh)
  newpage.locator('[data-view="characters"]').click()
  assert newpage.get_by_text('Arven',exact=True).count()==1
  print('PASS persisted character after app reinitialization')
  browser.close()
if __name__=='__main__': main()
