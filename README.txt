# EcoMap SA — versão Web

Projeto adaptado do protótipo acadêmico do EcoMap para HTML + CSS + JavaScript, mantendo a proposta visual e a navegação das telas.

## Estrutura

- `index.html` — abertura / splash
- `pages/login.html` — Entrada pelo nome
- `pages/home.html` — Home
- `pages/mapa.html` — Mapa
- `pages/filtros.html` — Filtros
- `pages/local.html` — Detalhes do Ecoponto
- `pages/visita.html` — Registrar visita
- `pages/desafios.html` — Desafios / gamificação
- `pages/configuracoes.html` — Configurações
- `css/style.css` — todo o CSS
- `js/script.js` — interações JavaScript
- `assets/` — imagens extraídas do protótipo

## Como abrir no VS Code

1. Extraia a pasta.
2. Abra a pasta `ecomap_web` no VS Code.
3. Abra `index.html`.
4. Use o Live Server, se tiver instalado, ou abra o arquivo no navegador.
5. Para apresentar, comece pelo `index.html` e clique em `Entrar`.

## Observações

- Não há PHP nem banco de dados.
- A entrada é feita apenas pelo nome; o nome é salvo localmente no navegador para aparecer na Home. Registro de visita, filtros e missões são demonstrações front-end.
- O mapa é uma representação visual estilizada para o protótipo; a integração com mapa real pode ser adicionada depois.
- A fonte principal do protótipo é "More Sugar" e a secundária é Poppins. O CSS mantém a referência a More Sugar como identidade visual e carrega Poppins via Google Fonts quando houver internet.


## Fluxo de acesso da gamificação

O visitante continua entrando apenas com o nome e pode usar Home, Mapa e filtros sem cadastro.

Para recursos de gamificação — registrar visitas, ganhar XP, acompanhar pontos, nível e missões — é necessário criar uma conta ou fazer login. A página `pages/login.html` é a página única de autenticação desses recursos.

Nesta versão sem PHP/banco de dados, a autenticação é uma simulação front-end com `localStorage`, deixando a estrutura preparada para integração posterior com banco de dados.


## Mapa interativo — configuração necessária

A página do mapa foi preparada para usar a Google Maps JavaScript API, com estilo verde/roxo alinhado ao EcoMap, marcadores, busca, filtros por categoria, filtro por distância usando a localização do visitante, detalhes dos ecopontos e links de rota no Google Maps.

Para ativar o mapa:
1. Acesse https://console.cloud.google.com/google/maps-apis/overview e selecione/crie um projeto.
2. Configure faturamento e habilite a Maps JavaScript API.
3. Crie uma chave de API e restrinja-a ao(s) domínio(s) onde o site será executado e à Maps JavaScript API.
4. Abra js/mapa.js e substitua o valor COLE_SUA_CHAVE_API_AQUI na constante GOOGLE_MAPS_API_KEY.
5. Abra o site por um servidor local (por exemplo, Live Server no VS Code) ou publique em um domínio permitido. A localização do dispositivo normalmente exige HTTPS ou localhost.
6. Confira os endereços e horários atualizados no portal oficial do Semasa: https://portais.santoandre.sp.gov.br/semasa/residuos/estacoes-de-coleta/

Os três ecopontos iniciais são Vila Linda, Paraíso e Centro. As coordenadas dos marcadores são aproximadas para visualização e devem ser conferidas antes de uma publicação final. O link “Como chegar” pesquisa o endereço completo no Google Maps.
Os filtros de Eventos sustentáveis, Parques e Ciclovias também funcionam no mapa: cada um tem seus marcadores (balão verde com ícone próprio: calendário para eventos, árvore para parques e bicicleta para ciclovias), com as mesmas informações dos ecopontos (nome, endereço, horário, "Ver detalhes" e "Como chegar") e podem ser encontrados na barra de busca (por nome, endereço ou categoria, ex.: "parque", "bicicleta", "evento").
Para cadastrar mais locais, copie um bloco do array POINTS em js/mapa.js e troque os dados (category: "evento", "parque" ou "ciclovia"). As coordenadas dos novos locais são aproximadas: confira/ajuste clicando com o botão direito no local no Google Maps e copiando latitude e longitude. Eventos têm data: atualize o campo hours quando houver nova edição.


## Configurações

- Notificações: exibe um aviso no topo da tela ("Você não tem novas notificações.").
- Privacidade (LGPD), Ajuda (Central de Suporte) e Sobre (missão, visão e valores) abrem janelas sobrepostas, com fundo levemente escurecido. Fecham pelo botão ✕, pelo botão inferior, clicando fora ou com a tecla Esc.
- Tema: alterna entre modo claro (padrão) e modo escuro. A escolha fica salva no navegador (`localStorage`, chave `ecomapTheme`). O modo escuro é aplicado por `<html data-theme="dark">` e todas as regras ficam no final de `css/style.css`.
- Contatos da Ajuda (WhatsApp, Instagram e e-mail) são simbólicos; troque-os em `pages/configuracoes.html`.
- Sair: apaga os dados salvos pelo EcoMap no navegador (nome, login, tema, filtros e localização), volta ao modo claro e leva para a tela inicial (`index.html`).
- O ícone de notificações do topo da tela de Configurações exibe o mesmo aviso da linha "Notificações".
- O ícone de notificações do topo exibe o aviso em todas as telas que têm a barra superior.

## Gamificação

- A aba "Desafios" só aparece para quem tem cadastro/login na gamificação (`ecomapLoggedIn`). As páginas protegidas (Desafios e Registrar visita) levam ao login quando não há cadastro.
- Início: o cartão "Missão atual" pede o cadastro ("Se cadastre") e, depois do cadastro, mostra a próxima missão pendente, a barra e "n/3 concluídas" conforme as missões registradas.
- Desafios: pontos e barra começam zerados. Marque a missão concluída e toque em "Registrar missão" para pontuar (barra animada). "Detalhes" abre a janela da missão.
- Pontos: cada missão registrada vale 250 XP e cada visita 50 XP; o próximo nível é em 2.500 pontos. Ajuste em `js/script.js` (`MISSION_XP`, `VISIT_XP`, `LEVEL_GOAL`).
- O progresso fica em `ecomapProgress` (separado do nome): trocar o nome não apaga missões nem pontos. Só o botão Sair apaga tudo.
- Registrar visita usa o local escolhido no Mapa e mostra o aviso no topo; há um link "Voltar ao mapa" abaixo do botão.

## Ajustes finais

- Cabeçalho: o botão Sair (ícone de desligar) fica ao lado do sino de notificações em todas as telas, com a mesma função de antes. A linha "Sair" saiu das Configurações.
- Ícones: sino (notificações), cadeado (privacidade) e ícones novos no menu do celular (início, mapa, desafios e configurações).
- Configurações: quem tem cadastro vê "Alterar cadastro" (abre a tela de login/cadastro e volta às Configurações); visitante continua com "Trocar nome". Missões e pontos são mantidos.
- Registrar visita: a foto é do local escolhido no mapa (assets/locais/<id>.jpg, senão Street View do endereço, senão a imagem padrão). Veja assets/locais/LEIA-ME.txt.
- Início: as dicas são cards empilhados; cada clique/toque troca por outra dica aleatória do mesmo monte (4 dicas por monte).
