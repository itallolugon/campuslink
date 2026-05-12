import styles from './Header.module.css';

const links = [
  { id: 'eventos', label: 'Eventos' },
  { id: 'cadastrar', label: 'Cadastrar Evento' },
  { id: 'inscricoes', label: 'Minhas Inscrições' },
];

export default function Header({ pagina, onNavegar, totalInscritos }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo} onClick={() => onNavegar('eventos')}>
          <span className={styles.logoIcon}>🎓</span>
          <span className={styles.logoText}>CampusLink</span>
        </div>
        <nav className={styles.nav}>
          {links.map(link => (
            <button
              key={link.id}
              className={`${styles.navLink} ${pagina === link.id ? styles.ativo : ''}`}
              onClick={() => onNavegar(link.id)}
            >
              {link.label}
              {link.id === 'inscricoes' && totalInscritos > 0 && (
                <span className={styles.badge}>{totalInscritos}</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
