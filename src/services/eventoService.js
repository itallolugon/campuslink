const API_URL = 'http://localhost:3001';

async function tratar(res, mensagemErro) {
  if (!res.ok) {
    throw new Error(`${mensagemErro} (HTTP ${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function listarEventos() {
  const res = await fetch(`${API_URL}/eventos`);
  return tratar(res, 'Erro ao buscar eventos');
}

export async function criarEvento(evento) {
  const res = await fetch(`${API_URL}/eventos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(evento),
  });
  return tratar(res, 'Erro ao criar evento');
}

export async function atualizarEvento(id, evento) {
  const res = await fetch(`${API_URL}/eventos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(evento),
  });
  return tratar(res, 'Erro ao atualizar evento');
}

export async function deletarEvento(id) {
  const res = await fetch(`${API_URL}/eventos/${id}`, {
    method: 'DELETE',
  });
  return tratar(res, 'Erro ao excluir evento');
}
