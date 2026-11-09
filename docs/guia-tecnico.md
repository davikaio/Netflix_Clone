# Guia técnico, arquivo por arquivo

O projeto separa **conteúdo**, **apresentação** e **comportamento**. Essa divisão permite alterar a cor de um botão sem tocar na validação, ou acrescentar uma pergunta sem reescrever o acordeão. Não há exercícios ou etapas que dependam de adivinhação: os exemplos abaixo correspondem ao código entregue.

## 1. Como as peças se conectam

1. O navegador lê `index.html` e cria a árvore de elementos, chamada DOM.
2. Os arquivos CSS são carregados na ordem declarada. Variáveis vêm antes dos componentes que as consomem.
3. As imagens têm caminhos relativos, então os mesmos arquivos funcionam em uma pasta local ou hospedagem estática.
4. Os três scripts usam `defer`: podem baixar enquanto o HTML é lido, mas só executam depois da análise do documento. Assim, `querySelector()` encontra os elementos.
5. Cada script seleciona os elementos de seu componente, registra eventos e deixa o navegador cuidar do fluxo normal da página.

```html
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/faq.css">
<script src="js/faq.js" defer></script>
```

Não há `import`, `export` ou dependência de compilação. Os arquivos JS são módulos **por responsabilidade**, encapsulados por funções autoexecutáveis. Módulos ES com `type="module"` também seriam uma opção, mas exigiriam servir os arquivos por HTTP em vez de contar com abertura direta por `file://` em todos os navegadores.

## 2. `index.html`: semântica e contratos com os scripts

`header` contém a marca e os controles superiores. `main` reúne as seções principais. Cada `section` possui um título, associado por `aria-labelledby`, para que a estrutura faça sentido também fora da apresentação visual. O `aside` descreve a faixa complementar de plano, e `footer` reúne suporte e identificação do estudo.

Há apenas um `h1`, no hero. Seções usam `h2`; benefícios e perguntas usam `h3`. A hierarquia comunica relações de conteúdo, não tamanhos de fonte. O tamanho é responsabilidade do CSS.

```html
<section class="content-section faq-section" id="faq" aria-labelledby="faq-title">
  <h2 id="faq-title">Perguntas frequentes</h2>
</section>
```

As classes servem principalmente ao CSS. IDs identificam destinos únicos e relações de acessibilidade. Atributos `data-*` identificam comportamentos reutilizáveis, como `data-email-form` nos dois formulários.

Os campos têm IDs diferentes (`hero-email` e `footer-email`) e labels correspondentes. A mesma estrutura pode ser repetida sem duplicar IDs nem confundir o feedback de um formulário com o do outro.

O hero usa `picture`, versões WebP e fallback JPEG. A imagem é decorativa: `alt=""` evita que uma colagem de capas interrompa a leitura do título. Os cartazes em Em alta recebem nomes de títulos como texto alternativo. `width` e `height` informam proporções antes do download, reduzindo saltos de layout.

O preço e a seleção de títulos são um retrato da referência consultada; o HTML não consulta um catálogo em tempo real. Os textos comerciais são resumidos para o estudo, com destinos oficiais para consultar condições completas.

## 3. `variables.css`: decisões compartilhadas

```css
:root {
  --color-primary: #e50914;
  --color-background: #000;
  --container-width: 1160px;
  --page-gutter: 24px;
}
```

`:root` representa o elemento raiz da página. Uma propriedade iniciada por `--` é uma variável CSS, consumida com `var(--nome)`. Tokens centralizados reduzem diferenças acidentais entre componentes.

O projeto usa Arial/Helvetica com fallback de sistema. Essa escolha aproxima a composição visual sem depender de uma fonte comercial da marca, instalação de pacotes ou requisição a um provedor de fontes. Trocar a família significa alterar `--font-family`, depois conferir quebras de texto e dimensões dos controles.

As margens começam em 24 px, passam a 40 px a partir de 768 px e a 64 px a partir de 1280 px. Esses valores dão mais espaço ao conteúdo no celular e mais respiro nas telas amplas. A largura máxima impede que textos e cartões atravessem o monitor inteiro.

