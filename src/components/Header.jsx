import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🎓</span>
          <span className={styles.logoText}>CampusLink</span>
        </div>
        <nav className={styles.nav}>
          <a href="#">Eventos</a>
          <a href="#">Minhas Inscrições</a>
          <a href="#">Sobre</a>
        </nav>
        <button className={styles.btnLogin}>Entrar</button>
      </div>
    </header>
  );
}
