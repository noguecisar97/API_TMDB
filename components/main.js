function busca(valor, page = 1) {
  const procura = document.querySelector('#valor_busca')
  procura.value = ""
  const serviceUrl = `https://api.themoviedb.org/3/search/movie?api_key=6222af374bb1fa631c1f7c4aa11bdd79&query=${valor}&page=${page}`
  //https://api.themoviedb.org/3/search/movie?api_key=6222af374bb1fa631c1f7c4aa11bdd79&query=kuroko
  //https://api.themoviedb.org/3/search/movie?api_key=6222af374bb1fa631c1f7c4aa11bdd79&query=pokemon&page=1
  //https://www.youtube.com/watch?v={key}
  //https://image.tmdb.org/t/p/w500/{key}
  axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
  axios.get(serviceUrl)
    .then(resp => {
      const dados = resp.data
      const lista = Array.from(dados.results)
      const totalPages = resp.data.total_pages
      const totalResults = resp.data.total_results
      listar(valor, lista, totalPages)
    })
    .catch(error => {
      console.log(error);
    })
}

function video(id){
  const serviceUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=6222af374bb1fa631c1f7c4aa11bdd79`
  axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
  axios.get(serviceUrl)
    .then(resp => {
      const dados = resp.data
      const lista = Array.from(dados.results)
      carregaFilme(lista)
    })
    .catch(error => {
      console.log(error);
    })
}

function carregaFilme(lista){
  const urls = []
  lista.map((e) => {
    const url = 'https://www.youtube.com/embed/'+e.key+'?autoplay=1'
    urls.push(url)
  })
  if(urls.length > 0){
    insereFilme(urls)
  }
  
}

function insereFilme(lista){  
  const container = document.createElement('div')
  const video = document.createElement('iframe')
  video.className = 'videoFilme'
  let num = 0
  video.src = lista[num]

  const total = lista.length

  const campo = document.querySelector('.descricao')

  if(total > 1){
    const next = document.createElement('button')
    const before = document.createElement('button')
    next.className = 'navVideo1 buttonVideo'
    before.className = 'navVideo2 buttonVideo'
    next.innerHTML = '>'
    before.innerHTML = '<'

    next.onclick = () => {
      num++
      if(num < total){
        video.src = lista[num]
      }else{
        num = 0
        video.src = lista[num]
      } 
    }
  
    before.onclick = () => {
      num-- 
      if(num >= 0){       
        video.src = lista[num]
      }else{
        num = total-1
        video.src = lista[num]
      }
    }

    container.append(video, next,before )
  } else{
    container.append(video)
  }
  container.className = 'controlVideo'
  campo.append(container) 
}

const botao = document.querySelector('#buscar')
botao.onclick = function () {
  const procura = document.querySelector('#valor_busca')
  sessionStorage.setItem('valor', procura.value)
  busca(procura.value)
}

function listar(valor, lista, paginasTotal) {
  sessionStorage.setItem('paginas', valor)
  const container = document.querySelector('#pagesNumber')
  container.innerHTML = ""
  if (paginasTotal > 1) {
    for (var x = 1; x <= paginasTotal; x++) {
      const a = document.createElement('a')
      const button = document.createElement('button')
      a.href = '#'
      button.style.margin = "5px"
      button.className = 'button-page'
      a.innerHTML = x
      button.append(a)
      container.append(button)
    }
  }


  const paginaDFilmes = document.querySelector('#form-resultado')
  paginaDFilmes.innerHTML = ''
  
 
  lista.map(e => {    
    adicionaFilme(e)    
  })

  mudaPagina()
}

function adicionaFilme(filme) {
  const container = document.querySelector('#form-resultado')

  const trailer = document.createElement('button')
  trailer.innerHTML = 'TRAILER'
  trailer.className = 'trailerFilme'

  const div = document.createElement('div')
  const texto = document.createElement('div')
  const imagem = document.createElement('div')
  const img = document.createElement('img')
  img.className = 'imgFilme'
  imagem.className = 'comImg'
  const h1 = document.createElement('h1')
  const h2 = document.createElement('h2')
  const genero = document.createElement('h2')
  const nota = document.createElement('p')
  const desc = document.createElement('p')
  genero.innerHTML = '';

  const fechar = document.createElement('button')
  fechar.className = 'fechando' 
  fechar.innerHTML = 'X'
  const section = document.querySelector('#sobrepor')
  fechar.onclick = ()=> {
    texto.remove()   
    section.style.display = 'none';
  }
  texto.className = 'descricao'
  div.className = 'nowFilme'
  if (filme.poster_path == null) {
    img.src = '../../img/Api/logo21.png'
  } else {
    img.src = 'https://image.tmdb.org/t/p/w500/' + filme.poster_path
  }
  h1.innerHTML = filme.title
  for(let y=0;y<filme.genre_ids.length;y++){
    const number = filme.genre_ids[y]
    genero.innerHTML = genero.innerHTML + ' ' + listaGeneros(number)
  } 
  imagem.append(img)
  vendoMais(imagem)
  if(filme.release_date == ""){
    h2.innerHTML = ' * ' + filme.original_language
  }else{
      const data = new Date(filme.release_date)
      const dataFilme = (data.getDate()+1)+'/'+(data.getMonth()+1)+'/'+data.getFullYear()
      h2.innerHTML = dataFilme  + ' * ' + filme.original_language
  }
  desc.innerHTML = '<color>Overview: </color>' + filme.overview
  nota.innerHTML = '<color>Vote: </color>' + filme.vote_average
  texto.append(fechar,h1,genero,h2,nota,desc,trailer) 
  mostrarTexto(imagem, texto, fechar)
  div.append(imagem)  
  container.append(div)

  trailer.onclick = () => {
    video(filme.id)
    trailer.remove()
  }
}


function mostrarTexto(imagem, texto){
  const section = document.querySelector('#sobrepor')
  imagem.onclick = () => {
    section.innerHTML = ''
    section.style.display = 'flex';    
    section.append(texto)
  }  
}


function vendoMais(container){
  container.onmouseenter = () => {
    const div = document.createElement('div')
    div.innerHTML = 'Ver mais...'
    div.className = 'vendoMais'
    container.append(div)
  }
  container.onmouseleave = () => {
    const div = container.querySelector('.vendoMais')
    div.remove()
  }
}


function mudaPagina() {  
  const button = document.querySelectorAll('.button-page')
  const botoes = Array.from(button)

  botoes.map(e => {
    let valor = sessionStorage.getItem('valor')
    const a = e.querySelector('a')
    e.onclick = () => busca(valor, a.innerHTML)
  })
}


function listaGeneros(numero){
  const lista = [{
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    }, {
      "id": 16,
      "name": "Animation"
    }, {
      "id": 35,
      "name": "Comedy"
    }, {
      "id": 80,
      "name": "Crime"
    }, {
      "id": 99,
      "name": "Documentary"
    }, {
      "id": 18,
      "name": "Drama"
    }, {
      "id": 10751,
      "name": "Family"
    }, {
      "id": 14,
      "name": "Fantasy"
    }, {
      "id": 36,
      "name": "History"
    }, {
      "id": 27,
      "name": "Horror"
    }, {
      "id": 10402,
      "name": "Music"
    }, {
      "id": 9648,
      "name": "Mystery"
    }, {
      "id": 10749,
      "name": "Romance"
    }, {
      "id": 878,
      "name": "Science Fiction"
    }, {
      "id": 10770,
      "name": "TV Movie"
    }, {
      "id": 53,
      "name": "Thriller"
    }, {
      "id": 10752,
      "name": "War"
    }, {
      "id": 37,
      "name": "Western"
    }]
    
    var nome = ''

    lista.map(e => {
      if(e.id == numero){
        nome = e.name
      }
    })

    return nome;
}