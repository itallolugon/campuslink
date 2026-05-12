import { useState, useEffect } from 'react';
import Header from './components/Header';
import EventCard from './components/EventCard';
import Filtro from './components/Filtro';
import FormEvento from './components/FormEvento';
import MinhasInscricoes from './components/MinhasInscricoes';
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
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');

  useEffect(() => {
    localStorage.setItem('campuslink_eventos', JSON.stringify(eventos));
  }, [eventos]);

  useEffect(() => {
    localStorage.setItem('campuslink_inscritos', JSON.stringify(inscritos));
  }, [inscritos]);

  function handleInscrever(id) {
    setInscritos(prev => [...prev, id]);
  }

  function handleCancelar(id) {
    setInscritos(prev => prev.filter(i => i !== id));
  }

  function handleCadastrar(novoEvento) {
    setEventos(prev => [...prev, { ...novoEvento, id: Date.now() }]);
    setPagina('eventos');
  }

  const categorias = ['Todos', ...new Set(eventos.map(ev => ev.categoria))];

  const eventosFiltrados = eventos.filter(ev => {
    const matchCategoria = categoriaAtiva === 'Todos' || ev.categoria === categoriaAtiva;
    const matchBusca = ev.titulo.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
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
                placeholder="🔍  Buscar evento..."
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
                <span className={styles.count}>{eventosFiltrados.length} encontrado(s)</span>
              </div>

              {eventosFiltrados.length === 0 ? (
                <div className={styles.vazio}>
                  <p>Nenhum evento encontrado{busca ? ` para "${busca}"` : ''}.</p>
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
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {pagina === 'cadastrar' && (
          <FormEvento
            onCadastrar={handleCadastrar}
            onVoltar={() => setPagina('eventos')}
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
    </>
  );
}
