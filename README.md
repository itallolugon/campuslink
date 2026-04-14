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
