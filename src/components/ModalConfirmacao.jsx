import styles from './ModalConfirmacao.module.css';

export default function ModalConfirmacao({ mensagem, onConfirmar, onCancelar }) {
  return (
    <div className={styles.overlay} onClick={onCancelar}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <span className={styles.icone}>🗑️</span>
        <p className={styles.mensagem}>{mensagem}</p>
        <div className={styles.acoes}>
          <button className={styles.btnCancelar} onClick={onCancelar}>
            Cancelar
          </button>
          <button className={styles.btnConfirmar} onClick={onConfirmar}>
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
}
