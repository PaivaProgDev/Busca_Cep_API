// TAG UL PARA ARMAZENAR AS LISTAS DE CEPS
const cepsList = document.querySelector('.ceps-list');

// INPUT PARA INSERIR O CEP
const cep = document.getElementById('search-field');

// MODAL - AVISA QUANDO A API NÃO IDENTIFICAR O CEP
const cepNotFound = document.querySelector('[data-modal="notFindCep"]');

// MODAL - AVISA QUANDO O INPUT NÃO TIVER NO MÍNIMO 8 NÚMEROS
const cepMinChar = document.querySelector('[data-modal="minChar"]');
let cepsLi = localStorage.getItem('ceps');

if (cepsLi) {
   cepsLi = JSON.parse(cepsLi);
} else {
   cepsLi = [];
}

// REQUISITOS PARA CHAMAR A API
function addCep() {
   const cepValue = cep.value;

   if (cepValue.length === 8) {
      pegarCep(cepValue);

   } else {
      cepMinChar.classList.add('modal-open');
      setTimeout(cepMinCharRemove, 3000);
      cepNotFound.classList.remove('modal-open');
   }
};

// ADICIONA O CEP PRESSIONANDO A TECLA ENTER
cep.addEventListener('keypress', function (e) {
   const cepValue = cep.value;
   if (e.key === 'Enter') {
      pegarCep(cepValue);
   }
});

// FAZ UMA REQUISIÇÃO API QUE IDENTIFICA O CEP PASSADO PELO INPUT
function pegarCep(cepValue) {
   fetch(`https://brasilapi.com.br/api/cep/v1/${cepValue}`)
      .then(res => res.json())
      .then(data => {
         if (cepValue === data.cep) {

            criarTabela(data);
            cep.value = '';
            cepNotFound.classList.remove('modal-open');

         } else {
            cepNotFound.classList.add('modal-open');
            setTimeout(cepNotFoundRemove, 3000);
         }
      })
      .catch(err => {
         console.log(err);
      });

   cepMinChar.classList.remove('modal-open');
};

// CRIA UMA LISTA EM FORMATO DE OBJETO
function criarTabela(data) {

   const newLi = new Object();
   newLi.cep = data.cep;
   newLi.estado = data.state;
   newLi.cidade = data.city;
   newLi.bairro = data.neighborhood;
   newLi.rua = data.street;

   cepsLi.push(newLi);

   saveToLocal();
   showToLocal();
};

// CRIA A TABELA DE CEPS BASEADA NOS VALORES PASSADO AO OBJETO
function showToLocal() {
   cepsList.innerHTML = '';

   cepsLi.forEach((data, key) => {
      const newCep = document.createElement('li');
      newCep.className = 'cep';
      newCep.id = idGeneration();
      newCep.innerHTML = `
      <table class="ceps-table">
         <!-- Head -->
         <tr class="table-header">
            <th class="column-1">
               <span>CEP</span>
            </th>
            <th class="column-2">
               <div class="div-column-2">
                  <span>Descrição</span>
                  <ion-icon class="btn-cep-remove" onclick="deleteCepsToLocal(${key})" name="trash"></ion-icon>
               </div>
            </th>
         </tr>
         <!-- Body -->
         <tr class="table-body">
            <td class="cep-result">
               <div class="cep-result-box">
                  <span>${data.cep}</span>
                  <div class="map">
                     <ion-icon name="map-outline"></ion-icon>
                     <button class="btn-see-map">Mapa</button>
                  </div>
               </div>
            </td>
            <td class="cep-adress">
               <div class="adress-group-1">
                  <span>${data.estado}</span> |
                  <span>${data.cidade}</span>
               </div>
               <div class="adress-group-2">
                  <span>${data.bairro}</span> |
                  <span>${data.rua}</span>
               </div>
            </td>
         </tr>
      </table>`;

      cepsList.appendChild(newCep);
      vitistarNoMapa(data);
   });
}
showToLocal();

// GERA UM ID ALEATÓRIO DE 10 CARACTERES PARA IDENTIFICAR CADA TABELA DE CEPS
function idGeneration() {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let result = '';

   for (i = 0; i < 10; i++) {
      const numberResult =
         Math.floor(Math.random() * characters.length);
      result += characters.charAt(numberResult);
   }
   return result;
}

// VISITA OS CEPS NO GOOGLE MAPS
function vitistarNoMapa(data) {
   document.querySelectorAll('.map').forEach(btnVisitMap => {
      btnVisitMap.addEventListener('click', function () {
         window.open(`https://www.google.com.br/maps/place/${data.cep}`);
      });
   });
};

// ATIVA O MODAL
function cepNotFoundAdd() {
   cepNotFound.classList.add('modal-open');
}
// REMOVE O MODAL
function cepNotFoundRemove() {
   cepNotFound.classList.remove('modal-open');
}
// ATIVA O MODAL
function cepMinCharAdd() {
   cepMinChar.classList.add('modal-open');
}
// REMOVE O MODAL
function cepMinCharRemove() {
   cepMinChar.classList.remove('modal-open');
}

// FECHA OS MODAIS CLICANDO NO BOTÃO X
document.addEventListener('click', function (e) {
   if (e.target.classList.contains('modal-close-btn')) {
      cepNotFound.classList.remove('modal-open');
      cepMinChar.classList.remove('modal-open');
   }
});

// FECHA OS MODAIS CLICANDO FORA
document.addEventListener('click', function (e) {
   if (e.target.classList.contains('container')) {
      cepNotFound.classList.remove('modal-open');
      cepMinChar.classList.remove('modal-open');
   }
});

// SALVA OS VALORES EM LOCAL STORAGE
function saveToLocal() {
   const root = document.querySelector('html');
   localStorage.setItem('ceps', JSON.stringify(cepsLi));
   localStorage.setItem('theme', root.classList.contains('dark-mode') ? 'dark' : 'light');
}

// DELETA UM VALOR ESPECÍFICO DO LOCAL STORAGE
function deleteCepsToLocal(key) {
   cepsLi.splice(key, 1);
   saveToLocal();
   showToLocal();
}

// MOSTRA O TEMA ARMAZENADO NO LOCAL STORAGE
function showThemeLocal() {
   const root = document.querySelector('html');
   const savedTheme = localStorage.getItem('theme');

   if (savedTheme) {
      root.classList.add(savedTheme + '-mode');
   }
}

showThemeLocal();

// TEMA DARK/LIGHT
function darkActive() {
   const aplicationDark = document.querySelector('html');
   const darkIcon = document.querySelector('.dark-theme-icon');
   const lightIcon = document.querySelector('.light-theme-icon');
   const toggle = document.querySelector('.toggle-theme');

   aplicationDark.classList.toggle('dark-mode');
   toggle.classList.toggle('dark-toggle-active');

   if (toggle.classList.contains('dark-toggle-active')) {
      darkIcon.classList.add('dark-icon-active');
      lightIcon.classList.add('light-icon-active');
   } else {
      darkIcon.classList.remove('dark-icon-active');
      lightIcon.classList.remove('light-icon-active');
   }

   saveToLocal();
}


























