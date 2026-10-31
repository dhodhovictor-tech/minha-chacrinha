# Fonte do jogo

O site na raiz do repositório (`index.html`, `sw.js`, `shim.js`, `manifest.webmanifest`) é gerado a partir daqui. Não edite o `index.html` da raiz à mão: edite as partes em `fonte/jogo` e rode o build.

## Pastas

- `jogo/`: o jogo, em partes que são juntadas nesta ordem: `a_head.html` (estilos e HUD), `b*_data.js` (itens, receitas, NPCs), `c_maps.js` (mapas), `d_state.js` (estado e salvamento), `e*_draw.js` e `f*_icons.js` (desenhos), `f3_fish.js` (um desenho para cada peixe), `g_game.js` (ações), `h_ui.js` (painéis), `j_systems.js` (construções, animais, cozinha, NPCs), `k_market.js` (mercado), `l_cc.js` (Centro Comunitário e museu), `m_pet.js` (o Darth), `n_farm.js` (qualidade das colheitas, adubos, irrigadores, fazedor de sementes, para-raios e eventos da noite), `o_prof.js` (profissões nos níveis 5 e 10), `p_aventura.js` (peixes lendários, tesouro na pesca, anzóis, chefes da mina, armas, anéis e botas), `q_fest.js` (festivais das estações na barraca da Dona Cida), `r_conq.js` (conquistas do casal, aba Troféus), `i_main.js` (loop principal e carregamento).
- `app/shim.js`: liga o jogo ao Firebase Realtime Database, imitando a interface `claude.use('db' | 'room' | 'user')` que o jogo usava dentro do Claude.
- `app/rules.json`: regras do banco (as mesmas publicadas no console do Firebase).
- `build.py`: junta as partes, confere a sintaxe e gera o site na raiz, mais uma versão de teste em `fonte/.tmp/`.

## Publicar uma atualização

1. Edite as partes em `fonte/jogo`.
2. `python3 fonte/build.py`
3. Teste (abaixo), faça commit e push na `main`. O GitHub Pages publica em cerca de um minuto.
4. Nos celulares, o app busca o jogo mais novo sempre que abre com internet (sem internet, usa a cópia guardada). Se a versão nova sair com o app aberto, aparece o aviso "Versão nova! Toque aqui para atualizar". A aba Chacrinha do menu mostra a versão e tem o botão "Procurar atualização". O progresso fica no Firebase e não é afetado.

## Testar

Em `fonte/app`, com o emulador do Firebase e o site servido localmente:

```
npx firebase-tools emulators:start --only database --project demo-chacrinha
python3 -m http.server 8080 --bind 127.0.0.1 --directory <raiz do repositório>
node app_test.js
```

`etapa1_test.js` a `etapa5_test.js` conferem as novidades de cada etapa no jogo local (sem servidor): `etapa1_test.js` confere qualidade, adubos, irrigadores, fazedor de sementes e eventos da noite no jogo local (sem servidor). `app_test.js` simula dois aparelhos: criar a chacrinha, entrar com o código, jogar juntos, jogar em horários diferentes, trocar de chacrinha e abrir sem internet. Os testes usam `fonte/.tmp/index_test.html`, que expõe `window.__sv`.

## Outros scripts

- `app/make_icons.js`: redesenha os ícones em `icons/` com a arte do jogo.
- `app/make_seed.py <pasta do export> <código>`: gera `seed.js` com um progresso exportado da versão do Claude. Ele só é aplicado quando alguém entra com aquele código e a chacrinha ainda está vazia.
- `app/seed_test.js <código> <pasta do export>`: confere se esse progresso abre inteiro.
