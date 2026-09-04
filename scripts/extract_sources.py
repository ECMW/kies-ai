"""Read-only OOXML extraction for PAM-AI source traceability (stdlib only)."""
from pathlib import Path
import hashlib, json, zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '.local' / 'source-audit'
OUT.mkdir(parents=True, exist_ok=True)
import argparse
parser = argparse.ArgumentParser()
parser.add_argument('--source-dir', type=Path, default=ROOT / 'pam-ai' / 'bronnen')
SOURCE = parser.parse_args().source_dir
ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
manifest = []
for filename in ['PAM-AI_v1.1_Praktijkinstrument.xlsx', 'PAM-AI_v1.1_Methodiek_Praktijkhandleiding_Validatieprotocol.docx']:
    path = SOURCE / filename
    manifest.append({'file': filename, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})
    with zipfile.ZipFile(path) as z:
        if path.suffix == '.docx':
            xml = ET.fromstring(z.read('word/document.xml'))
            w = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            lines = []
            for i, p in enumerate(xml.findall('.//w:p', w)):
                text = ''.join(t.text or '' for t in p.iter() if t.tag.rsplit('}',1)[-1] == 't')
                if text: lines.append(f'P{i+1}: {text}')
            (OUT/'methodiek.txt').write_text('\n'.join(lines), encoding='utf-8')
        else:
            wb = ET.fromstring(z.read('xl/workbook.xml'))
            rels = {r.attrib['Id']: r.attrib['Target'] for r in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
            strings = []
            if 'xl/sharedStrings.xml' in z.namelist():
                strings = [''.join(e.itertext()) for e in ET.fromstring(z.read('xl/sharedStrings.xml'))]
            sheets=[]
            for sheet in wb.find('s:sheets', ns):
                rid = sheet.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
                target = rels[rid].lstrip('/')
                if not target.startswith('xl/'): target='xl/'+target
                xml=ET.fromstring(z.read(target)); cells=[]
                for c in xml.findall('.//s:sheetData/s:row/s:c',ns):
                    value=c.find('s:v',ns); formula=c.find('s:f',ns); inline=c.find('s:is',ns)
                    v=value.text if value is not None else None
                    if c.attrib.get('t')=='s' and v is not None: v=strings[int(v)]
                    if inline is not None: v=''.join(inline.itertext())
                    if v is not None or formula is not None:
                        cells.append({'cell':c.attrib['r'],'value':v,'formula':formula.text if formula is not None else None,'type':c.attrib.get('t'),'style':c.attrib.get('s')})
                validations=[ET.tostring(d,encoding='unicode') for d in xml.findall('s:dataValidations',ns)]
                name=sheet.attrib['name']; sheets.append({'name':name,'cells':cells,'validations':validations})
                (OUT/(name.replace('/','_')+'.txt')).write_text('\n'.join(c['cell']+': '+str(c['value'] or '')+(' FORMULA '+str(c['formula']) if c['formula'] else '') for c in cells)+'\nVALIDATIONS\n'+'\n'.join(validations),encoding='utf-8')
            (OUT/'workbook.json').write_text(json.dumps({'sheets':sheets,'definedNames':[ET.tostring(e,encoding='unicode') for e in wb.findall('s:definedNames',ns)]},ensure_ascii=False,indent=2),encoding='utf-8')
            print(json.dumps([{'sheet':s['name'],'cells':len(s['cells']),'formulas':sum(bool(c['formula']) for c in s['cells'])} for s in sheets],ensure_ascii=False))
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print('Extracted to', OUT)
