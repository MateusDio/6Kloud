const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const confirmar = confirm("Quer realmente sair da conta?");
  if (confirmar) {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
  }
});

const usuarioLogado = localStorage.getItem('usuarioLogado') || 'Você';


const fakePosts = [
  {
    username: "MartaFit",
    avatar: "https://i.pravatar.cc/48?img=32",
    text: "Treino de HIIT feito, suando bastante! 🔥💪",
    media: [
      "https://images.unsplash.com/photo-1554284126-9cc3d8db70b3?auto=format&fit=crop&w=600&q=80"
    ],
    done: true,
    doneType: "fisicas",
  },
  {
    username: "PedroMind",
    avatar: "https://i.pravatar.cc/48?img=45",
    text: "Meditação de 20 minutos para clarear a mente 🧘‍♂️✨",
    media: [],
    done: true,
    doneType: "mentais",
  },
  {
    username: "CarlaRunner",
    avatar: "https://i.pravatar.cc/48?img=51",
    text: "Corrida leve no fim de tarde, clima perfeito! 🌅🏃‍♀️",
    media: [
      "https://images.unsplash.com/photo-1526403227404-52e0d98bcf8e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80"
    ],
    done: false,
    doneType: "",
  },
  {
    username: "LucasYoga",
    avatar: "https://i.pravatar.cc/48?img=23",
    text: "Aula de yoga ao nascer do sol. Energia renovada! ☀️🧘‍♀️",
    media: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
    ],
    done: true,
    doneType: "fisicas",
  },
];

function criarPost(postData, prepend = false) {
  const feed = document.getElementById('feed');

  const post = document.createElement('article');
  post.classList.add('post');

  const header = document.createElement('div');
  header.classList.add('post-header');

  const avatar = document.createElement('div');
  avatar.classList.add('avatar');
  avatar.style.backgroundImage = `url(${postData.avatar})`;

  const username = document.createElement('span');
  username.classList.add('username');
  username.textContent = postData.username;

  header.appendChild(avatar);
  header.appendChild(username);

  const texto = document.createElement('p');
  texto.classList.add('post-text');
  texto.textContent = postData.text;

  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('post-media');

  if (postData.media && postData.media.length > 0) {
    postData.media.forEach((url) => {
      if (url.match(/\.(mp4|webm|ogg)$/i)) {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.width = 300;
        mediaContainer.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = url;
        mediaContainer.appendChild(img);
      }
    });
  }

  post.appendChild(header);
  post.appendChild(texto);
  post.appendChild(mediaContainer);

  if (postData.done) {
    const doneSpan = document.createElement('span');
    if(postData.doneType === "fisicas"){
      doneSpan.textContent = "Atividade concluída: Física";
    } else if(postData.doneType === "mentais"){
      doneSpan.textContent = "Atividade concluída: Mental";
    } else {
      doneSpan.textContent = "Atividade concluída";
    }
    post.appendChild(doneSpan);
  }

  if (prepend) {
    feed.prepend(post);
  } else {
    feed.appendChild(post);
  }
}

fakePosts.forEach(post => criarPost(post));

const postForm = document.getElementById('postForm');
const postText = document.getElementById('postText');
const postMedia = document.getElementById('postMedia');
const atividadeConcluidaContainer = document.getElementById('atividadeConcluidaContainer');

postMedia.addEventListener('change', () => {
  if(postMedia.files.length > 0){
    atividadeConcluidaContainer.style.display = "flex";
  } else {
    atividadeConcluidaContainer.style.display = "none";
    const radios = atividadeConcluidaContainer.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => radio.checked = false);
  }
});

postForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = postText.value.trim();
  const files = postMedia.files;

  if(!text && files.length === 0){
    alert("Escreva algo ou escolha uma mídia para postar.");
    return;
  }

  for(const file of files){
    if(!file.type.startsWith('image/') && !file.type.startsWith('video/')){
      alert("Somente fotos e vídeos são permitidos.");
      return;
    }
  }

  if(files.length > 0){
    const selectedAtividade = atividadeConcluidaContainer.querySelector('input[name="atividadeConcluida"]:checked');
    if(!selectedAtividade){
      alert("Por favor, marque se a atividade é física ou mental.");
      return;
    }
  }

  const mediaURLs = Array.from(files).map(file => URL.createObjectURL(file));
  const doneType = files.length > 0 ? atividadeConcluidaContainer.querySelector('input[name="atividadeConcluida"]:checked').value : "";

  const novoPost = {
    username: usuarioLogado,
    avatar: "https://i.pravatar.cc/48?img=56",
    text: text,
    media: mediaURLs,
    done: files.length > 0,
    doneType: doneType,
  };

  criarPost(novoPost, true);

  postText.value = "";
  postMedia.value = "";
  atividadeConcluidaContainer.style.display = "none";
  const radios = atividadeConcluidaContainer.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => radio.checked = false);


  setTimeout(() => {
    mediaURLs.forEach(url => URL.revokeObjectURL(url));
  }, 60000);
});
