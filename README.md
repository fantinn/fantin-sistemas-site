# Fantin Sistemas

Site da Fantin Sistemas — landing page, loja completa na Nuvemshop e automação para
quem vende pelo Instagram e pelo direct. Atendimento remoto para todo o Brasil, pelo
WhatsApp. No ar em [fantin.tech](https://fantin.tech/).

As páginas de contabilidade (`checklist.html` e `checklist-documentos/`) e a
demonstração do portal são de antes da mudança de posicionamento. Continuam no ar
porque continuam servindo de prova e de isca, mas não é o que a página inicial vende.

## O que tem aqui

| Caminho | O que é |
|---|---|
| `index.html` | Site principal — problema, método, frentes, trabalhos, preço e a conta |
| `demo/portal-contabil/` | Demonstração funcional: portal de coleta de documentos entre escritório de contabilidade e cliente |
| `checklist.html` | Página do checklist de documentos do mês |
| `checklist-documentos/` | O checklist em si, por regime tributário, feito para imprimir |
| `privacidade.html` | Política de privacidade (LGPD) |
| `tools/og.html` | A fonte do `og.png`, o cartão de link |
| `favicon.svg` | Ícone da aba: laranja da marca com o símbolo em tinta escura. Sem `--` nos comentários (invalida o SVG) |
| `tools/icone.html` | A fonte do `apple-touch-icon.png` (180×180, sem raio: o iOS arredonda) |
| `404.html` | Página de endereço inexistente. O Pages serve ela em qualquer profundidade, por isso os caminhos são absolutos (`/style.css`) |

## A demonstração

`demo/portal-contabil/` é um protótipo funcional com duas visões, alternadas pela barra
no topo:

- **Escritório** — carteira de clientes, quem enviou o quê, dias de atraso, cobrança que
  nomeia exatamente o que falta, régua de cobrança e trilha com data e hora.
- **Cliente** — checklist do mês que muda conforme o regime tributário, envio por arraste
  ou pelo celular, motivo escrito quando um arquivo é recusado, protocolo no fim.

Os dados são fictícios e o estado fica no navegador (`localStorage`). Não há servidor,
banco nem login: é uma demonstração de interface e de fluxo, não um sistema em produção.

## Stack

HTML, CSS e JavaScript, sem build e sem dependência de runtime, publicado no GitHub
Pages (o `CNAME` aponta para fantin.tech). Nenhuma requisição externa: as três fontes
(Archivo, Instrument Sans, JetBrains Mono) são servidas de `assets/fontes/`.

| Arquivo | Papel |
|---|---|
| `tokens.css` | Única fonte de cor, tipografia, espaço, raio e sombra (o sistema "papel") |
| `fontes.css` | As três fontes (`@font-face`), usadas pela página principal e pelas secundárias |
| `style.css` | CSS da página principal, em `@layer` (tokens → base → componentes → seções → utilitários); só usa `var(--...)` |
| `ponte.css` | Liga as variáveis antigas das páginas secundárias aos tokens novos |
| `sistema/` | O CSS e o JS antigos, ainda usados pelas páginas secundárias e pela demonstração |
| `assets/` | As três fontes, a foto de "quem sou eu" (AVIF e WebP, 320 e 480) e o print do pdrdesign.com.br (AVIF e WebP, 720 e 1200), usado no card do Pedro Design em "trabalhos", e as duas telas do antes e depois (`ba-antes`, `ba-depois`; AVIF e WebP, 480 e 760) |
| `<script>` no fim do `index.html` | Tema, menu do celular, comparador, a conta, o formulário para o WhatsApp, a vitrine dos trabalhos e dos preços (entrada ao aparecer na tela), o filme das 23h (troca de cena ao rolar), a frase que acende e a luz que segue o mouse |
| `tools/contraste-pares.mjs` | Confere o contraste de todos os pares usados, nos dois modos |
| `tools/checar-tokens.mjs` | Acusa cor, espaço, raio ou sombra escritos à mão no `style.css` |

Antes de subir mudança de cor ou de CSS, os dois têm que voltar zero:

```bash
node tools/checar-tokens.mjs && node tools/contraste-pares.mjs
```

Tudo funciona abrindo o arquivo direto no navegador, mas para rodar servido:

```bash
python -m http.server 8080
```

E abrir `http://localhost:8080`.

## O cartão de link (og.png)

`og.png` é 1200×630 e sai de `tools/og.html`, com o site servido. **Precisa ficar abaixo
de 300 KB**: acima disso o WhatsApp não mostra imagem nenhuma. O WhatsApp guarda a prévia
por URL, então depois de trocar a imagem mande o link com `?v=2` para forçar a releitura.

```bash
chrome --headless --hide-scrollbars --window-size=1200,630 \
  --screenshot=og.png http://127.0.0.1:8080/tools/og.html
```

## Acessibilidade e tema

As páginas respeitam `prefers-reduced-motion`, foco visível por teclado e contraste AA
nos dois modos (conferido por cálculo, zero falhas). Nenhuma cor é definida apenas dentro
de media query. Toda visita abre no claro — o papel é a cara da marca; o escuro só entra
se a pessoa trocar no botão, e vale só naquela visita.

## Rastreamento

O pixel só carrega depois do aceite no banner de consentimento. Enquanto o `PIXEL_ID`
for `TODO_PIXEL_ID`, nada é carregado, nada é enviado e o banner nem aparece.

## Contato

gabriel@fantin.tech
