import { useState } from 'react';
import Header from './components/Header';
import EventCard from './components/EventCard';
import Filtro from './components/Filtro';
import { eventos, categorias } from './data/eventos';
import styles from './App.module.css';

export default function App() {
  const [inscritos, setInscritos] = useState([]);
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');

  function handleInscrever(id) {
    setInscritos(prev => [...prev, id]);
  }

  function handleCancelar(id) {
    setInscritos(prev => prev.filter(i => i !== id));
  }

  const eventosFiltrados = eventos.filter(ev => {
    const matchCategoria = categoriaAtiva === 'Todos' || ev.categoria === categoriaAtiva;
    const matchBusca = ev.titulo.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  return (
    <>
      <Header />

      <main className={styles.main}>
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
              <p>Nenhum evento encontrado para "<strong>{busca}</strong>".</p>
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
      </main>

      <footer className={styles.footer}>
        <p>CampusLink © 2025 · Desenvolvido por Itallo Lugon, Lorenzo Osorio, João Miguel e Kevin Kuznier</p>
      </footer>
    </>
  );
}
