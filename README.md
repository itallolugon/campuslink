# 🎓 CampusLink

Plataforma web para inscrição em eventos acadêmicos, desenvolvida como trabalho prático da disciplina de Desenvolvimento Web — UNICESUSC 2025.

## 📋 Sobre o Projeto

A **CampusLink** resolve um problema real de instituições de ensino: a falta de uma plataforma centralizada para divulgação e inscrição em eventos acadêmicos (palestras, workshops, semanas acadêmicas, hackathons, etc.).

**Usuários-alvo:** Estudantes de graduação e organizadores de eventos acadêmicos.

## 👥 Grupo

| Nome | GitHub |
|---|---|
| Itallo Lugon | [@itallolugon](https://github.com/itallolugon) |
| Lorenzo Osorio | [@LorenzoOsorioGS](https://github.com/LorenzoOsorioGS) |
| João Miguel  | [@Joao1395271](https://github.com/Joao1395271) |
| Kevin Kuznier | [@Kev3333](https://github.com/Kev3333) |

## 🚀 Como rodar

```bash
git clone https://github.com/itallolugon/campuslink.git
cd campuslink
npm install
npm run dev
```

Acesse: `http://localhost:5173`

## 🛠️ Tecnologias

- [React.js](https://react.dev/) com [Vite](https://vitejs.dev/)
- CSS Modules
- JavaScript (ES6+)

## 📁 Estrutura

```
src/
├── components/
│   ├── Header.jsx        # Cabeçalho da aplicação
│   ├── EventCard.jsx     # Card de evento com estado e eventos
│   └── Filtro.jsx        # Filtro de categorias
├── data/
│   └── eventos.js        # Dados mockados dos eventos
├── App.jsx               # Componente raiz
└── main.jsx              # Entry point
```

## ✅ Sprint 1 — Funcionalidades implementadas

- [x] Listagem de eventos acadêmicos
- [x] Busca por nome de evento (estado + evento onChange)
- [x] Filtro por categoria (estado + evento onClick)
- [x] Inscrição e cancelamento de inscrição (estado + evento onClick)
- [x] Expansão de detalhes do evento (estado local no componente)
- [x] Contador de inscrições em tempo real

---

> Trabalho Prático — Disciplina de Desenvolvimento Web · UNICESUSC 2025

---

## Relatório — Sprint N2

**Disciplina:** Desenvolvimento de Sistemas  
**Curso:** Análise e Desenvolvimento de Sistemas  
**Instituição:** UNICESUSC  
**Grupo:** Itallo Lugon, Lorenzo Osorio, João Miguel e Kevin Kuznier  
**Aplicativo:** CampusLink — Plataforma de Eventos Acadêmicos  
**Data:** Maio de 2025

---

### 1. Tema e Objetivo do Aplicativo

O **CampusLink** é um mini aplicativo web desenvolvido em React que centraliza os eventos acadêmicos de uma instituição de ensino. O objetivo é permitir que alunos visualizem, filtrem, se inscrevam e acompanhem eventos como palestras, workshops, hackathons e jornadas acadêmicas, tudo em uma interface simples e responsiva.

---

### 2. Funcionalidades Implementadas

#### 2.1 Menu de Navegação com 3 Páginas

A navegação é gerenciada por um estado `pagina` no `App.jsx`, sem necessidade de bibliotecas externas de roteamento. O componente `Header` recebe as props `pagina` e `onNavegar` e renderiza três botões funcionais:

- **Eventos** — listagem completa com busca e filtro por categoria
- **Cadastrar Evento** — formulário para adicionar novos eventos
- **Minhas Inscrições** — página pessoal com os eventos em que o usuário se inscreveu

```jsx
// App.jsx
const [pagina, setPagina] = useState('eventos');

{pagina === 'eventos'    && <PaginaEventos ... />}
{pagina === 'cadastrar'  && <FormEvento ... />}
{pagina === 'inscricoes' && <MinhasInscricoes ... />}
```

#### 2.2 Formulário Controlado com useState

O componente `FormEvento.jsx` implementa um formulário totalmente controlado com 8 campos gerenciados por um único `useState`:

| Campo | Tipo |
|---|---|
| Título | text |
| Descrição | textarea |
| Data | date |
| Horário | time |
| Local | text |
| Número de Vagas | number |
| Categoria | select |
| Organizador | text |

```jsx
// FormEvento.jsx
const [form, setForm] = useState({
  titulo: '', descricao: '', data: '', horario: '',
  local: '', vagas: '', categoria: 'Tecnologia', organizador: '',
});

function handleChange(e) {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
}
```

O formulário inclui validação: campos obrigatórios são verificados antes do envio, com mensagens de erro exibidas individualmente por campo.

#### 2.3 Listagem Dinâmica dos Itens Cadastrados

Os eventos cadastrados via formulário são adicionados ao estado global `eventos` no `App.jsx` e aparecem imediatamente na página de listagem sem necessidade de recarregar. As categorias dos novos eventos surgem automaticamente nos filtros, pois são calculadas dinamicamente:

```jsx
// App.jsx
function handleCadastrar(novoEvento) {
  setEventos(prev => [...prev, { ...novoEvento, id: Date.now() }]);
  setPagina('eventos');
}

const categorias = ['Todos', ...new Set(eventos.map(ev => ev.categoria))];
```

#### 2.4 Persistência com localStorage

Os dados de eventos e inscrições são persistidos no `localStorage` do navegador via `useEffect`. Ao recarregar a página, os dados são recuperados automaticamente:

```jsx
// App.jsx — carregamento inicial
const [eventos, setEventos] = useState(
  () => carregarStorage('campuslink_eventos', eventosIniciais)
);
const [inscritos, setInscritos] = useState(
  () => carregarStorage('campuslink_inscritos', [])
);

// Salvamento automático a cada mudança
useEffect(() => {
  localStorage.setItem('campuslink_eventos', JSON.stringify(eventos));
}, [eventos]);

useEffect(() => {
  localStorage.setItem('campuslink_inscritos', JSON.stringify(inscritos));
}, [inscritos]);
```

#### 2.5 CRUD Completo de Eventos

Além do cadastro, a aplicação implementa edição e exclusão de eventos, completando o ciclo CRUD.

**Edição (Update):** um estado `eventoEditando` guarda o evento selecionado. O `FormEvento` recebe o prop `eventoInicial`, pré-preenche os campos e adapta título e botão conforme o modo:

```jsx
// App.jsx
const [eventoEditando, setEventoEditando] = useState(null);

function handleEditar(evento) {
  setEventoEditando(evento);
  setPagina('cadastrar');
}

function handleCadastrar(dadosForm) {
  if (eventoEditando) {
    setEventos(prev => prev.map(ev =>
      ev.id === eventoEditando.id ? { ...dadosForm, id: eventoEditando.id } : ev
    ));
    setEventoEditando(null);
  } else {
    setEventos(prev => [...prev, { ...dadosForm, id: Date.now() }]);
  }
  setPagina('eventos');
}
```

**Exclusão (Delete):** remove o evento e cancela automaticamente qualquer inscrição vinculada:

```jsx
function handleDeletar(id) {
  setEventos(prev => prev.filter(ev => ev.id !== id));
  setInscritos(prev => prev.filter(i => i !== id));
}
```

Os botões de editar/excluir aparecem apenas na listagem principal. Na página "Minhas Inscrições" o `EventCard` é usado sem esses props, então o usuário vê apenas as ações de inscrição:

```jsx
// EventCard.jsx
{(onEditar || onDeletar) && (
  <div className={styles.acoesAdmin}>
    {onEditar && <button onClick={() => onEditar(evento)}>✏️ Editar</button>}
    {onDeletar && <button onClick={() => onDeletar(evento.id)}>🗑️ Excluir</button>}
  </div>
)}
```

**Resumo do CRUD:**

| Operação | Função | Local |
|---|---|---|
| **Create** | `handleCadastrar` (sem `eventoEditando`) | `App.jsx` |
| **Read** | `carregarStorage` + `useEffect` | `App.jsx` |
| **Update** | `handleCadastrar` (com `eventoEditando`) | `App.jsx` |
| **Delete** | `handleDeletar` | `App.jsx` |

#### 2.6 Componentes em Arquivos .jsx Separados

O projeto possui 5 componentes independentes:

| Componente | Responsabilidade |
|---|---|
| `Header.jsx` | Navegação entre páginas |
| `EventCard.jsx` | Card individual de evento com inscrição/cancelamento/edição/exclusão |
| `Filtro.jsx` | Botões de filtro por categoria |
| `FormEvento.jsx` | Formulário controlado de cadastro e edição |
| `MinhasInscricoes.jsx` | Página de inscrições do usuário |

---

### 3. Organização dos Arquivos

```
src/
├── components/
│   ├── Header.jsx
│   ├── Header.module.css
│   ├── EventCard.jsx
│   ├── EventCard.module.css
│   ├── Filtro.jsx
│   ├── Filtro.module.css
│   ├── FormEvento.jsx
│   ├── FormEvento.module.css
│   ├── MinhasInscricoes.jsx
│   └── MinhasInscricoes.module.css
├── data/
│   └── eventos.js
├── App.jsx
├── App.module.css
└── index.css
```

---

### 4. Tecnologias Utilizadas

- **React 19** com Hooks (`useState`, `useEffect`)
- **Vite 8** como bundler e servidor de desenvolvimento
- **CSS Modules** para estilização com escopo por componente
- **localStorage** para persistência de dados no navegador
- **Google Fonts** (Syne + DM Sans)

---

### 5. Dificuldades e Aprendizados

**Dificuldades encontradas:**
- Gerenciar o estado global de eventos e inscrições em um único componente (`App.jsx`) e passar as funções corretas para cada página via props.
- Implementar a validação do formulário campo a campo sem duplicar lógica.
- Garantir que as categorias dos filtros se atualizassem dinamicamente ao cadastrar novos eventos com categorias inéditas.
- Reutilizar o mesmo `FormEvento` para criação e edição sem duplicar código, apenas diferenciando pelo prop `eventoInicial`.
- Garantir que a exclusão de um evento também limpasse as inscrições vinculadas, mantendo consistência no localStorage.

**Aprendizados:**
- Compreensão prática do fluxo de dados unidirecional do React: estado no pai, funções passadas como props para os filhos.
- Uso do `useEffect` com array de dependências para sincronizar estado com `localStorage`.
- A diferença entre estado derivado (calculado na renderização) e estado armazenado, optando por calcular as categorias dinamicamente em vez de mantê-las em estado separado.
- CSS Modules como solução para evitar conflitos de estilos entre componentes.
- Renderização condicional de UI com base em props para controlar o que cada perfil de usuário enxerga na mesma tela.
