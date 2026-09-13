/* ═══════════════════════════════════════════════════════════════════
   FANTIN SISTEMAS · COMPORTAMENTO
   ═══════════════════════════════════════════════════════════════════
   O que o CSS não consegue fazer sozinho. Nada aqui é obrigatório:
   sem JavaScript a página continua inteira e legível — é por isso que
   o estado inicial das revelações só existe sob .js-ligado.

   Carregue com <script src="sistema/sistema.js" defer></script>.
   ═══════════════════════════════════════════════════════════════════ */
(function(){
"use strict";

var raiz = document.documentElement;
raiz.classList.add("js-ligado");

var poucoMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ── tema ─────────────────────────────────────────────────────────
   A escolha da pessoa vence a do sistema operacional e sobrevive à
   navegação. Sem escolha, o sistema operacional manda. */

var CHAVE_TEMA = "fantin:tema";

/* Precedência: escolha guardada > declaração da página > sistema operacional.
   Passar null significa "não há escolha guardada" e NÃO apaga o que a página
   declarou — uma página pode se fixar num tema, e o JS não tem por que discordar. */
function aplicarTema(t){
  if (t === "papel" || t === "tinta") raiz.setAttribute("data-tema", t);
  document.querySelectorAll("[data-alterna-tema]").forEach(function(b){
    var atual = temaEfetivo();
    b.setAttribute("aria-pressed", atual === "tinta");
    var rotulo = b.querySelector("[data-rotulo-tema]");
    if (rotulo) rotulo.textContent = atual === "tinta" ? "Tema claro" : "Tema escuro";
  });
}

function temaEfetivo(){
  var t = raiz.getAttribute("data-tema");
  if (t) return t;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "tinta" : "papel";
}

try { aplicarTema(localStorage.getItem(CHAVE_TEMA)); } catch(e){ aplicarTema(null); }

document.addEventListener("click", function(ev){
  var b = ev.target.closest("[data-alterna-tema]");
  if (!b) return;
  var novo = temaEfetivo() === "tinta" ? "papel" : "tinta";
  aplicarTema(novo);
  try { localStorage.setItem(CHAVE_TEMA, novo); } catch(e){}
});

/* ── revelação por rolagem ────────────────────────────────────────
   Uma vez por elemento, nunca em laço. Quem pediu menos movimento
   recebe tudo revelado de saída. */

var alvos = document.querySelectorAll("[data-revelar]");

function revelarTudo(){
  alvos.forEach(function(el){ el.setAttribute("data-visivel",""); });
}

if (!alvos.length){
  /* nada a fazer */
} else if (poucoMovimento.matches || !("IntersectionObserver" in window)){
  revelarTudo();
} else {
  var obs = new IntersectionObserver(function(entradas){
    entradas.forEach(function(e){
      if (!e.isIntersecting) return;
      e.target.setAttribute("data-visivel","");
      obs.unobserve(e.target);            /* uma vez. só. */
    });
  }, { rootMargin:"0px 0px -12% 0px", threshold:.15 });

  /* Rede de segurança: conteúdo escondido à espera de um observador que
     não disparou é conteúdo perdido. Se em 2,5s algo ainda não apareceu,
     aparece. Nenhuma animação vale uma página em branco. */
  setTimeout(revelarTudo, 2500);

  alvos.forEach(function(el, i){
    /* escalonamento entre irmãos, com teto: ninguém espera a 7ª linha */
    if (!el.style.getPropertyValue("--i")){
      var irmaos = el.parentElement ? [].slice.call(el.parentElement.children).filter(function(c){
        return c.hasAttribute && c.hasAttribute("data-revelar");
      }) : [];
      var idx = irmaos.indexOf(el);
      el.style.setProperty("--i", Math.min(idx < 0 ? 0 : idx, 6));
    }
    obs.observe(el);
  });
}

/* se a pessoa mudar a preferência no meio da visita, obedeça na hora */
if (poucoMovimento.addEventListener){
  poucoMovimento.addEventListener("change", function(e){ if (e.matches) revelarTudo(); });
}

/* ── abas ─────────────────────────────────────────────────────────
   Marcador que desliza entre as abas. Padrão de teclado completo:
   setas navegam, Home e End vão às pontas. */

document.querySelectorAll("[data-abas]").forEach(function(grupo){
  var botoes = [].slice.call(grupo.querySelectorAll('[role="tab"]'));
  var marcador = grupo.querySelector(".marcador");
  if (!botoes.length) return;

  function mover(){
    var ativo = grupo.querySelector('[role="tab"][aria-selected="true"]') || botoes[0];
    if (!marcador) return;
    marcador.style.left  = ativo.offsetLeft + "px";
    marcador.style.width = ativo.offsetWidth + "px";
  }

  function selecionar(b){
    botoes.forEach(function(o){
      var e = o === b;
      o.setAttribute("aria-selected", e);
      o.tabIndex = e ? 0 : -1;
      var painel = document.getElementById(o.getAttribute("aria-controls"));
      if (painel) painel.hidden = !e;
    });
    mover();
  }

  grupo.addEventListener("click", function(ev){
    var b = ev.target.closest('[role="tab"]');
    if (b) selecionar(b);
  });

  grupo.addEventListener("keydown", function(ev){
    var i = botoes.indexOf(document.activeElement);
    if (i < 0) return;
    var j = null;
    if (ev.key === "ArrowRight") j = (i + 1) % botoes.length;
    if (ev.key === "ArrowLeft")  j = (i - 1 + botoes.length) % botoes.length;
    if (ev.key === "Home")       j = 0;
    if (ev.key === "End")        j = botoes.length - 1;
    if (j === null) return;
    ev.preventDefault();
    botoes[j].focus();
    selecionar(botoes[j]);
  });

  selecionar(grupo.querySelector('[role="tab"][aria-selected="true"]') || botoes[0]);
  window.addEventListener("resize", mover);
});

/* ── protocolo ────────────────────────────────────────────────────
   A confirmação do sistema. Entra com o movimento do carimbo e traz
   a hora, porque "aconteceu" sem "quando" não é protocolo.

     Fantin.protocolo("Arquivo enviado.");
*/

function protocolo(texto, ms){
  var pilha = document.querySelector(".protocolos");
  if (!pilha){
    pilha = document.createElement("div");
    pilha.className = "protocolos";
    pilha.setAttribute("role","status");
    pilha.setAttribute("aria-live","polite");
    document.body.appendChild(pilha);
  }
  var el = document.createElement("div");
  el.className = "protocolo";
  var agora = new Date();
  el.innerHTML = '<span></span><span class="hora"></span>';
  el.firstChild.textContent = texto;
  el.lastChild.textContent =
    String(agora.getHours()).padStart(2,"0") + ":" +
    String(agora.getMinutes()).padStart(2,"0");
  pilha.appendChild(el);

  setTimeout(function(){
    el.setAttribute("data-saindo","");
    setTimeout(function(){ el.remove(); }, 200);
  }, ms || 3600);

  return el;
}

/* ── progresso ────────────────────────────────────────────────────
     Fantin.progresso(elemento, 0.4)   → 40%
*/
function progresso(el, fracao){
  var barra = el.querySelector("i") || el;
  var f = Math.max(0, Math.min(1, fracao));
  barra.style.transform = "scaleX(" + f + ")";
  var raiz = el.closest("[role=progressbar]") || el;
  raiz.setAttribute("aria-valuenow", Math.round(f * 100));
}

window.Fantin = { protocolo:protocolo, progresso:progresso, tema:aplicarTema, temaEfetivo:temaEfetivo };

})();
