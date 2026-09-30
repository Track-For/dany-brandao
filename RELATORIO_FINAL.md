# Relatório final - DB Experience

## Resultado

A home foi refinada sem reconstrução do projeto. A direção agora parte do mobile, usa os Reels verticais reais como ativos centrais e transforma a passagem do clássico ao contemporâneo em uma narrativa de scroll compreensível.

Principais decisões:

- Hero editorial em fundo creme, com tipografia teal e Reel 9:16 parcialmente visível no primeiro viewport.
- Storytelling Clássico → Pop com dois estados, transição cromática, ruptura de grid e fechamento completo: “O estilo muda. O cuidado não.”
- Fluxo mobile sem pin longo no hero e sem carrossel horizontal obrigatório no showcase.
- Método em seis capítulos verticais, com indicador sticky de progresso.
- Galeria de detalhes assimétrica, combinando imagem full bleed, vídeo menor, texto, imagem lateral e Reel vertical.
- Vídeos secundários carregados por Intersection Observer; `saveData` mantém o poster e evita o download automático.
- Menu mobile em tela cheia com Home, Como pensamos, Experiências, Dany e Contato.

## MOBILE FIRST AUDIT

| Experiência | Mobile | Desktop | Status |
| --- | --- | --- | --- |
| Entrada do hero | Label, linhas e Reel entram em sequência | Mesma hierarquia com composição tripartida | Implementado |
| Scroll do hero | Texto sobe e perde opacidade; Reel amplia sem pin | Mesmo princípio, com maior amplitude | Implementado |
| Clip do Reel | Revelação vertical por `clip-path` | Revelação vertical por `clip-path` | Implementado |
| Clássico → Pop | Sticky finito de 230svh com marcos de progresso | Sticky de 260svh com composição mais ampla | Implementado |
| Método DB | Capítulos verticais e progresso 01/06 | Sequência pinada com troca de texto, número e imagem | Implementado |
| Galeria de detalhes | Composição editorial vertical e movimento sutil | Composição assimétrica em grande escala | Implementado |
| Showcase | Cards verticais de pelo menos 78svh | Trilha horizontal pinada | Implementado |
| Complexidade | Sticky de 145svh com cinco palavras convergindo | Sticky de 220svh com dez palavras | Implementado |
| Manifesto | Reel de 80svh com texto sobreposto | Reel lateral de 86svh com copy em primeiro plano | Implementado |
| Menu | Tela cheia, links grandes e alvos de toque de 44px ou mais | Navegação em linha e CTA único | Implementado |
| CTA | Visível no primeiro viewport sobre o início do Reel | Visível sem scroll | Implementado |
| Transições de seção | Re reveals e mudanças cromáticas leves | Re reveals, parallax e transições coordenadas | Implementado |
| Cursor contextual | Desativado, conforme política mobile | Ativo apenas com ponteiro preciso | Exceção permitida |
| Efeito magnético | Desativado em touch | Ativo em CTA com ponteiro preciso | Exceção permitida |
| Pin horizontal | Desativado; cards seguem o fluxo vertical | Ativo somente no showcase | Exceção permitida |

## Desempenho de mídia

- `VerticalFilm` centraliza `src`, `poster`, `label`, `caption`, `objectPosition`, `autoplay`, `loop` e `priority`.
- O hero é o único vídeo prioritário.
- Outros Reels usam `preload="none"` e só recebem a source quando se aproximam do viewport.
- Com `navigator.connection.saveData === true`, nenhum vídeo automático recebe a source; o poster permanece visível.
- O vídeo pausa quando sai da área observada.

## Validação responsiva

Ordem executada:

1. 390 × 844
2. 375 × 812
3. 430 × 932
4. 360 × 800
5. 320 × 568
6. 768 × 1024
7. 1366 × 768
8. 1440 × 900
9. 1920 × 1080

Em todos os viewports auditados, `scrollWidth` e `clientWidth` coincidem. A página chega ao footer em 390 × 844 sem travamento de scroll.

## Capturas

As 12 capturas principais estão em `docs/screenshots/mobile/`:

1. Hero
2. Clássico
3. Transição
4. Pop
5. Método
6. Discrição
7. Detalhes
8. Showcase
9. Complexidade
10. Manifesto
11. Dany
12. Contato

Capturas adicionais de responsividade estão em `docs/screenshots/mobile/responsive/` e `docs/screenshots/desktop/`.

## Verificações técnicas

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- Auditoria de overflow horizontal
- Auditoria de alcance do footer
- Auditoria do menu mobile
- Auditoria visual dos 12 estados principais
