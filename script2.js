const nome = document.getElementById('nome');
const senha = document.getElementById('senha');
const btn = document.getElementById('btn');


window.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  if (usuarioLogado) {
    window.location.href = 'index.html';
  }
});

btn.addEventListener('click', () => {
  const nomeValor = nome.value.trim();
  const senhaValor = senha.value.trim();

  
  if (nomeValor === "" || senhaValor === "") {
    alert("Erro! O campo está vazio!");
    return;
  }

  
  if (senhaValor.length < 6) {
    alert("Erro! A senha precisa ter no mínimo 6 caracteres!");
    return;
  }

  
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

 
  const nomeExistente = usuarios.find(u => u.nome === nomeValor);
  if (nomeExistente) {
    alert("Erro! Nome de usuário já cadastrado!");
    return;
  }

 
  usuarios.push({ nome: nomeValor, senha: senhaValor });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  localStorage.setItem('usuarioLogado', nomeValor); 

  
  window.location.href = 'index.html';
});