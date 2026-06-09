import { useState } from 'react';
import styles from './CampoBusca.module.css';

export default function CampoBusca({ value, onChange, historico, onSalvar, onSelecionar, onRemover }) {
  const [focado, setFocado] = useState(false);

  const mostrarHistorico = focado && !value && historico.length > 0;

  function handleBlur() {
    onSalvar(value);
    setTimeout(() => setFocado(false), 150);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') onSalvar(value);
  }

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        type="text"
        placeholder="🔍  Buscar por título, local ou organizador..."
        value={value}
        onChange={onChange}
        onFocus={() => setFocado(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />

      {mostrarHistorico && (
        <div className={styles.dropdown}>
          <span className={styles.label}>Buscas recentes</span>
          {historico.map(termo => (
            <div key={termo} className={styles.item}>
              <button className={styles.itemBtn} onMouseDown={() => onSelecionar(termo)}>
                🕐 {termo}
              </button>
              <button className={styles.removerBtn} onMouseDown={() => onRemover(termo)}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
