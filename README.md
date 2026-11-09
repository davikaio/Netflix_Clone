# Clone da landing page da Netflix Brasil

Projeto de estudo em **HTML, CSS e JavaScript puros**, com arquivos organizados por componente. Não usa framework, pacote de ícones, fonte externa nem etapa de build.

Esta é uma reprodução educacional de interface, sem vínculo com a Netflix. Os formulários fazem somente validação local: não enviam nem armazenam e-mails, não criam contas e não processam pagamentos. O botão Entrar e os links externos levam às páginas oficiais.

## Executar

Abra `index.html` no navegador ou inicie um servidor estático na pasta do projeto:

```powershell
python -m http.server 4174 --bind 127.0.0.1
```

No Windows, `py` pode substituir `python`. Depois, acesse [http://127.0.0.1:4174](http://127.0.0.1:4174). Encerre o servidor com `Ctrl+C`.

Não é necessário rodar `npm install`. Node.js é opcional e serve apenas para verificar a sintaxe dos scripts com `node --check`.

## Estrutura

```text
netflix-br-clone/
├── index.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── header.css
│   ├── hero.css
│   ├── trending.css
│   ├── reasons.css
│   ├── faq.css
│   └── footer.css
├── js/
│   ├── faq.js
│   ├── trending.js
│   └── form.js
├── assets/
│   ├── icons/
│   ├── images/
│   └── sources.json
├── docs/
│   ├── guia-tecnico.md
│   └── validacao.md
└── README.md
```

`assets/` guarda imagens locais; `docs/` contém a explicação técnica e o registro do que foi verificado. São os únicos acréscimos à estrutura pedida e dispensam infraestrutura externa em tempo de execução.

## O que está implementado

- Header com logotipo, idioma e link oficial Entrar.
- Hero com imagem responsiva, camadas de gradiente e formulário com label flutuante.
- Faixa de plano com destino oficial, sem simular contratação.
- Lista Top 10 com rolagem nativa, scroll-snap, números sobrepostos e setas.
- Quatro cards em Grid: uma coluna no celular, duas no tablet, quatro no desktop.
- FAQ com uma resposta aberta por vez, `aria-expanded`, controle de foco e animação de altura.
- Dois formulários independentes com a mesma lógica de validação.
- Rodapé com links em grade e identificação do projeto de estudo.
- Foco visível, skip link, textos alternativos e respeito a movimento reduzido.

A página está em português. O seletor de idioma contém apenas a opção implementada; não há uma tradução parcial ou uma troca de idioma fictícia.

## Entender o código

Leia o [guia técnico](docs/guia-tecnico.md) para acompanhar cada arquivo, os trechos centrais, o raciocínio de responsividade e a ligação entre HTML, CSS e eventos do JavaScript. Os comentários do código explicam decisões importantes em português.

O [registro de validação](docs/validacao.md) informa os testes realmente executados e seus limites.

## Referência visual e imagens

Referência consultada em **9 de novembro de 2026**: [Netflix Brasil](https://www.netflix.com/br/).

O preço e a seleção de títulos representam essa consulta. Não há integração com catálogo, API, conta ou preços em tempo real. As respostas do FAQ e os benefícios foram resumidos para este exercício; condições comerciais devem ser consultadas no serviço oficial.

O logotipo e as imagens foram obtidos dos assets públicos da página de referência, com origens registradas em [assets/sources.json](assets/sources.json). As imagens foram otimizadas localmente para WebP; o hero possui fallback JPEG. As marcas e obras continuam pertencendo aos respectivos titulares. O material está incluído como referência deste estudo e não como um conjunto de assets com licença aberta.

## Manutenção

- **Cores e margens:** altere `css/variables.css`.
- **Texto e conteúdo:** edite `index.html`.
- **Cartazes:** atualize cada `li.trending-item`, a imagem local e seu `alt`. O script lê a quantidade de itens no DOM.
- **FAQ:** mantenha IDs únicos entre pergunta e resposta e preserve `aria-controls`/`aria-labelledby` correspondentes.
- **Validação:** altere `validationMessage()` em `js/form.js`; uma validação de formato não verifica se o endereço existe.
- **Responsividade:** cada componente contém suas próprias media queries; o guia mostra os limites usados.

Os scripts são clássicos, com `defer` e escopos privados. A separação é por responsabilidade, sem exigir importações, servidor de aplicação ou ferramenta de compilação.

## Limites do projeto

O objetivo é estudar a landing page: não há autenticação, assinatura, reprodução de vídeos ou backend. Sem JavaScript, o conteúdo e a lista de cartazes continuam disponíveis e as respostas do FAQ ficam abertas; os formulários permanecem desativados com uma explicação visível.

Esta entrega é local. Não foram executados commit, push ou deploy.
