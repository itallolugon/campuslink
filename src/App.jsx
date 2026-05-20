import { useState, useEffect } from 'react';
import Header from './components/Header';
import EventCard from './components/EventCard';
import Filtro from './components/Filtro';
import FormEvento from './components/FormEvento';
import MinhasInscricoes from './components/MinhasInscricoes';
import Toast from './components/Toast';
import ModalConfirmacao from './components/ModalConfirmacao';
import { eventosIniciais } from './data/eventos';
import styles from './App.module.css';

function carregarStorage(chave, fallback) {
  try {
    const salvo = localStorage.getItem(chave);
    return salvo ? JSON.parse(salvo) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [pagina, setPagina] = useState('eventos');
  const [eventos, setEventos] = useState(() => carregarStorage('campuslink_eventos', eventosIniciais));
  const [inscritos, setInscritos] = useState(() => carregarStorage('campuslink_inscritos', []));
  const [eventoEditando, setEventoEditando] = useState(null);
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [ordenacao, setOrdenacao] = useState('data');
  const [toast, setToast] = useState(null);
  const [confirmacaoDeletar, setConfirmacaoDeletar] = useState(null);
  const [temaEscuro, setTemaEscuro] = useState(
    () => localStorage.getItem('campuslink_tema') === 'escuro'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', temaEscuro ? 'dark' : '');
    localStorage.setItem('campuslink_tema', temaEscuro ? 'escuro' : 'claro');
  }, [temaEscuro]);

  useEffect(() => {
    localStorage.setItem('campuslink_eventos', JSON.stringify(eventos));
  }, [eventos]);

  useEffect(() => {
    localStorage.setItem('campuslink_inscritos', JSON.stringify(inscritos));
  }, [inscritos]);

  function mostrarToast(mensagem, tipo = 'sucesso') {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 3000);
  }

  function handleInscrever(id) {
    setInscritos(prev => [...prev, id]);
    mostrarToast('Inscrição realizada com sucesso!');
  }

  function handleCancelar(id) {
    setInscritos(prev => prev.filter(i => i !== id));
    mostrarToast('Inscrição cancelada.', 'info');
  }

  function handleEditar(evento) {
    setEventoEditando(evento);
    setPagina('cadastrar');
  }

  function handleDeletar(id) {
    setConfirmacaoDeletar(id);
  }

  function confirmarDeletar() {
    setEventos(prev => prev.filter(ev => ev.id !== confirmacaoDeletar));
    setInscritos(prev => prev.filter(i => i !== confirmacaoDeletar));
    setConfirmacaoDeletar(null);
    mostrarToast('Evento excluído.', 'info');
  }

  function handleCadastrar(dadosForm) {
    if (eventoEditando) {
      setEventos(prev => prev.map(ev =>
        ev.id === eventoEditando.id ? { ...dadosForm, id: eventoEditando.id } : ev
      ));
      setEventoEditando(null);
      mostrarToast('Evento atualizado com sucesso!');
    } else {
      setEventos(prev => [...prev, { ...dadosForm, id: Date.now() }]);
      mostrarToast('Evento cadastrado com sucesso!');
    }
    setPagina('eventos');
  }

  const categorias = ['Todos', ...new Set(eventos.map(ev => ev.categoria))];

  const eventosFiltrados = eventos
    .filter(ev => {
      const matchCategoria = categoriaAtiva === 'Todos' || ev.categoria === categoriaAtiva;
      const termo = busca.toLowerCase();
      const matchBusca = !termo ||
        ev.titulo.toLowerCase().includes(termo) ||
        ev.local.toLowerCase().includes(termo) ||
        ev.organizador.toLowerCase().includes(termo) ||
        ev.descricao.toLowerCase().includes(termo);
      return matchCategoria && matchBusca;
    })
    .sort((a, b) => {
      if (ordenacao === 'data') return new Date(a.data) - new Date(b.data);
      if (ordenacao === 'vagas') return b.vagas - a.vagas;
      return b.id - a.id;
    });

  const eventosInscritos = eventos.filter(ev => inscritos.includes(ev.id));

  return (
    <>
      <Header pagina={pagina} onNavegar={setPagina} totalInscritos={inscritos.length} />

      <main className={styles.main}>
        {pagina === 'eventos' && (
          <>
            <section className={styles.hero}>
              <h1 className={styles.heroTitle}>Eventos Acadêmicos</h1>
              <p className={styles.heroSub}>
                Encontre e inscreva-se nos melhores eventos da sua instituição.
              </p>
              <input
                className={styles.busca}
                type="text"
                placeholder="🔍  Buscar por título, local ou organizador..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </section>

            <section className={styles.stats}>
              <div className={styles.stat}>
                <strong>{eventos.length}</strong>
                <span>Eventos disponíveis</span>
              </div>
              <div className={styles.stat}>
                <strong>{inscritos.length}</strong>
                <span>Suas inscrições</span>
              </div>
              <div className={styles.stat}>
                <strong>{eventos.reduce((acc, ev) => acc + ev.vagas, 0)}</strong>
                <span>Vagas totais</span>
              </div>
            </section>

            <section className={styles.secao}>
              <div className={styles.secaoHeader}>
                <h2>Filtrar por categoria</h2>
              </div>
              <Filtro
                categorias={categorias}
                selecionada={categoriaAtiva}
                onSelecionar={setCategoriaAtiva}
              />
            </section>

            <section className={styles.secao}>
              <div className={styles.secaoHeader}>
                <h2>
                  {categoriaAtiva === 'Todos' ? 'Todos os Eventos' : categoriaAtiva}
                </h2>
                <div className={styles.controles}>
                  <span className={styles.count}>{eventosFiltrados.length} encontrado(s)</span>
                  <select
                    className={styles.ordenacaoSelect}
                    value={ordenacao}
                    onChange={e => setOrdenacao(e.target.value)}
                  >
                    <option value="data">Mais próximos</option>
                    <option value="recentes">Mais recentes</option>
                    <option value="vagas">Mais vagas</option>
                  </select>
                </div>
              </div>

              {eventosFiltrados.length === 0 ? (
                <div className={styles.vazio}>
                  <p>Nenhum evento encontrado{busca ? ` para "${busca}"` : ''}.</p>
                  {(busca || categoriaAtiva !== 'Todos') && (
                    <button
                      className={styles.btnLimpar}
                      onClick={() => { setBusca(''); setCategoriaAtiva('Todos'); }}
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.grid}>
                  {eventosFiltrados.map(ev => (
                    <EventCard
                      key={ev.id}
                      evento={ev}
                      inscrito={inscritos.includes(ev.id)}
                      onInscrever={handleInscrever}
                      onCancelar={handleCancelar}
                      onEditar={handleEditar}
                      onDeletar={handleDeletar}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {pagina === 'cadastrar' && (
          <FormEvento
            eventoInicial={eventoEditando}
            onCadastrar={handleCadastrar}
            onVoltar={() => { setEventoEditando(null); setPagina('eventos'); }}
          />
        )}

        {pagina === 'inscricoes' && (
          <MinhasInscricoes
            eventos={eventosInscritos}
            onCancelar={handleCancelar}
            onIrParaEventos={() => setPagina('eventos')}
          />
        )}
      </main>

      <footer className={styles.footer}>
        <p>CampusLink © 2025 · Desenvolvido por Itallo Lugon, Lorenzo Osorio, João Miguel e Kevin Kuznier</p>
      </footer>

      <button
        className={styles.btnTema}
        onClick={() => setTemaEscuro(prev => !prev)}
        title={temaEscuro ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      >
        {temaEscuro ? '☀' : '☾'}
      </button>

      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} />}

      {confirmacaoDeletar !== null && (
        <ModalConfirmacao
          mensagem="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
          onConfirmar={confirmarDeletar}
          onCancelar={() => setConfirmacaoDeletar(null)}
        />
      )}
    </>
  );
}
