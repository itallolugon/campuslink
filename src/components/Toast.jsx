import styles from './Toast.module.css';

export default function Toast({ mensagem, tipo = 'sucesso' }) {
  return (
    <div className={`${styles.toast} ${styles[tipo]}`}>
      {mensagem}
    </div>
  );
}
