/* Confere o contraste de TODOS os pares texto/fundo que o style.css usa,
   lendo as cores de tokens.css. Um modo só: o preto.
   Rode:  node tools/contraste-pares.mjs          Zero falhas = pronto. */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../tokens.css", import.meta.url), "utf8");
const m = css.match(/:root\{([\s\S]*?)\n\}/);
const t = {};
if (m) for (const [, k, v] of m[1].matchAll(/--([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})/g)) t[k] = v;

const lin = c => (c /= 255, c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const L = h => { const n = h.slice(1); const [r, g, b] = [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const R = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// [frente, fundo, mínimo, onde aparece]
const T = 4.5, G = 3.0;
const pares = [
  ["luz", "breu", T, "texto principal"],
  ["luz", "breu-2", T, "texto em card"],
  ["luz", "breu-3", T, "texto no balão da mensagem, campo"],
  ["luz-2", "breu", T, "lead, apoio"],
  ["luz-2", "breu-2", T, "apoio em card"],
  ["luz-2", "breu-3", T, "apoio no topo do balão"],
  ["luz-3", "breu", T, "rótulo, meta"],
  ["luz-3", "breu-2", T, "rótulo em card, placeholder"],
  ["luz-3", "breu-3", T, "endereço na moldura, legenda do balão"],
  ["marca", "breu", T, "destaque do título, número, erro"],
  ["marca", "breu-2", T, "número em card, etiqueta, link de status"],
  ["marca", "marca-fundo", T, "etiqueta no card em destaque"],
  ["sobre-marca", "marca", T, "texto do botão laranja"],
  ["sobre-marca", "marca-2", T, "texto do botão laranja no hover"],
  ["sucesso", "breu", T, "\"no ar\", resposta em até 4h"],
  ["sucesso", "breu-2", T, "\"no ar\" em card"],
  ["fio-2", "breu", G, "borda de campo e de botão"],
  ["fio-2", "breu-2", G, "borda de campo e de botão em card"],
  ["fio-2", "breu", G, "palavra ainda apagada na frase que acende (texto grande)"],
  ["marca", "breu", G, "contorno de foco"],
  ["marca", "breu-2", G, "contorno de foco em card, borda do card em destaque"],
  ["luz", "breu-2", G, "bolinha da barra da conta"],
];

let falhas = 0; const linhas = [];
for (const [a, b, min, onde] of pares) {
  if (!t[a] || !t[b]) { falhas++; linhas.push(`| ${a} | ${b} | — | ${min} | TOKEN AUSENTE | ${onde} |`); continue; }
  const v = R(t[a], t[b]); const ok = v >= min; if (!ok) falhas++;
  linhas.push(`| ${a} | ${b} | ${v.toFixed(2)}:1 | ${min}:1 | ${ok ? "ok" : "**FALHA**"} | ${onde} |`);
}
console.log("| texto/borda | fundo | razão | mínimo | resultado | onde |");
console.log("|---|---|---|---|---|---|");
console.log(linhas.join("\n"));
console.log(`\nfalhas: ${falhas}`);
process.exit(falhas ? 1 : 0);
