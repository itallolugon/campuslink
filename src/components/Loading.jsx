import styles from './Loading.module.css';

export default function Loading({ mensagem = 'Carregando...' }) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <p className={styles.mensagem}>{mensagem}</p>
    </div>
  );
}