## 4. `base.css`: medidas previsíveis e regras comuns

```css
*, *::before, *::after { box-sizing: border-box; }
.container {
  width: min(calc(100% - var(--page-gutter) * 2), var(--container-width));
  margin-inline: auto;
}
```

Com `border-box`, uma caixa de 300 px já inclui seu padding e suas bordas. Sem isso, eles seriam somados à largura e poderiam causar rolagem horizontal inesperada.

`calc()` retira as margens laterais; `min()` escolhe a menor largura entre o espaço disponível e 1160 px. `margin-inline: auto` centraliza o resultado e usa propriedades que acompanham a direção do texto.

Considerando as larguras de referência, antes da barra de rolagem:

| Tela | Largura aproximada do container | Resultado |
| --- | ---: | --- |
| 375 px | 327 px | Margens de 24 px; conteúdo compacto. |
| 768 px | 688 px | Margens de 40 px; espaço para duas colunas. |
| 1440 px | 1160 px | Largura máxima; sobram cerca de 140 px por lado. |

O reset remove margens iniciais de elementos usados no projeto, mas mantém controles HTML reais. `:focus-visible` cria um contorno ao navegar por teclado. O link de salto fica fora da tela até receber foco, permitindo pular o cabeçalho.

`prefers-reduced-motion` desativa transições e rolagem suave quando essa é a preferência do visitante. As funções JS que fazem rolagem consultam a mesma preferência. As regras de `forced-colors` preservam bordas e foco em modos de alto contraste.

## 5. `header.css`: alinhamento com Flexbox

```css
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

Flexbox resolve uma distribuição em uma dimensão: marca à esquerda, ações à direita. `align-items` alinha verticalmente; `justify-content` distribui o espaço horizontal. O grupo de ações também é um flex container, mantendo idioma e Entrar juntos.

O header é absoluto, com `z-index: 5`, para aparecer sobre o fundo do hero sem reservar uma faixa preta separada. O padding superior do hero compensa essa sobreposição, mantendo o título abaixo da marca.

O logotipo mede 90 px no celular, 120 px em telas intermediárias e 148 px no desktop. No seletor mobile, a composição visual mostra ícones; o nome da opção permanece disponível para tecnologias assistivas. Há apenas a opção Português porque esta base não implementa tradução. O botão Entrar é um link real para o serviço oficial, sem uma tela de login simulada.

## 6. `hero.css`: imagem, gradientes e formulário adaptativo

```css
.hero { position: relative; isolation: isolate; }
.hero-background { position: absolute; inset: 0; z-index: -3; }
.hero::before { position: absolute; inset: 0; z-index: -2; }
.hero-content { position: relative; z-index: 1; }
```

`position: relative` estabelece o sistema de coordenadas das camadas absolutas. `inset: 0` encosta a camada nas quatro bordas. A imagem não define a altura da seção; título, formulário e padding participam do fluxo. `isolation` cria um contexto local de empilhamento e mantém os índices negativos associados ao hero.

`object-fit: cover` preenche o fundo sem deformar a imagem, aceitando um recorte lateral ou vertical conforme a proporção da tela. A colagem é decorativa, por isso esse recorte é aceitável.

```css
background:
  linear-gradient(180deg, rgb(0 0 0 / 78%), rgb(0 0 0 / 65%) 45%, rgb(0 0 0 / 93%)),
  linear-gradient(90deg, rgb(0 0 0 / 35%), transparent 50%, rgb(0 0 0 / 35%));
