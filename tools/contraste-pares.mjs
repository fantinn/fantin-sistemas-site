/* Confere o contraste de TODOS os pares texto/fundo que o style.css usa,
   lendo as cores de tokens.css, nos dois modos. Complementa o
   fantin-design-system/conferir-contraste.mjs (que cobre os pares-base).
   Rode:  node tools/contraste-pares.mjs          Zero falhas = pronto. */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../tokens.css", import.meta.url), "utf8");
const bloco = (re) => {
  const m = css.match(re); const out = {};
  if (m) for (const [, k, v] of m[1].matchAll(/--([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})/g)) out[k] = v;
  return out;
};
const claro = bloco(/:root\{([\s\S]*?)\n\}/);
const escuroAttr = bloco(/:root\[data-theme="dark"\]\{([\s\S]*?)\n\}/);
const escuroMedia = bloco(/:root:not\(\[data-theme="light"\]\)\{([\s\S]*?)\n  \}/);
const escuro = { ...claro, ...escuroAttr };

// os dois blocos do escuro (atributo e preferência do sistema) têm que ser iguais
const difs = Object.keys({ ...escuroAttr, ...escuroMedia }).filter(k => escuroAttr[k] !== escuroMedia[k]);

const lin = c => (c /= 255, c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const L = h => { const n = h.slice(1); const [r, g, b] = [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const R = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// [frente, fundo, mínimo, onde aparece]
const T = 4.5, G = 3.0;
const pares = [
  ["tinta", "papel", T, "texto principal"],
  ["tinta", "papel-2", T, "texto em card"],
  ["tinta", "papel-3", T, "texto em faixa alternada / tela 'antes'"],
  ["tinta-2", "papel", T, "lead, apoio"],
  ["tinta-2", "papel-2", T, "apoio em card, url da moldura"],
  ["tinta-2", "papel-3", T, "apoio em faixa alternada"],
  ["tinta-3", "papel", T, "eyebrow, meta"],
  ["tinta-3", "papel-2", T, "eyebrow em card, placeholder"],
  ["tinta-3", "papel-3", T, "eyebrow em faixa alternada"],
  ["marca-texto", "papel", T, "destaque do título, número"],
  ["marca-texto", "papel-2", T, "link de trabalho, erro de formulário"],
  ["marca-texto", "papel-3", G, "sinal + / − do FAQ na faixa alternada (indicador gráfico)"],
  ["marca-tinta", "marca", T, "botão primário, etiqueta Depois"],
  ["tinta", "marca-tint", T, "etiqueta"],
  ["papel-2", "tinta", T, "tamanho selecionado (exemplo)"],
  ["sucesso", "papel-2", T, "frete calculado (exemplo)"],
  ["linha-2", "marca-tint", G, "borda do balão da mensagem no formulário"],
  ["atencao", "papel-3", T, "grito da tela 'antes' (exemplo)"],
  ["banda-tinta", "banda", T, "título na faixa escura, etiqueta Antes"],
  ["banda-tinta-2", "banda", T, "texto de apoio na faixa escura"],
  ["linha-2", "papel", G, "borda de botão/controle"],
  ["linha-2", "papel-2", G, "borda de input, botão em card"],
  ["marca", "papel", G, "contorno de foco, fio do passo"],
  ["marca", "papel-2", G, "contorno de foco em card, borda do destaque"],
  ["tinta", "papel-3", G, "contorno de foco na faixa alternada"],
  ["marca", "banda", G, "contorno de foco e fio na faixa escura"],
  ["marca", "banda", T, "hora da etapa no filme (faixa escura)"],
  ["marca-texto", "marca-tint", T, "grifo do \"comprar.\" no título"],
  ["marca-texto", "papel-2", G, "borda de campo com erro"],
];

let falhas = 0; const linhas = [];
for (const [modo, t] of [["claro", claro], ["escuro", escuro]]) {
  for (const [a, b, min, onde] of pares) {
    if (!t[a] || !t[b]) { falhas++; linhas.push(`| ${modo} | ${a} | ${b} | — | ${min} | TOKEN AUSENTE | ${onde} |`); continue; }
    const v = R(t[a], t[b]); const ok = v >= min; if (!ok) falhas++;
    linhas.push(`| ${modo} | ${a} | ${b} | ${v.toFixed(2)}:1 | ${min}:1 | ${ok ? "ok" : "**FALHA**"} | ${onde} |`);
  }
}
console.log("| modo | texto/borda | fundo | razão | mínimo | resultado | onde |");
console.log("|---|---|---|---|---|---|---|");
console.log(linhas.join("\n"));
console.log(`\nescuro por atributo = escuro do sistema: ${difs.length ? "NÃO (" + difs.join(", ") + ")" : "sim, idênticos"}`);
console.log(`falhas: ${falhas + difs.length}`);
process.exit(falhas + difs.length ? 1 : 0);
