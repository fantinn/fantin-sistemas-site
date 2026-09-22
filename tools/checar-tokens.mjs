/* Procura no style.css (e em style="" do index.html) cor, espaçamento,
   raio ou sombra escritos à mão, fora de var(--...).
   Rode:  node tools/checar-tokens.mjs        Zero achados = pronto. */
import { readFileSync } from "node:fs";

let css = readFileSync(new URL("../style.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

css = css.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, " "));           // comentários
css = css.replace(/@font-face\s*\{[^}]*\}/g, m => m.replace(/[^\n]/g, " "));     // declaração de fonte
css = css.replace(/:root\s*\{[^}]*--topo-h[^}]*\}/, m => m.replace(/[^\n]/g, " ")); // bloco "medidas"

const achados = [];
const COR = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|hwb|lab|lch|oklch|oklab)\(|\b(white|black|red|blue|green|gray|grey|orange|cyan|teal|navy|silver)\b/i;
const MEDIDA = /(?<![\w.-])-?\d*\.?\d+(px|rem|em)\b/;
const PROPS_ESPACO = /^(margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left|border-radius|box-shadow|outline-offset|scroll-padding)/;

css.split("\n").forEach((linha, i) => {
  if (/^\s*@media|^\s*@supports/.test(linha)) return;             // limites de tela ficam na media query
  for (const decl of linha.split(";")) {
    const m = decl.match(/([a-z-]+)\s*:\s*(.+)$/i);
    if (!m) continue;
    const [, prop, valor] = m;
    // --p e --corte são o ESTADO do comparador (posição da linha, mexida pelo JS), não token de design
    if (prop === "--p" || prop === "--corte") continue;
    if (prop.startsWith("--")) { achados.push(`style.css:${i + 1}  token novo fora do tokens.css: ${decl.trim()}`); continue; }
    const semVar = valor.replace(/var\(--[a-z0-9-]+\)/gi, "");
    if (COR.test(semVar)) achados.push(`style.css:${i + 1}  cor à mão: ${decl.trim()}`);
    if (PROPS_ESPACO.test(prop)) {
      const sobra = semVar.replace(/env\([^)]*\)/g, "");
      if (MEDIDA.test(sobra)) achados.push(`style.css:${i + 1}  espaço/raio/sombra à mão: ${decl.trim()}`);
    }
  }
});
for (const m of html.matchAll(/style="([^"]*)"/g)) achados.push(`index.html  style="" em linha: ${m[1]}`);

console.log(achados.length ? achados.join("\n") : "nenhuma cor, espaço, raio ou sombra fora de var(--...)");
console.log(`achados: ${achados.length}`);
process.exit(achados.length ? 1 : 0);
