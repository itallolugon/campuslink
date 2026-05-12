import EventCard from './EventCard';
import styles from './MinhasInscricoes.module.css';

export default function MinhasInscricoes({ eventos, onCancelar, onIrParaEventos }) {
  return (
    <div className={styles.container}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Minhas Inscrições</h1>
        <p className={styles.sub}>
          {eventos.length > 0
            ? `Você está inscrito em ${eventos.length} evento(s).`
            : 'Você ainda não se inscreveu em nenhum evento.'}
        </p>
      </div>

      {eventos.length === 0 ? (
        <div className={styles.vazio}>
          <span className={styles.vazioIcone}>📋</span>
          <p className={styles.vazioTitulo}>Nenhuma inscrição encontrada</p>
          <p className={styles.vazioSub}>Explore os eventos disponíveis e garanta sua vaga!</p>
          <button className={styles.btnExplorar} onClick={onIrParaEventos}>
            Ver Eventos
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {eventos.map(ev => (
            <EventCard
              key={ev.id}
              evento={ev}
              inscrito={true}
              onInscrever={() => {}}
              onCancelar={onCancelar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
