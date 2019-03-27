//------------------------------------------------------------
// ESTRUTURAS DOS DADOS
//------------------------------------------------------------

// Definição do grafo para representação da Romenia
class Cidade {
  constructor(id, nome) {
    this.id = id;
    this.nome = nome;
    this.estado = "nao_visitado";
    this.profundidade = Number.POSITIVE_INFINITY;
    this.pai = null;
  }
}

class Romenia {
  constructor() {
    this.inicio = "0";
    this.cidades = {
      "0": new Cidade(0, "Oradea"),
      "1": new Cidade(1, "Zerind"),
      "2": new Cidade(2, "Arad"),
      "3": new Cidade(3, "Timisoara"),
      "4": new Cidade(4, "Lugoj"),
      "5": new Cidade(5, "Mehadia"),
      "6": new Cidade(6, "Dobreta"),
      "7": new Cidade(7, "Craiova"),
      "8": new Cidade(8, "Rimnicu Vilcea"),
      "9": new Cidade(9, "Sibiu"),
      "10": new Cidade(10, "Fagaras"),
      "11": new Cidade(11, "Pitesti"),
      "12": new Cidade(12, "Bucharest"),
      "13": new Cidade(13, "Giurgiu"),
      "14": new Cidade(14, "Urziceni"),
      "15": new Cidade(15, "Neamt"),
      "16": new Cidade(16, "las1"),
      "17": new Cidade(17, "Vaslui"),
      "18": new Cidade(18, "Hirsova"),
      "19": new Cidade(19, "Eforie")
    };
    this.arestas = [
      ["0", "9", 151],
      ["0", "1", 71],
      ["1", "2", 75],
      ["2", "9", 140],
      ["2", "3", 118],
      ["3", "4", 111],
      ["4", "5", 70],
      ["5", "6", 75],
      ["6", "7", 120],
      ["7", "8", 146],
      ["9", "8", 80],
      ["9", "10", 99],
      ["10", "12", 211],
      ["10", "12", 211],
      ["8", "11", 97],
      ["7", "11", 138],
      ["11", "12", 101],
      ["12", "13", 90],
      ["12", "14", 85],
      ["12", "14", 85],
      ["12", "14", 85],
      ["12", "14", 85],
      ["14", "17", 142],
      ["14", "18", 98],
      ["18", "19", 86],
      ["17", "16", 92],
      ["16", "15", 87]
    ];
  }
}

//------------------------------------------------------------
// FUNÇÕES AUXILIARES
//------------------------------------------------------------

// Encontra as cidades vizinhas de um dado nó
function cidadesVizinhas(grafo, chaveCidade) {
  let arestas = grafo.arestas.filter(
    aresta => aresta[0] == chaveCidade || aresta[1] == chaveCidade
  );
  let vizinhas = [];
  for (let i = 0; i < arestas.length; i++) {
    if (arestas[i][0] == chaveCidade) {
      vizinhas.push({
        nome: grafo.cidades[arestas[i][1]].nome,
        chaveCidade: arestas[i][1],
        distancia: arestas[i][2],
        aresta: arestas[i]
      });
    } else {
      vizinhas.push({
        nome: grafo.cidades[arestas[i][0]].nome,
        chaveCidade: arestas[i][0],
        distancia: arestas[i][2],
        aresta: arestas[i]
      });
    }
  }
  return vizinhas;
}

// Verifica se o nó já foi visitado
function jaFoiVisitada(grafo, aresta) {
  return (
    grafo.cidades[aresta[0]].estado == "visitado" ||
    grafo.cidades[aresta[1]].estado == "visitado"
  );
}

// Remove nós visitados da lista de cidades vizinhas e calcula a profundidade de um nó
function retiraJaVisitadas(grafo, cidadeAtual) {
  let vizinhas = cidadesVizinhas(grafo, cidadeAtual.chaveCidade);
  let vizinhasAux = [];

  for (let i in vizinhas) {
    if (grafo.cidades[vizinhas[i].chaveCidade].pai == null) {
      grafo.cidades[vizinhas[i].chaveCidade].pai = cidadeAtual.chaveCidade;
    }

    if (
      grafo.cidades[vizinhas[i].chaveCidade].profundidade ==
      Number.POSITIVE_INFINITY
    ) {
      grafo.cidades[vizinhas[i].chaveCidade].profundidade =
        grafo.cidades[grafo.cidades[vizinhas[i].chaveCidade].pai].profundidade +
        1;
    }

    if (!jaFoiVisitada(grafo, vizinhas[i].aresta)) {
      vizinhasAux.push(vizinhas[i]);
    }
  }

  return vizinhasAux;
}

