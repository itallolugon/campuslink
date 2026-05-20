import { useState, useRef } from 'react';
import styles from './FormEvento.module.css';

const categoriasDisponiveis = [
  'Tecnologia', 'Engenharia', 'Direito', 'Saúde', 'Negócios', 'Arte & Cultura', 'Outro',
];

const formVazio = {
  titulo: '',
  descricao: '',
  data: '',
  horario: '',
  local: '',
  vagas: '',
  categoria: 'Tecnologia',
  organizador: '',
};

const hoje = new Date().toISOString().split('T')[0];

export default function FormEvento({ eventoInicial, onCadastrar, onVoltar }) {
  const valorInicial = eventoInicial
    ? { ...eventoInicial, vagas: String(eventoInicial.vagas) }
    : formVazio;

  const [form, setForm] = useState(valorInicial);
  const [erros, setErros] = useState({});
  const estadoOriginal = useRef(valorInicial);

  function estaAlterado() {
    return JSON.stringify(form) !== JSON.stringify(estadoOriginal.current);
  }

  function handleVoltar() {
    if (estaAlterado() && !window.confirm('Você tem alterações não salvas. Deseja sair sem salvar?')) return;
    onVoltar();
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (erros[name]) setErros(prev => ({ ...prev, [name]: '' }));
  }

  function validar() {
    const novos = {};
    if (!form.titulo.trim())      novos.titulo      = 'Título é obrigatório';
    if (!form.descricao.trim())   novos.descricao   = 'Descrição é obrigatória';
    if (!form.data) {
      novos.data = 'Data é obrigatória';
    } else if (!eventoInicial && form.data < hoje) {
      novos.data = 'A data do evento não pode ser no passado';
    }
    if (!form.horario)            novos.horario     = 'Horário é obrigatório';
    if (!form.local.trim())       novos.local       = 'Local é obrigatório';
    if (!form.vagas || Number(form.vagas) < 1) novos.vagas = 'Informe um número inteiro maior que 0';
    if (!form.organizador.trim()) novos.organizador = 'Organizador é obrigatório';
    return novos;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }
    onCadastrar({ ...form, vagas: Number(form.vagas) });
  }

  return (
    <div className={styles.container}>
      <button className={styles.btnVoltar} onClick={handleVoltar}>← Voltar para Eventos</button>

      <div className={styles.topo}>
        <h1 className={styles.titulo}>{eventoInicial ? 'Editar Evento' : 'Cadastrar Novo Evento'}</h1>
        <p className={styles.sub}>{eventoInicial ? 'Atualize os dados do evento.' : 'Preencha os dados para criar um evento acadêmico.'}</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.campo}>
          <label htmlFor="titulo">Título do Evento *</label>
          <input
            id="titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Ex: Semana de Tecnologia 2025"
            className={erros.titulo ? styles.inputErro : ''}
          />
          {erros.titulo && <span className={styles.erro}>{erros.titulo}</span>}
        </div>

        <div className={styles.campo}>
          <label htmlFor="descricao">Descrição *</label>
          <textarea
            id="descricao"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={3}
            placeholder="Descreva o evento, suas atividades e objetivos..."
            className={erros.descricao ? styles.inputErro : ''}
          />
          {erros.descricao && <span className={styles.erro}>{erros.descricao}</span>}
        </div>

        <div className={styles.linha}>
          <div className={styles.campo}>
            <label htmlFor="data">Data *</label>
            <input
              id="data"
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              min={!eventoInicial ? hoje : undefined}
              className={erros.data ? styles.inputErro : ''}
            />
            {erros.data && <span className={styles.erro}>{erros.data}</span>}
          </div>
          <div className={styles.campo}>
            <label htmlFor="horario">Horário *</label>
            <input
              id="horario"
              type="time"
              name="horario"
              value={form.horario}
              onChange={handleChange}
              className={erros.horario ? styles.inputErro : ''}
            />
            {erros.horario && <span className={styles.erro}>{erros.horario}</span>}
          </div>
        </div>

        <div className={styles.campo}>
          <label htmlFor="local">Local *</label>
          <input
            id="local"
            name="local"
            value={form.local}
            onChange={handleChange}
            placeholder="Ex: Auditório Principal — Bloco A"
            className={erros.local ? styles.inputErro : ''}
          />
          {erros.local && <span className={styles.erro}>{erros.local}</span>}
        </div>

        <div className={styles.linha}>
          <div className={styles.campo}>
            <label htmlFor="vagas">Número de Vagas *</label>
            <input
              id="vagas"
              type="number"
              name="vagas"
              value={form.vagas}
              onChange={handleChange}
              min="1"
              max="9999"
              placeholder="Ex: 50"
              className={erros.vagas ? styles.inputErro : ''}
            />
            {erros.vagas && <span className={styles.erro}>{erros.vagas}</span>}
          </div>
          <div className={styles.campo}>
            <label htmlFor="categoria">Categoria</label>
            <select id="categoria" name="categoria" value={form.categoria} onChange={handleChange}>
              {categoriasDisponiveis.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.campo}>
          <label htmlFor="organizador">Organizador *</label>
          <input
            id="organizador"
            name="organizador"
            value={form.organizador}
            onChange={handleChange}
            placeholder="Ex: Centro Acadêmico de ADS"
            className={erros.organizador ? styles.inputErro : ''}
          />
          {erros.organizador && <span className={styles.erro}>{erros.organizador}</span>}
        </div>

        <div className={styles.acoes}>
          <button type="button" className={styles.btnCancelar} onClick={handleVoltar}>
            Descartar
          </button>
          <button type="submit" className={styles.btnSalvar}>
            {eventoInicial ? 'Salvar Alterações' : 'Cadastrar Evento'}
          </button>
        </div>
      </form>
    </div>
  );
}
