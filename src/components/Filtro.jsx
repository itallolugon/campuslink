import styles from './Filtro.module.css';

export default function Filtro({ categorias, selecionada, onSelecionar }) {
  return (
    <div className={styles.filtro}>
      {categorias.map(cat => (
        <button
          key={cat}
          className={`${styles.btn} ${selecionada === cat ? styles.ativo : ''}`}
          onClick={() => onSelecionar(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
