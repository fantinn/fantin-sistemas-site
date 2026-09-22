# Fantin Sistemas

Site e demonstrações da Fantin Sistemas — software sob medida para escritórios de
contabilidade e distribuidoras. Atendimento remoto para todo o Brasil, pelo WhatsApp.

## O que tem aqui

| Caminho | O que é |
|---|---|
| `index.html` | Site principal — oferta, escopo, prazo e faixa de preço |
| `demo/portal-contabil/` | Demonstração funcional: portal de coleta de documentos entre escritório de contabilidade e cliente |
| `checklist.html` | Página do checklist de documentos do mês |
| `checklist-documentos/` | O checklist em si, por regime tributário, feito para imprimir |
| `privacidade.html` | Política de privacidade (LGPD) |

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
| `tokens.css` | Única fonte de cor, tipografia, espaço, raio e sombra (cópia do design system) |
| `style.css` | CSS da página principal; importa `tokens.css` e só usa `var(--...)` |
| `ponte.css` | Liga as variáveis antigas das páginas secundárias aos tokens novos |
| `<script>` no fim do `index.html` | Tema, menu do celular, comparador, a conta e o formulário para o WhatsApp |
| `tools/contraste-pares.mjs` | Confere o contraste de todos os pares usados, nos dois modos |
| `tools/checar-tokens.mjs` | Acusa cor, espaço, raio ou sombra escritos à mão no `style.css` |

Tudo funciona abrindo o arquivo direto no navegador, mas para rodar servido:

```bash
python -m http.server 8080
```

E abrir `http://localhost:8080`.

## Acessibilidade e tema

As páginas respeitam o tema do sistema (claro e escuro), `prefers-reduced-motion`, foco
visível por teclado, e contraste AA. Nenhuma cor é definida apenas dentro de media query.

## Rastreamento

O pixel só carrega depois do aceite no banner de consentimento. Enquanto o ID não estiver
configurado, nada é carregado e nada é enviado.

## Contato

gabriel@fantin.tech
