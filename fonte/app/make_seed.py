# Gera seed.js (na raiz) com o progresso exportado da versão do Claude. Só é usado por quem digitar o código certo.
import hashlib, json, os, sys
dump, code = sys.argv[1], sys.argv[2]
docs = {}
for col in ('world', 'players'):
    d = os.path.join(dump, col)
    for f in sorted(os.listdir(d)):
        if f.endswith('.json'): docs[col + '/' + f[:-5]] = json.load(open(os.path.join(d, f)))
assert 'world/meta' in docs and 'world/farm' in docs and 'world/clock' in docs
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'seed.js')
open(out, 'w').write('// progresso trazido da versão do Claude\nwindow.CHACRINHA_SEED = ' + json.dumps({'codeHash': hashlib.sha256(code.encode()).hexdigest(), 'docs': docs}, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('seed', out, sorted(docs), os.path.getsize(out) // 1024, 'KB')
