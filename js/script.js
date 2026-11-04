/* Tema claro/escuro: aplicado o quanto antes; o modo claro é o padrão */
const ECOMAP_THEME_KEY = 'ecomapTheme';
(function () {
  let theme = 'light';
  try { if (localStorage.getItem(ECOMAP_THEME_KEY) === 'dark') theme = 'dark'; } catch (e) {}
  document.documentElement.setAttribute('data-theme', theme);
})();

/* Gamificação: só quem tem cadastro vê a aba "Desafios" e acessa as páginas protegidas */
(function () {
  let gamer = false;
  try { gamer = localStorage.getItem('ecomapLoggedIn') === 'true'; } catch (e) {}
  document.documentElement.setAttribute('data-gamer', gamer ? 'true' : 'false');
  if (!gamer && document.body && document.body.hasAttribute('data-protected')) {
    const page = location.pathname.split('/').pop() || '';
    const returnTo = /^[a-zA-Z0-9_-]+\.html$/.test(page) ? '?returnTo=' + page : '';
    location.replace('login.html' + returnTo);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // Destaca automaticamente a aba correspondente à tela atual no menu inferior.
  // As telas de detalhes e registro de visita pertencem à seção Mapa.
  const currentPage = (location.pathname.split('/').pop() || 'home.html').toLowerCase();
  const activePage = ['visita.html', 'local.html'].includes(currentPage) ? 'mapa.html' : currentPage;
  document.querySelectorAll('.bottom-nav a').forEach(link => {
    const targetPage = (link.getAttribute('href') || '').split('?')[0].toLowerCase();
    const isActive = targetPage === activePage;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  let ecoNotify = null; /* mostra o pop up de aviso (definido mais abaixo) */

  document.querySelectorAll('[data-go]').forEach(btn => {
    btn.addEventListener('click', () => location.href = btn.dataset.go);
  });

  document.querySelectorAll('.toggle:not([data-theme-toggle])').forEach(toggle => {
    toggle.addEventListener('click', () => toggle.classList.toggle('off'));
  });

  document.querySelectorAll('[data-check]').forEach(item => {
    item.addEventListener('click', () => {
      if (item.dataset.locked === 'true') return;
      item.classList.toggle('done');
      item.textContent = item.classList.contains('done') ? '✓' : '';
    });
  });

  const login = document.querySelector('#loginForm');
  if (login) {
    login.addEventListener('submit', e => {
      e.preventDefault();

      const nameInput = document.querySelector('#userName');
      const name = nameInput.value.trim();

      if (!name) return;

      localStorage.setItem('ecomapUserName', name);
      window.location.href = 'home.html';
    });
  }

  const userNameElement = document.querySelector('#userNameDisplay');
  if (userNameElement) {
    const savedName = localStorage.getItem('ecomapUserName');
    userNameElement.textContent = savedName || 'Felipe';
  }

  const accountLogin = document.querySelector('#accountLoginForm');
  if (accountLogin) {
    accountLogin.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.querySelector('#accountEmail').value.trim();
      const password = document.querySelector('#accountPassword').value;
      if (!email || !password) return;
      localStorage.setItem('ecomapLoggedIn', 'true');
      const returnTo = new URLSearchParams(window.location.search).get('returnTo');
      window.location.href = (returnTo && /^[a-zA-Z0-9_-]+\.html$/.test(returnTo)) ? returnTo : 'desafios.html';
    });
  }

  const accountRegister = document.querySelector('#accountRegisterForm');
  if (accountRegister) {
    accountRegister.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.querySelector('#accountName').value.trim();
      const email = document.querySelector('#registerEmail').value.trim();
      const password = document.querySelector('#registerPassword').value;
      const confirm = document.querySelector('#registerConfirm').value;
      if (!name || !email || !password || !confirm) return;
      if (password !== confirm) {
        alert('As senhas não conferem.');
        return;
      }
      localStorage.setItem('ecomapUserName', name);
      localStorage.setItem('ecomapLoggedIn', 'true');
      const returnTo = new URLSearchParams(window.location.search).get('returnTo');
      window.location.href = (returnTo && /^[a-zA-Z0-9_-]+\.html$/.test(returnTo)) ? returnTo : 'desafios.html';
    });
  }

  document.querySelectorAll('[data-auth-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-auth-tab]').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.querySelector(tab.dataset.authTab);
      if (panel) panel.classList.add('active');
    });
  });

  if (new URLSearchParams(window.location.search).get('tab') === 'register') {
    const registerTab = document.querySelector('[data-auth-tab="#accountRegisterPanel"]');
    if (registerTab) registerTab.click();
  }

  document.querySelectorAll('[data-alert]').forEach(btn => {
    btn.addEventListener('click', () => alert(btn.dataset.alert));
  });
  /* ---------- Configurações: tema claro/escuro ---------- */
  const themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    const themeIcon = document.querySelector('[data-theme-icon]');
    const syncThemeToggle = () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeToggle.classList.toggle('off', !dark);
      themeToggle.setAttribute('aria-checked', String(dark));
      if (themeIcon) themeIcon.textContent = dark ? '☾' : '☀';
    };
    themeToggle.addEventListener('click', () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = dark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem(ECOMAP_THEME_KEY, next); } catch (e) {}
      syncThemeToggle();
    });
    syncThemeToggle();
  }

  /* ---------- Configurações: aviso de notificações (pop up no topo) ---------- */
  const toast = document.getElementById('ecoToast');
  if (toast) {
    const toastTitle = toast.querySelector('[data-toast-title]');
    const toastText = toast.querySelector('[data-toast-text]');
    let toastTimer = null;
    let toastClearTimer = null;
    const hideToast = () => {
      toast.classList.remove('is-visible');
      clearTimeout(toastTimer);
      clearTimeout(toastClearTimer);
      toastClearTimer = setTimeout(() => {
        toastTitle.textContent = '';
        toastText.textContent = '';
      }, 400);
    };
    const showToast = (title, message) => {
      clearTimeout(toastTimer);
      clearTimeout(toastClearTimer);
      toastTitle.textContent = title;
      toastText.textContent = message;
      toast.classList.add('is-visible');
      toastTimer = setTimeout(hideToast, 3800);
    };
    ecoNotify = showToast;
    toast.addEventListener('click', hideToast);
    document.querySelectorAll('[data-notify]').forEach(item => {
      const trigger = () => showToast('Notificações', item.dataset.notify);
      item.addEventListener('click', trigger);
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
      });
    });
  }

  /* ---------- Configurações: janelas (Privacidade, Ajuda, Sobre) ---------- */
  const modals = document.querySelectorAll('.eco-modal');
  if (modals.length) {
    let openModal = null;
    let lastFocus = null;
    const focusableSelector = 'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

    const closeModal = () => {
      if (!openModal) return;
      openModal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
      openModal = null;
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
      lastFocus = null;
    };
    const openModalById = (id, opener) => {
      const modal = document.getElementById(id);
      if (!modal) return;
      if (openModal) closeModal();
      lastFocus = opener || document.activeElement;
      openModal = modal;
      modal.classList.add('is-open');
      document.body.classList.add('modal-open');
      const panel = modal.querySelector('.eco-modal-panel');
      if (panel) panel.scrollTop = 0;
      const closeBtn = modal.querySelector('[data-modal-close]');
      if (closeBtn) closeBtn.focus();
    };

    document.querySelectorAll('[data-modal-open]').forEach(item => {
      item.addEventListener('click', () => openModalById(item.dataset.modalOpen, item));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModalById(item.dataset.modalOpen, item); }
      });
    });
    modals.forEach(modal => {
      modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
      modal.querySelectorAll('[data-modal-close]').forEach(btn => btn.addEventListener('click', closeModal));
    });
    document.addEventListener('keydown', e => {
      if (!openModal) return;
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key !== 'Tab') return;
      const items = Array.from(openModal.querySelectorAll(focusableSelector)).filter(el => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  /* ---------- Gamificação: missões, pontos e visitas ---------- */
  const PROGRESS_KEY = 'ecomapProgress';
  const LEVEL_GOAL = 2500;   /* pontos para o próximo nível */
  const MISSION_XP = 250;    /* pontos por missão registrada */
  const VISIT_XP = 50;       /* pontos por visita registrada */
  const MISSIONS = [
    { id: 'garrafas', title: 'Reciclar 3 garrafas plásticas' },
    { id: 'reutilizar', title: 'Reutilizar pelo menos 1 item' },
    { id: 'descartaveis', title: 'Não utilizar descartáveis por 3 dias' }
  ];
  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const isGamer = () => { try { return localStorage.getItem('ecomapLoggedIn') === 'true'; } catch (e) { return false; } };
  const fmt = n => Number(n).toLocaleString('pt-BR');
  /* O progresso fica separado do nome: trocar o nome não apaga missões nem pontos. */
  const readProgress = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null');
      if (saved && typeof saved === 'object') {
        return {
          missions: (saved.missions && typeof saved.missions === 'object') ? saved.missions : {},
          points: Number(saved.points) || 0,
          visits: Number(saved.visits) || 0
        };
      }
    } catch (e) {}
    return { missions: {}, points: 0, visits: 0 };
  };
  const saveProgress = progress => { try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch (e) {} };
  const setBar = (bar, pct, animate) => {
    const value = Math.max(0, Math.min(100, pct));
    if (animate && !reduceMotion) {
      bar.style.transition = 'width 1.2s ease';
      void bar.offsetWidth;
    } else {
      bar.style.transition = 'none';
    }
    bar.style.width = value + '%';
  };
  const countUp = (from, to, render) => {
    if (reduceMotion || from === to) { render(to); return; }
    const duration = 1200;
    const start = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - start) / duration);
      render(Math.round(from + (to - from) * t));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* Tela inicial: ligar o botão de visita ao cadastro ou à página de visita */
  document.querySelectorAll('a[href="login.html?returnTo=visita.html"]').forEach(link => {
    if (!isGamer()) return;
    link.setAttribute('href', 'visita.html');
    link.textContent = 'Registrar visita';
  });

  /* Configurações: quem já tem cadastro vê "Alterar cadastro" (abre a tela de login) */
  const accountLink = document.getElementById('settingsAccountLink');
  if (accountLink && isGamer()) {
    accountLink.setAttribute('href', 'login.html?returnTo=configuracoes.html&tab=register');
    accountLink.querySelector('strong').textContent = 'Alterar cadastro';
    accountLink.querySelector('.setting-main span').textContent = 'Atualizar os dados do seu cadastro';
  }
  const accountNameField = document.getElementById('accountName');
  if (accountNameField && isGamer()) {
    try { accountNameField.value = localStorage.getItem('ecomapUserName') || ''; } catch (e) {}
  }

  /* Início: cartão da missão atual */
  const missionBar = document.getElementById('missionBar');
  if (missionBar) {
    const missionTitle = document.getElementById('missionTitle');
    const missionLabel = document.getElementById('missionLabel');
    const missionBtn = document.getElementById('homeMissionBtn');
    if (!isGamer()) {
      missionTitle.textContent = 'Cadastre-se para jogar e completar missões!';
      missionLabel.textContent = '0/' + MISSIONS.length + ' concluídas';
      setBar(missionBar, 0, false);
      missionBtn.textContent = 'Se cadastre';
      missionBtn.setAttribute('href', 'login.html?returnTo=home.html&tab=register');
    } else {
      const progress = readProgress();
      const done = MISSIONS.filter(m => progress.missions[m.id]).length;
      const pending = MISSIONS.find(m => !progress.missions[m.id]);
      missionTitle.textContent = pending ? pending.title : 'Todas as missões concluídas!';
      missionLabel.textContent = done + '/' + MISSIONS.length + ' concluídas';
      missionBtn.textContent = 'Ver missões';
      missionBtn.setAttribute('href', 'desafios.html');
      setBar(missionBar, 0, false);
      void missionBar.offsetWidth;
      setBar(missionBar, (done / MISSIONS.length) * 100, true);
    }
  }

  /* Desafios: pontos, barra e registro das missões */
  const registerMission = document.getElementById('registerMission');
  if (registerMission) {
    const levelPoints = document.getElementById('levelPoints');
    const levelGoal = document.getElementById('levelGoal');
    const levelBar = document.getElementById('levelBar');
    const rows = Array.from(document.querySelectorAll('[data-mission]'));
    const showPoints = value => {
      levelPoints.textContent = fmt(value);
      levelGoal.textContent = fmt(value) + ' / ' + fmt(LEVEL_GOAL);
    };
    const renderMissions = (progress, animate, fromPoints) => {
      rows.forEach(row => {
        const id = row.dataset.mission;
        const check = row.querySelector('[data-check]');
        const done = !!progress.missions[id];
        if (done) {
          check.classList.add('done');
          check.textContent = '✓';
          check.dataset.locked = 'true';
        } else {
          delete check.dataset.locked;
        }
        document.querySelectorAll('[data-mission-status="' + id + '"]').forEach(el => {
          el.textContent = done ? 'Concluída ✓' : 'Pendente';
        });
      });
      setBar(levelBar, (progress.points / LEVEL_GOAL) * 100, animate);
      if (animate) countUp(fromPoints, progress.points, showPoints);
      else showPoints(progress.points);
    };
    renderMissions(readProgress(), false, 0);

    registerMission.addEventListener('click', e => {
      e.preventDefault();
      const progress = readProgress();
      const selected = rows.filter(row =>
        row.querySelector('[data-check]').classList.contains('done') && !progress.missions[row.dataset.mission]);
      if (!selected.length) {
        const allDone = MISSIONS.every(m => progress.missions[m.id]);
        if (ecoNotify) {
          ecoNotify('Registrar missão', allDone
            ? 'Você já registrou todas as missões da semana.'
            : 'Selecione a missão que você concluiu antes de registrar.');
        }
        return;
      }
      const before = progress.points;
      const gained = selected.length * MISSION_XP;
      selected.forEach(row => { progress.missions[row.dataset.mission] = true; });
      progress.points += gained;
      saveProgress(progress);
      renderMissions(progress, true, before);
      const allDone = MISSIONS.every(m => progress.missions[m.id]);
      const title = MISSIONS.find(m => m.id === selected[0].dataset.mission).title;
      const text = selected.length === 1
        ? 'Você concluiu “' + title + '” e ganhou +' + gained + ' XP.'
        : 'Você concluiu ' + selected.length + ' missões e ganhou +' + gained + ' XP.';
      if (ecoNotify) ecoNotify('Missão registrada!', text + (allDone ? ' Todas as missões da semana concluídas!' : ''));
    });
  }

  /* Registrar visita: foto do local, pontos e aviso (usa o local escolhido no mapa) */
  const getSelectedPoint = () => {
    try {
      const index = JSON.parse(localStorage.getItem('ecomapPointsIndex') || '[]');
      const selectedId = localStorage.getItem('ecomapSelectedPoint');
      return index.find(p => p.id === selectedId) || null;
    } catch (e) { return null; }
  };
  const visitPhoto = document.getElementById('visitPhoto');
  const visitPlaceName = document.getElementById('visitPlaceName');
  const visitPlaceCategory = document.getElementById('visitPlaceCategory');
  const photoPoint = getSelectedPoint();
  if (photoPoint) {
    if (visitPlaceName) visitPlaceName.textContent = photoPoint.name || 'Local selecionado';
    if (visitPlaceCategory) {
      const labels = { ecoponto: 'Ecoponto', parque: 'Parque', ciclovia: 'Ciclovia', evento: 'Evento' };
      visitPlaceCategory.textContent = labels[photoPoint.category] || 'Local sustentável';
    }
  }
  if (visitPhoto) {
    // Oculta a imagem padrão enquanto a foto específica do local é carregada.
    visitPhoto.style.visibility = 'hidden';
    if (photoPoint && /^[a-z0-9-]+$/.test(photoPoint.id)) {
      // Prioriza uma foto cadastrada para este local; em seguida, usa o Street View
      // gerado com as coordenadas específicas do ponto (não uma imagem fixa da Vila Linda).
      const sources = ['jpg', 'jpeg', 'png', 'webp'].map(ext => '../assets/locais/' + photoPoint.id + '.' + ext);
      if (photoPoint.photo) sources.push(photoPoint.photo);
      const tryPhoto = list => {
        if (!list.length) {
          // Não deixa a imagem genérica da Vila Linda aparecer como se fosse outro local.
          visitPhoto.style.display = 'none';
          return;
        }
        const probe = new Image();
        probe.onload = () => {
          visitPhoto.src = probe.src;
          visitPhoto.alt = 'Foto de ' + (photoPoint.name || 'local selecionado');
          visitPhoto.style.display = '';
          visitPhoto.style.visibility = 'visible';
        };
        probe.onerror = () => tryPhoto(list.slice(1));
        probe.src = list[0];
      };
      tryPhoto(sources);
    } else {
      visitPhoto.style.display = 'none';
    }
  }
  const registerVisit = document.getElementById('registerVisit');
  if (registerVisit) {
    registerVisit.addEventListener('click', () => {
      const point = getSelectedPoint();
      if (!point) {
        if (ecoNotify) ecoNotify('Registrar visita', 'Escolha um ecoponto, parque, ciclovia ou evento no mapa para registrar sua visita.');
        return;
      }
      const progress = readProgress();
      progress.points += VISIT_XP;
      progress.visits += 1;
      saveProgress(progress);
      if (ecoNotify) ecoNotify('Visita registrada!', 'Sua presença em ' + point.name + ' foi registrada. Obrigado por contribuir com o EcoMap!');
    });
  }

  /* Início: dicas em cards; cada toque troca por outra dica aleatória do mesmo monte */
  const TIPS = [
    [
      { t: 'Reduza, Reutilize, Recicle', d: 'Saiba como reduzir seu impacto no meio ambiente.' },
      { t: 'Separe o lixo reciclável', d: 'Mantenha papel, plástico, vidro e metal limpos e secos.' },
      { t: 'Compre só o necessário', d: 'Consumir menos gera menos resíduos para descartar.' },
      { t: 'Dê vida nova aos objetos', d: 'Potes viram porta-objetos e roupas viram panos de limpeza.' }
    ],
    [
      { t: 'Evite descartáveis', d: 'Prefira itens reutilizáveis no dia a dia.' },
      { t: 'Leve sua ecobag', d: 'Uma sacola reutilizável evita muitas sacolas plásticas.' },
      { t: 'Use sua garrafa e seu copo', d: 'Reduz o uso de copos e garrafas de uso único.' },
      { t: 'Diga não ao canudo', d: 'Recuse canudos e talheres descartáveis desnecessários.' }
    ],
    [
      { t: 'Dê um novo destino', d: 'Encontre pontos de coleta próximos de você.' },
      { t: 'Pilhas e eletrônicos', d: 'Não vão no lixo comum: leve a pontos de coleta próprios.' },
      { t: 'Óleo de cozinha', d: 'Guarde em garrafa PET fechada e leve a um ponto de coleta.' },
      { t: 'Doe o que não usa mais', d: 'Roupas, livros e móveis em bom estado ajudam outras pessoas.' }
    ]
  ];
  document.querySelectorAll('[data-tips]').forEach(card => {
    const pile = TIPS[Number(card.dataset.tips)];
    if (!pile) return;
    const title = card.querySelector('h3');
    const text = card.querySelector('p');
    let current = 0;
    let turning = false;
    const nextTip = () => {
      if (turning) return;
      let next;
      do { next = Math.floor(Math.random() * pile.length); } while (next === current && pile.length > 1);
      const apply = () => { current = next; title.textContent = pile[next].t; text.textContent = pile[next].d; };
      if (reduceMotion) { apply(); return; }
      turning = true;
      card.classList.add('is-turning');
      setTimeout(() => {
        apply();
        card.classList.remove('is-turning');
        setTimeout(() => { turning = false; }, 200);
      }, 200);
    };
    card.addEventListener('click', nextTip);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nextTip(); }
    });
  });

  /* ---------- Configurações: Sair (reseta e volta para a tela inicial) ---------- */
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', () => {
      try {
        Object.keys(localStorage)
          .filter(key => key.indexOf('ecomap') === 0)
          .forEach(key => localStorage.removeItem(key));
      } catch (e) {}
      document.documentElement.setAttribute('data-theme', 'light');
      window.location.href = '../index.html';
    });
  });
});