```

A primeira camada escurece a parte superior e o rodapé, preservando contraste para marca e textos. A segunda cria uma vinheta lateral. Em uma lista de backgrounds, o primeiro fica acima do seguinte. O hero termina com uma curva decorativa; o próprio hero limita seu transbordamento, sem esconder erros de largura do documento inteiro.

### Formulário compartilhado

O formulário começa como coluna. A partir de 600 px, vira linha com quebra permitida. O campo tem `flex: 1` e ocupa o espaço restante; o botão mantém seu tamanho legível. `min-width: 0` no campo evita que seu tamanho intrínseco force o layout além da tela. O feedback usa `flex-basis: 100%` para ficar em uma linha própria.

O label é real e associado ao input. O placeholder é um espaço, usado apenas para a condição CSS `:placeholder-shown`. Ao focar ou preencher o campo, `input + label` move e reduz o rótulo. O padding superior deixa espaço para o label e o valor coexistirem. Assim, o nome do campo não desaparece quando a pessoa começa a digitar.

A faixa de planos também fica neste arquivo porque faz parte da transição visual do hero. Seu layout começa empilhado e vira Grid com texto e link lado a lado. Não existe contratação local: o link conduz à página oficial.

## 7. `trending.css`: rolagem horizontal e números sobrepostos

```css
.trending-list {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.trending-item { flex: 0 0 138px; scroll-snap-align: start; }
```

`flex: 0 0 138px` significa: não crescer, não encolher e começar com uma largura de 138 px. Por isso os dez itens não são comprimidos para caber na tela. O excesso pertence à lista rolável, sem alargar o documento.

Scroll-snap alinha o início de um item quando a rolagem termina. `scroll-padding-inline` corresponde ao padding interno: sem essa compensação, o primeiro item poderia parar alguns pixels depois de zero e fazer a seta anterior parecer disponível no início.

Os números têm `position: absolute` dentro de um item relativo. O `z-index` os coloca acima dos cartazes. O preenchimento escuro, o contorno claro e a sombra os distinguem das imagens. São decorativos para leitores de tela, já que a lista ordenada e os textos alternativos comunicam posição e conteúdo.

## 8. `reasons.css`: uma, duas e quatro colunas

```css
.reasons-grid { grid-template-columns: minmax(0, 1fr); }
@media (min-width: 768px) {
  .reasons-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 1200px) {
  .reasons-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
```

Grid controla as duas dimensões da grade. `1fr` divide igualmente o espaço disponível; o mínimo zero permite que o texto quebre dentro da célula em vez de impor uma largura maior. Os breakpoints atendem às referências: 375 px recebe uma coluna, 768 px recebe duas e 1440 px recebe quatro.

Os cards têm altura mínima, não altura fixa, para crescer se o texto exigir. Dentro de cada card, Flexbox organiza título, descrição e ícone verticalmente. `margin-top: auto` no ícone absorve o espaço livre e o alinha embaixo. Os SVGs são vetores locais reutilizados, sem biblioteca.

## 9. `faq.css` e `faq.js`: estado, altura e acessibilidade

No HTML, as respostas estão abertas e os botões desativados. Esse é o fallback sem JavaScript. Quando o módulo inicializa, ele habilita os botões, adiciona `.faq-ready` e fecha as respostas.

```javascript
function setOpen(entry, open) {
  entry.item.classList.toggle('aberto', open);
  entry.button.setAttribute('aria-expanded', String(open));
  entry.panel.setAttribute('aria-hidden', String(!open));
  entry.panel.inert = !open;
}
```

`classList.toggle` recebe um segundo argumento booleano para impor o estado, em vez de alternar sem saber o resultado. O atributo `aria-expanded` anuncia se a pergunta está aberta. `aria-hidden` acompanha a exposição da resposta, e `inert` impede foco em conteúdo fechado, inclusive se futuros parágrafos receberem links.

Ao clicar, o código calcula se o item precisa abrir. Depois percorre a lista: só o item escolhido pode receber `true`. Clicar novamente nele deixa todos fechados. Esse comportamento de seleção única é diferente de simplesmente alternar cada pergunta isoladamente.

O painel usa Grid com `0fr` fechado e `1fr` aberto. O filho tem `min-height: 0` e `overflow: hidden`, permitindo que a altura realmente chegue a zero. Isso anima a altura natural sem manter um `max-height` arbitrário que poderia cortar respostas grandes. `visibility` acompanha o fechamento. Usar apenas `display: none` impediria essa interpolação.

O ícone é formado por duas linhas CSS; girar 45 graus transforma o sinal de mais em um xis. Não é necessário trocar imagens. Enter e Espaço funcionam nativamente em botões; o script acrescenta setas, Home, End e Escape. Tab continua permitindo sair do componente, pois o FAQ não é um diálogo modal.

## 10. `trending.js`: medidas reais em vez de números mágicos

```javascript
const stride = cardStride();
const visibleCards = Math.max(1, Math.floor(list.clientWidth / stride));
list.scrollBy({
  left: direction * visibleCards * stride,
  behavior: motion.matches ? 'auto' : 'smooth'
});
```

`cardStride()` soma a largura real do primeiro item ao gap computado pelo CSS. O script não precisa repetir os valores de 138, 175 e 200 px. Dividir a largura visível por esse passo permite avançar aproximadamente uma tela, respeitando a unidade dos cards.

`scrollBy` é relativo à posição atual; `scrollTo` vai a uma posição absoluta e atende Home/End. O navegador limita os valores nas extremidades. O script compara `scrollLeft` com `scrollWidth - clientWidth` para desativar as setas nos limites, usando uma tolerância pequena para arredondamentos.

O evento de scroll também cobre toque e trackpad. `requestAnimationFrame` reúne atualizações visuais em um quadro, e `ResizeObserver` reage a mudanças no tamanho da lista. O aviso acessível espera a rolagem estabilizar para não anunciar cada pixel. Não existe autoplay.

## 11. `form.js`: validação e isolamento dos dois formulários

```javascript
document.querySelectorAll('[data-email-form]').forEach(form => {
  const input = form.querySelector('input[type="email"]');
  // Cada busca ocorre dentro do formulário atual.
});
```

`querySelectorAll` retorna os dois formulários. Fazer buscas dentro de cada um mantém input, erro e feedback associados: enviar o formulário do rodapé não altera o campo do hero. Uma única implementação atende os dois.

`validationMessage()` é responsável pela regra: retira espaços nas extremidades com `trim`, rejeita valor vazio, limita o tamanho e confere um padrão simples com arroba e domínio. A expressão é didática, não implementa todo o padrão de endereços internacionais e não verifica se a caixa postal existe.

No evento `submit`, `preventDefault()` interrompe o envio/navegação padrão. Se houver erro, ele vai para o span associado por `aria-describedby`, o campo recebe `aria-invalid` e volta a receber foco. No caso válido, a borda muda e o status anuncia explicitamente que nenhum cadastro foi criado.

O evento `blur` verifica o campo ao sair dele. `input` limpa feedback antigo e corrige um erro já exibido enquanto a pessoa edita. O script só ativa `noValidate` e habilita o botão depois de confirmar a presença de todos os elementos. Não há `fetch`, cookie ou `localStorage` neste fluxo.

## 12. `footer.css`: grade de links e reaproveitamento

O rodapé usa duas colunas como base e quatro a partir de 768 px. `minmax(0, 1fr)` e quebra de palavras evitam transbordamento em nomes longos. Os links possuem destinos reais; os internos apontam para IDs existentes e os externos abrem páginas oficiais com `noopener noreferrer`.

O segundo formulário reaproveita as classes do hero, mudando apenas a largura máxima. Isso evita que a mesma alteração precise ser feita em dois lugares. A identificação de projeto de estudo esclarece o alcance da interface sem simular recursos de conta, pagamento ou reprodução.

## 13. Onde alterar cada coisa

| Mudança | Arquivo | Relação que precisa ser preservada |
| --- | --- | --- |
| Cor principal ou margens | `variables.css` | Os componentes consomem tokens com `var()`. |
| Título, preço ou benefícios | `index.html` | Não confundir dados estáticos com informação atualizada em tempo real. |
| Novo cartaz | `index.html` + `assets/images/` | Alt descritivo e proporção da imagem. |
| Nova pergunta | `index.html` | IDs únicos e referências ARIA correspondentes. |
| Colunas dos benefícios | `reasons.css` | Conferir texto e ícone nas três larguras. |
| Regra de e-mail | `form.js` | Mensagem de erro, aria-invalid e feedback coerentes. |
| Distância das setas | `trending.js` | Medir os cards atuais, sem duplicar larguras do CSS. |

Os resultados concretos de testes e as verificações que não foram executadas estão em [validacao.md](validacao.md). A documentação diferencia comportamento implementado de comportamento efetivamente observado.
