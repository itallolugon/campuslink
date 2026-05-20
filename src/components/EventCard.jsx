import { useState } from 'react';
import styles from './EventCard.module.css';

export default function EventCard({ evento, inscrito, onInscrever, onCancelar, onEditar, onDeletar }) {
  const [expandido, setExpandido] = useState(false);

  const dataFormatada = new Date(evento.data + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className={`${styles.card} ${inscrito ? styles.inscrito : ''}`}>
      <div className={styles.top}>
        <span className={styles.categoria}>{evento.categoria}</span>
        {inscrito && <span className={styles.badge}>✓ Inscrito</span>}
      </div>

      <h3 className={styles.titulo}>{evento.titulo}</h3>

      <div className={styles.meta}>
        <span>📅 {dataFormatada} às {evento.horario}</span>
        <span>📍 {evento.local}</span>
        <span>👥 {evento.vagas} vagas</span>
      </div>

      <div className={`${styles.descricaoWrapper} ${expandido ? styles.aberto : ''}`}>
        <div className={styles.descricao}>
          <p>{evento.descricao}</p>
          <p className={styles.org}>Organizado por: <strong>{evento.organizador}</strong></p>
        </div>
      </div>

      <div className={styles.acoes}>
        <button
          className={styles.btnDetalhes}
          onClick={() => setExpandido(prev => !prev)}
        >
          {expandido ? 'Ocultar detalhes' : 'Ver detalhes'}
          <span className={`${styles.chevron} ${expandido ? styles.chevronAberto : ''}`}>›</span>
        </button>

        {inscrito ? (
          <button className={styles.btnCancelar} onClick={() => onCancelar(evento.id)}>
            Cancelar inscrição
          </button>
        ) : (
          <button className={styles.btnInscrever} onClick={() => onInscrever(evento.id)}>
            Inscrever-se
          </button>
        )}
      </div>

      {(onEditar || onDeletar) && (
        <div className={styles.acoesAdmin}>
          {onEditar && (
            <button className={styles.btnEditar} onClick={() => onEditar(evento)}>
              ✏️ Editar
            </button>
          )}
          {onDeletar && (
            <button className={styles.btnDeletar} onClick={() => onDeletar(evento.id)}>
              🗑️ Excluir
            </button>
          )}
        </div>
      )}
    </div>
  );
}
