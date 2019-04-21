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
  return (
    (verifica_conflitos_linha(estado) + verifica_conflitos_diagonal(estado)) / 2
  );
}

function busca_gulosa(estado_inicial) {
  let estado_atual = estado_inicial;
  let conflitos = [];
  let coluna = 0;
  let k = 0;
  let menor_conflito;
  let melhor_troca;
  while (heuristica(estado_atual)) {
    for (let i in estado_atual) {
      estado_atual[coluna] = i;
      conflitos[i] = heuristica(estado_atual);
    }

    menor_conflito = conflitos[0];
    melhor_troca = 0;
    for (let i in conflitos) {
      if (conflitos[i] < menor_conflito) {
        melhor_troca = i;
        menor_conflito = conflitos[i];
      }
    }

    estado_atual[coluna] = parseInt(melhor_troca);

    coluna++;

    if (coluna >= 3) {
      coluna = 0;
    }
  }
  return estado_atual;
}

let estado = [1,1,1,1];

console.log("Estado inicial:")
console.log(estado)
console.log("Estado final:")
console.log(busca_gulosa(estado))
