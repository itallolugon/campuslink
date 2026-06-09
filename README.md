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
npm start
```

O comando `npm start` sobe **dois serviços** ao mesmo tempo via `concurrently`:

- **API REST** (json-server) em `http://localhost:3001/eventos`
- **App React** em `http://localhost:5173`

Caso prefira rodar separados (dois terminais):

```bash
npm run api    # terminal 1 — API REST na porta 3001
npm run dev    # terminal 2 — Vite dev server na porta 5173
```

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

---

## Relatório — Sprint N3

**Data:** Junho de 2025

---

### 1. Objetivo da Sprint

Integrar o front-end React a uma **API RESTful real** com CRUD completo (Create, Read, Update, Delete), substituindo a persistência por `localStorage` para os dados de eventos. Manter `localStorage` apenas para dados específicos do usuário (inscrições, histórico de busca, preferência de tema).

---

### 2. Stack adotada para a API

- **json-server v0.17** — servidor REST de mock, lê/escreve no arquivo `db.json` na raiz do projeto. Roda na porta `3001`.
- **concurrently v8** — permite subir API + Vite com um único comando (`npm start`).
- **fetch + async/await** — sem bibliotecas externas (Axios não foi necessário); o `fetch` nativo do navegador cobre todas as operações.

A API expõe os endpoints REST padrão para a entidade `eventos`:

| Verbo | Endpoint | Ação |
|---|---|---|
| GET | `/eventos` | Lista todos os eventos |
| POST | `/eventos` | Cria um novo evento (id auto-gerado pelo json-server) |
| PUT | `/eventos/:id` | Atualiza um evento existente |
| DELETE | `/eventos/:id` | Remove um evento |

---

### 3. Arquitetura da integração

#### 3.1 Camada de serviço (`src/services/eventoService.js`)

Toda comunicação HTTP foi centralizada num módulo de serviço. O `App.jsx` nunca chama `fetch` diretamente — ele importa funções do serviço:

```js
import * as eventoService from './services/eventoService';

const dados = await eventoService.listarEventos();
const criado = await eventoService.criarEvento(dadosForm);
const atualizado = await eventoService.atualizarEvento(id, dados);
await eventoService.deletarEvento(id);
```

Internamente, cada função usa `fetch` com `async/await` e um helper `tratar()` que lança erro em caso de resposta não-2xx:

```js
async function tratar(res, mensagemErro) {
  if (!res.ok) throw new Error(`${mensagemErro} (HTTP ${res.status})`);
  if (res.status === 204) return null;
  return res.json();
}
```

#### 3.2 Tratamento de erros e estados assíncronos

O `App.jsx` mantém três estados para gerenciar o ciclo de vida da API:

```jsx
const [eventos, setEventos] = useState([]);
const [carregando, setCarregando] = useState(true);
const [erroApi, setErroApi] = useState(null);
```

- **`carregando`** → mostra um spinner (`Loading.jsx`) durante o fetch inicial
- **`erroApi`** → exibe mensagem de erro com botão "Tentar novamente" caso a API esteja offline
- Erros de POST/PUT/DELETE viram **toasts vermelhos** sem quebrar a aplicação

```jsx
async function confirmarDeletar() {
  try {
    await eventoService.deletarEvento(id);
    setEventos(prev => prev.filter(ev => ev.id !== id));
    mostrarToast('Evento excluído.', 'info');
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}
```

#### 3.3 O que ficou no localStorage e o que foi para a API

| Dado | Antes (Sprint N2) | Depois (Sprint N3) |
|---|---|---|
| Eventos (CRUD) | localStorage | **API REST** |
| Inscrições do usuário | localStorage | localStorage (mantido) |
| Histórico de busca | localStorage | localStorage (mantido) |
| Preferência de tema | localStorage | localStorage (mantido) |

A decisão de manter inscrições, histórico e tema no `localStorage` foi consciente: são dados **específicos do usuário** (não compartilhados), e como o projeto não tem autenticação, faz mais sentido tratá-los como preferências do navegador.

---

### 4. Como rodar (Sprint N3)

```bash
npm install
npm start    # sobe API REST + dev server simultaneamente
```

A API fica em `http://localhost:3001/eventos` e o app em `http://localhost:5173`.

---

### 5. Arquivos novos e alterados

| Arquivo | Tipo | Função |
|---|---|---|
| `db.json` | Novo | Banco de dados JSON (lido/escrito pelo json-server) |
| `src/services/eventoService.js` | Novo | Camada de serviço com as 4 operações REST |
| `src/components/Loading.jsx` | Novo | Spinner exibido durante o fetch inicial |
| `src/components/Loading.module.css` | Novo | Estilos do spinner |
| `src/App.jsx` | Alterado | Substitui localStorage por chamadas à API, adiciona estados `carregando` e `erroApi` |
| `src/App.module.css` | Alterado | Estilo do bloco de erro da API |
| `package.json` | Alterado | Scripts `api` e `start` + deps `json-server` e `concurrently` |

---

### 6. Dificuldades e Aprendizados (Sprint N3)

**Dificuldades:**
- Decidir o que migrar para a API e o que manter no localStorage — concluímos que dados compartilháveis vão para o servidor, dados do usuário ficam no navegador.
- Tratar o caso em que a API está offline sem quebrar a UI — resolvido com try/catch no `useEffect` inicial e botão "Tentar novamente".
- Garantir que o id retornado pelo POST do json-server seja usado no estado em vez do id antigo gerado por `Date.now()`.

**Aprendizados:**
- Padrão de **camada de serviço**: isolar `fetch` num módulo separado deixa o `App.jsx` focado em estado e UI.
- `async/await` em handlers de evento React, com try/catch para erros e estados de loading.
- Como mocking de APIs com json-server acelera o desenvolvimento front-end sem precisar implementar back-end.
- `concurrently` para orquestrar múltiplos processos no script `npm start`.
