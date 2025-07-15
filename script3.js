document.addEventListener("DOMContentLoaded", () => {
  const nivelSpan = document.getElementById("nivel");
  const xpSpan = document.getElementById("xp");
  const barraProgresso = document.getElementById("barraProgresso");
  const porcentagemSpan = document.getElementById("porcentagem");
  const conquistaMsg = document.getElementById("conquista");
  const resetBtn = document.getElementById("resetBtn");

  const TOTAL_TAREFAS = 6;
  const XP_POR_TAREFA = 20;

  let xp = parseInt(localStorage.getItem("xp")) || 0;
  let nivel = parseInt(localStorage.getItem("nivel")) || 1;

  function atualizarStatus() {
    let feitas = 0;

    document.querySelectorAll(".atividade-lista li").forEach(li => {
      const id = li.dataset.id;
      const statusSpan = li.querySelector(".status");
      const isFeito = localStorage.getItem(`atividade-${id}`) === "true";

      if (isFeito) {
        li.classList.add("feito");
        statusSpan.textContent = "✅ Concluída";
        feitas++;
      } else {
        li.classList.remove("feito");
        statusSpan.textContent = "⏳ Pendente";
      }
    });

    const porcentagem = Math.round((feitas / TOTAL_TAREFAS) * 100);
    barraProgresso.style.width = `${porcentagem}%`;
    porcentagemSpan.textContent = `${porcentagem}%`;

    if (feitas === TOTAL_TAREFAS) {
      conquistaMsg.style.display = "block";
    } else {
      conquistaMsg.style.display = "none";
    }

    nivelSpan.textContent = nivel;
    xpSpan.textContent = xp % 100;
  }

  function ganharXp(qtd) {
    xp += qtd;
    if (xp >= nivel * 100) {
      xp = xp - nivel * 100;
      nivel++;
    }
    localStorage.setItem("xp", xp);
    localStorage.setItem("nivel", nivel);
  }

  function concluirAtividadeAleatoria(tipo) {
    const lista = document.querySelector(`#${tipo}`);
    const itens = lista.querySelectorAll("li");
    for (const li of itens) {
      const id = li.dataset.id;
      const isFeito = localStorage.getItem(`atividade-${id}`) === "true";
      if (!isFeito) {
        localStorage.setItem(`atividade-${id}`, "true");
        ganharXp(XP_POR_TAREFA);
        break;
      }
    }
  }

  // Marca automaticamente após postagem
  const tipoAtividade = localStorage.getItem("atividadePostada");
  if (tipoAtividade === "fisicas" || tipoAtividade === "mentais") {
    concluirAtividadeAleatoria(tipoAtividade);
    localStorage.removeItem("atividadePostada");
  }

  // Reset diário
  resetBtn.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja refazer as tarefas do dia?")) {
      document.querySelectorAll(".atividade-lista li").forEach(li => {
        localStorage.removeItem(`atividade-${li.dataset.id}`);
      });
      atualizarStatus();
    }
  });

  atualizarStatus();
});