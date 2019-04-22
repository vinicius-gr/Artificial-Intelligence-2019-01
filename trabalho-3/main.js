function verifica_conflitos_linha(estado) {
  let conflitos = 0;
  let frequencia_linha = new Array(estado.length).fill(0);
  for (let i in frequencia_linha) {
    frequencia_linha[estado[i]]++;
  }

  let result = 0;
  for (let i in frequencia_linha) {
    let x = frequencia_linha[i];
    result += (x * (x - 1)) / 2;
    if (result != 0) {
      conflitos += result;
    }
  }

  return conflitos;
}

function verifica_conflitos_diagonal(estado) {
  let conflitos = 0;
  let frequencia_diagonal_principal = new Array(estado.length * 2 - 1).fill(0);

  for (let i = 0; i < estado.length; i++) {
    let row = estado[i];
    let sum = row + i;
    frequencia_diagonal_principal[sum]++;
  }

  let frequencia_diagonal_secundaria = new Array(estado.length * 2).fill(0);

  for (let i = 0; i < estado.length; i++) {
    let row = estado[i];
    let sum = estado.length - row + 1 + i;
    frequencia_diagonal_secundaria[sum]++;
  }

  for (let i in frequencia_diagonal_principal) {
    if (frequencia_diagonal_principal[i] > 0) {
      frequencia_diagonal_principal[i] -= 1;
      conflitos += frequencia_diagonal_principal[i];
    }

    if (frequencia_diagonal_secundaria[i] > 0) {
      frequencia_diagonal_secundaria[i] -= 1;
      conflitos += frequencia_diagonal_secundaria[i];
    }
  }

  return conflitos;
}

function heuristica(estado) {
  // Não há necessidade de verificar conflitos na coluna, uma vez que cada coluna manterá apenas uma única rainha
  return (
    (verifica_conflitos_linha(estado) + verifica_conflitos_diagonal(estado)) / 2
  );
}

// Função auxiliar para descobrir o melhor moviemtno a partir de um estado, utilizando a heuristica
function melhor_novo_estado(estado_atual) {
  let melhor_movimento = [0, 0];
  let menor_conflito = heuristica(estado_atual);
  let estado_aux = [...estado_atual];
  for (let i in estado_atual) {
    for (let j in estado_atual) {
      estado_aux = [...estado_atual];
      estado_aux[i] = j;

      if (heuristica(estado_aux) <= menor_conflito) {
        menor_conflito = heuristica(estado_aux);
        melhor_movimento = [i, j];
      }
    }
  }

  let novo_estado = [...estado_atual];
  novo_estado[melhor_movimento[0]] = parseInt(melhor_movimento[1]);
  return novo_estado;
}

// Função auxiliar para descobrir o melhor moviemtno a partir de um estado, utilizando a heuristica e uma lista tabu das ultimas damas movimentadas
// A função recebe o estado atual e uma lista tabu, retorna o melhor movimento a partir da heuristica e da lista tabu
function melhor_novo_estado_lista_tabu(estado_atual, lista_tabu) {
  let melhor_movimento = [0, 0];
  let nova_lista_tabu = lista_tabu;
  let menor_conflito = heuristica(estado_atual);
  let estado_aux = [...estado_atual];
  for (let i in estado_atual) {
    for (let j in estado_atual) {
      estado_aux = [...estado_atual];
      estado_aux[i] = parseInt(j);

      if (
        (heuristica(estado_aux) <= menor_conflito) &
        (i !== lista_tabu[0]) &
        (i !== lista_tabu[1])
      ) {
        menor_conflito = heuristica(estado_aux);
        melhor_movimento = [i, j];
      }
    }
  }

  // Atualizando o estado, para retornar já com o melhor movimento feito
  let novo_estado = [...estado_atual];
  novo_estado[melhor_movimento[0]] = parseInt(melhor_movimento[1]);

  // Atualizando a lista tabu que será retornada como segundo elemento do array de retorno
  nova_lista_tabu.push(parseInt(melhor_movimento[0]));
  nova_lista_tabu.shift();

  // Retorna o array
  return [novo_estado, nova_lista_tabu];
}

function subida_encosta(estado_inicial) {
  let estado_atual = estado_inicial;
  while (
    JSON.stringify(estado_atual) !==
    JSON.stringify(melhor_novo_estado(estado_atual))
  ) {
    estado_atual = melhor_novo_estado(estado_atual);
  }
  return estado_atual;
}

function subida_encosta_com_tabu(estado_inicial) {
  let estado_atual = estado_inicial;
  let lista_tabu = [null, null];
  let retorno;
  while (
    JSON.stringify(estado_atual) !==
    JSON.stringify(melhor_novo_estado_lista_tabu(estado_atual, lista_tabu)[0])
  ) {
    retorno = melhor_novo_estado_lista_tabu(estado_atual, lista_tabu);
    estado_atual = retorno[0];
    lista_tabu = retorno[1];
  }
  return estado_atual;
}

let estado = [1, 1, 1, 1];

console.log("Subida/Descida de encosta");
console.log("Estado inicial:");
console.log(estado);
console.log();
console.log("Estado final:");
console.log(subida_encosta(estado));
console.log();
console.log("Busca tabu");
console.log("Estado inicial:");
console.log(estado);
console.log();
console.log("Estado final:");
console.log(subida_encosta_com_tabu(estado));
console.log();