// Ordena o caminho da origem até o nó objetivo
function recuperaCaminho(grafo, inicio, cidadeAtual) {
  let caminho = [grafo.cidades[cidadeAtual.chaveCidade].nome];
  cidadeAtual = cidadeAtual.chaveCidade;

  while (cidadeAtual !== inicio) {
    cidadeAtual = grafo.cidades[cidadeAtual].pai;
    caminho.push(grafo.cidades[cidadeAtual].nome);
  }

  return caminho.reverse();
}

// Ordena a estrutura de dados (pilha ou fila) por prioridade
function ordenaPorPrioridade(vizinhas) {
  return vizinhas.sort((val1, val2) => {
    if (val1.aresta[2] < val2.aresta[2]) return -1;
    if (val1.aresta[2] > val2.aresta[2]) return 1;
    return 0;
  });
}

//------------------------------------------------------------
// BUSCAS
//------------------------------------------------------------

function BuscaEmLargura(grafo, inicio, chegada) {
  let fila = [];
  grafo.cidades[inicio].pai = null;
  fila.push({ chaveCidade: inicio });
  let cidadeAtual = null;

  while (fila.length) {
    cidadeAtual = fila.shift();

    vizinhas = retiraJaVisitadas(grafo, cidadeAtual);

    fila = fila.concat(vizinhas);
    grafo.cidades[cidadeAtual.chaveCidade].estado = "visitado";

    if (cidadeAtual.chaveCidade == chegada) {
      fila = [];
    }
  }

  return recuperaCaminho(grafo, inicio, cidadeAtual);
}

function BuscaEmProfundidade(grafo, inicio, chegada) {
  let pilha = [];
  grafo.cidades[inicio].pai = null;
  pilha.unshift({ chaveCidade: inicio });
  let cidadeAtual = null;

  while (pilha.length) {
    cidadeAtual = pilha.shift();

    vizinhas = retiraJaVisitadas(grafo, cidadeAtual);

    pilha = vizinhas.concat(pilha);
    grafo.cidades[cidadeAtual.chaveCidade].estado = "visitado";

    if (cidadeAtual.chaveCidade == chegada) {
      pilha = [];
    }
  }

  return recuperaCaminho(grafo, inicio, cidadeAtual);
}

function BuscaDeCustoUniforme(grafo, inicio, chegada) {
  let fila = [];
  grafo.cidades[inicio].pai = null;
  fila.push({ chaveCidade: inicio });
  let cidadeAtual = null;

  while (fila.length) {
    cidadeAtual = fila.shift();

    vizinhas = retiraJaVisitadas(grafo, cidadeAtual);
    vizinhas = ordenaPorPrioridade(vizinhas);

    fila = ordenaPorPrioridade(fila);
    fila = fila.concat(vizinhas);
    grafo.cidades[cidadeAtual.chaveCidade].estado = "visitado";

    if (cidadeAtual.chaveCidade == chegada) {
      fila = [];
    }
  }

  return recuperaCaminho(grafo, inicio, cidadeAtual);
}

function BuscaDeProfundidadeLimitada(grafo, inicio, chegada, limite) {
  let pilha = [];
  grafo.cidades[inicio].pai = null;
  grafo.cidades[inicio].profundidade = 0;
  pilha.unshift({ chaveCidade: inicio });
  let cidadeAtual = null;

  while (pilha.length) {
    cidadeAtual = pilha.shift();

    vizinhas = retiraJaVisitadas(grafo, cidadeAtual);

    pilha = vizinhas.concat(pilha);
    grafo.cidades[cidadeAtual.chaveCidade].estado = "visitado";

    if (
      cidadeAtual.chaveCidade == chegada ||
      grafo.cidades[cidadeAtual.chaveCidade].profundidade >= limite
    ) {
      pilha = [];
    }
  }

  return recuperaCaminho(grafo, inicio, cidadeAtual);
}

function BuscaPorAprofundamentoIterativo(grafo, inicio, chegada) {
  let profundidade = 0;

  do {
    caminho = BuscaDeProfundidadeLimitada(
      new Romenia(),
      inicio,
      chegada,
      profundidade
    );
    profundidade += 1;
  } while (caminho[caminho.length - 1] != grafo.cidades[chegada].nome);

  return caminho;
}

//------------------------------------------------------------
// RESULTADOS
//------------------------------------------------------------

console.log("Busca em largura");
console.log("Caminho:");
console.log(BuscaEmLargura(new Romenia(), "2", "12"));
console.log("----------------------------------\n");
console.log("Busca em profundidade");
console.log("Caminho:");
console.log(BuscaEmProfundidade(new Romenia(), "2", "12"));
console.log("----------------------------------\n");
console.log("Busca de custo uniforme");
console.log("Caminho:");
console.log(BuscaDeCustoUniforme(new Romenia(), "2", "12"));
console.log("----------------------------------\n");
console.log("Busca por aprofundamento iterativo");
console.log("Caminho:");
console.log(BuscaPorAprofundamentoIterativo(new Romenia(), "2", "12"));
