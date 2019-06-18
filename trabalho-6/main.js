// Calcula a probabilidade de um token pertencer a uma categoria
const probabilidadeToken = (obj, token, categoria) => {
  // Quantas vezes esse token ocorreu nesta categoria
  let palavrasFrequenciaCount =
    obj.palavrasFrequenciaCount[categoria][token] || 0;
  // Contagem das palavras mapeadas para esta categoria
  let palavrasCount = obj.palavrasCount[categoria];
  return (
    (palavrasFrequenciaCount + 1) / (palavrasCount + obj.vocabularioTamanho)
  );
};

const tabelaFrequencia = tokens => {
  let tabelaFrequencia = Object.create(null);
  tokens.forEach(token => {
    !tabelaFrequencia[token]
      ? (tabelaFrequencia[token] = 1)
      : tabelaFrequencia[token]++;
  });

  return tabelaFrequencia;
};

// Realiza a remoção de pontuação e outros caracteres que não sejam alfanumericos
const tokenizer = texto => {
  let tratamento = texto.replace(/[^(a-z0-9_)+\s]/gi, ` `);
  return tratamento.split(/\s+/);
};

// Definição do classificador
function SpamNaivebayes() {
  let obj = {};
  obj.tokenizer = tokenizer;
  obj.tabelaFrequencia = tabelaFrequencia;
  obj.probabilidadeToken = probabilidadeToken;
  obj.vocabulario = {};
  obj.vocabularioTamanho = 0;
  // Qtde de exemplos inseridos
  obj.totalExemplos = 0;
  // Frenquencia de exemplos para cada categoria
  obj.exemplosCount = {
    spam: 0,
    ham: 0
  };
  // Frequencia de palavras pra cada categoria
  obj.palavrasCount = {
    spam: 0,
    ham: 0
  };
  obj.palavrasFrequenciaCount = {
    spam: {},
    ham: {}
  };
  // Nome das categorias
  obj.categorias = {
    spam: true,
    ham: true
  };
  return obj;
}

// Função para treinamento do modelo apartir da categoria indicada
const aprender = (obj, texto, categoria) => {
  let self = obj;
  // Atualizando a contagem de exemplos mapeados pra essa categoria
  self.exemplosCount[categoria]++;
  // Atualizando a quantidade de exemplos recebidos
  self.totalExemplos++;
  // Tratando o texto
  let tokens = self.tokenizer(texto);
  // Calculando a frequencia de cada palavra chave no texto
  let tabelaFrequencia = self.tabelaFrequencia(tokens);
  // Atualizando o vocabulario para esta categoria
  Object.keys(tabelaFrequencia).forEach(token => {
    if (!self.vocabulario[token]) {
      self.vocabulario[token] = true;
      self.vocabularioTamanho++;
    }
    let frequenciaNoTexto = tabelaFrequencia[token];
    if (!self.palavrasFrequenciaCount[categoria][token])
      self.palavrasFrequenciaCount[categoria][token] = frequenciaNoTexto;
    else self.palavrasFrequenciaCount[categoria][token] += frequenciaNoTexto;
    self.palavrasCount[categoria] += frequenciaNoTexto;
  });
  return self;
};

//Função para categorização da mensagem fornecida
const categorizar = (obj, texto) => {
  let self = obj;
  let probabilidadeMaxima = -Infinity;
  let categoriaEscolhida = null;
  let tokens = self.tokenizer(texto);
  let tabelaFrequencia = self.tabelaFrequencia(tokens);

  // Iterando pelas categorias para encontrar a que possua maior probabilidade para o texto
  Object.keys(self.categorias).forEach(categoria => {
    // Dos exemplos fornecidos quantos pertenciam a esta categoria
    let probabilidadeCategoria =
      self.exemplosCount[categoria] / self.totalExemplos;
    let probabillidade = Math.log(probabilidadeCategoria);
    // Determinando P(w|c) para cada palavra `w` no texto
    Object.keys(tabelaFrequencia).forEach(token => {
      let frequenciaNoTexto = tabelaFrequencia[token];
      let probabilidadeToken = self.probabilidadeToken(self, token, categoria);
      probabillidade += frequenciaNoTexto * Math.log(probabilidadeToken);
    });

    if (probabillidade > probabilidadeMaxima) {
      probabilidadeMaxima = probabillidade;
      categoriaEscolhida = categoria;
    }
  });
  return categoriaEscolhida;
};

// Executando o modelo
let classificador = SpamNaivebayes();

// O dataset completo pode ser encontrado no arquivo dataset.json
let dataset = {
  spam: [
    "Urgent! call 09061749602 from Landline. Your complimentary 4* Tenerife Holiday or £10,000 cash await collection SAE T&Cs BOX 528 HP20 1YF 150ppm 18+",
    "+449071512431 URGENT! obj is the 2nd attempt to contact U!U have WON £1250 CALL 09071512433 b4 050703 T&CsBCM4235WC1N3XX. callcost 150ppm mobilesvary. max£7. 50",
    "FREE for 1st week! No1 Nokia tone 4 ur mob every week just txt NOKIA to 8007 Get txting and tell ur mates www.getzed.co.uk POBox 36504 W45WQ norm150p/tone 16+",
    "Urgent! call 09066612661 from landline. Your complementary 4* Tenerife Holiday or £10,000 cash await collection SAE T&Cs PO Box 3 WA14 2PX 150ppm 18+ Sender: Hol Offer",
    "WINNER!! As a valued network customer you have been selected to receivea £900 prize reward! To claim call 09061701461. Claim code KL341. Valid 12 hours only.",
    "okmail: Dear Dave obj is your final notice to collect your 4* Tenerife Holiday or #5000 CASH award! Call 09061743806 from landline. TCs SAE Box326 CW25WX 150ppm",
    "07732584351 - Rodger Burns - MSG = We tried to call you re your reply to our sms for a free nokia mobile + free camcorder. Please call now 08000930705 for delivery tomorrow",
    '"URGENT! obj is the 2nd attempt to contact U!U have WON £1000CALL 09071512432 b4 300603t&csBCM4235WC1N3XX.callcost150ppmmobilesvary. max£7. 50"',
    "Congrats! Nokia 3650 video camera phone is your Call 09066382422 Calls cost 150ppm Ave call 3mins vary from mobiles 16+ Close 300603 post BCM4284 Ldn WC1N3XX",
    "Urgent! Please call 0906346330. Your ABTA complimentary 4* Spanish Holiday or £10,000 cash await collection SAE T&Cs BOX 47 PO19 2EZ 150ppm 18+",
    "Congrats 2 mobile 3G Videophones R yours. call 09063458130 now! videochat wid ur mates, play java games, Dload polypH music, noline rentl. bx420. ip4. 5we. 150p"
  ],
  ham: [
    '"Hey sorry I didntgive ya a a bellearlier hunny,just been in bedbut mite go 2 thepub l8tr if uwana mt up?loads a luv Jenxxx."',
    '"Are you comingdown later?"',
    '"HEY HEY WERETHE MONKEESPEOPLE SAY WE MONKEYAROUND! HOWDY GORGEOUS, HOWU DOIN? FOUNDURSELF A JOBYET SAUSAGE?LOVE JEN XXX"',
    '"CHA QUITEAMUZING THAT’SCOOL BABE,PROBPOP IN & CU SATTHEN HUNNY 4BREKKIE! LOVE JEN XXX. PSXTRA LRG PORTIONS 4 ME PLEASE "',
    '"HEY BABE! FAR 2 SPUN-OUT 2 SPK AT DA MO... DEAD 2 DA WRLD. BEEN SLEEPING ON DA SOFA ALL DAY, HAD A COOL NYTHO, TX 4 FONIN HON, CALL 2MWEN IM BK FRMCLOUD 9! J X"',
    '"CHEERS U TEX MECAUSE U WEREBORED! YEAH OKDEN HUNNY R UIN WK SAT?SOUND’S LIKEYOUR HAVIN GR8FUN J! KEEP UPDAT COUNTINLOTS OF LOVEME XXXXX."',
    '"EY! CALM DOWNON THEACUSATIONS.. ITXT U COS IWANA KNOW WOTU R DOIN AT THEW/END... HAVENTCN U IN AGES..RING ME IF UR UP4 NETHING SAT.LOVE J XXX."',
    '"YEH I AM DEF UP4 SOMETHING SAT,JUST GOT PAYED2DAY & I HAVBEEN GIVEN A£50 PAY RISE 4MY WORK & HAVEBEEN MADE PRESCHOOLCO-ORDINATOR 2I AM FEELINGOOD LUV"',
    '"Hi its Kate it was lovely to see you tonight and ill phone you tomorrow. I got to sing and a guy gave me his card! xxx"',
    '"Thinking of u ;) x"',
    "Me too! Have a lovely night xxx",
    "Hey hun-onbus goin 2 meet him. He wants 2go out 4a meal but I donyt feel like it cuz have 2 get last bus home!But hes sweet latelyxxx",
    "Hi mate its RV did u hav a nice hol just a message 3 say hello coz haven’t sent u 1 in ages started driving so stay off roads!RVx",
    "IM FINE BABES AINT BEEN UP 2 MUCH THO! SAW SCARY MOVIE YEST ITS QUITE FUNNY! WANT 2MRW AFTERNOON? AT TOWN OR MALL OR SUMTHIN?xx",
    "I notice you like looking in the shit mirror youre turning into a right freak",
    "IM LATE TELLMISS IM ON MY WAY",
    "Been up to ne thing interesting. Did you have a good birthday? When are u wrking nxt? I started uni today.",
    "IM GONNAMISSU SO MUCH!!I WOULD SAY IL SEND U A POSTCARD BUTTHERES ABOUTAS MUCH CHANCE OF MEREMEMBERIN ASTHERE IS OFSI NOT BREAKIN HIS CONTRACT!! LUV Yaxx",
    "Thanx 4 the time we’ve spent 2geva, its bin mint! Ur my Baby and all I want is u!xxxx",
    "You stayin out of trouble stranger!!saw Dave the other day he’s sorted now!still with me bloke when u gona get a girl MR!ur mum still Thinks we will get 2GETHA! ",
    "THANX 4 PUTTIN DA FONE DOWN ON ME!!",
    "I know dat feelin had it with Pete! Wuld get with em , nuther place nuther time mayb?",
    "U 2.",
    "Thanx u darlin!im cool thanx. A few bday drinks 2 nite. 2morrow off! Take care c u soon.xxx",
    "HIYA COMIN 2 BRISTOL 1 ST WEEK IN APRIL. LES GOT OFF + RUDI ON NEW YRS EVE BUT I WAS SNORING.THEY WERE DRUNK! U BAK AT COLLEGE YET? MY WORK SENDS INK 2 BATH.",
    "Sez, hows u & de arab boy? Hope u r all good give my love 2 evry1 love ya eshxxxxxxxxxxx",
    "THING R GOOD THANX GOT EXAMS IN MARCH IVE DONE NO REVISION? IS FRAN STILL WITH BOYF? IVE GOTTA INTERVIW 4 EXETER BIT WORRIED!x",
    "I love u 2 babe! R u sure everything is alrite. Is he being an idiot? Txt bak girlie",
    "I luv u soo much u don’t understand how special u r 2 me ring u 2morrow luv u xxx",
    "NOT MUCH NO FIGHTS. IT WAS A GOOD NITE!!",
    "JADE ITS PAUL. Y DIDN’T U TXT ME? DO U REMEMBER ME FROM BARMED? I WANT 2 TALK 2 U! TXT ME",
    "LOOK AT AMY URE A BEAUTIFUL, INTELLIGENT WOMAN AND I LIKE U A LOT. I KNOW U DON’T LIKE ME LIKE THAT SO DON’T WORRY.",
    '"Getting tickets 4 walsall tue 6 th march. My mate is getting me them on sat. ill pay my treat. Want 2 go. Txt bak .Terry"'
  ]
};

dataset.spam.forEach(val => {
  classificador = aprender(classificador, val, "spam");
});

dataset.ham.forEach(val => {
  classificador = aprender(classificador, val, "ham");
});

console.log("/---------------------------------------------------/");
console.log("Exemplo de SPAM não apresentado no treinamento");
console.log(
  "Congratulations U can claim 2 VIP row A Tickets 2 C Blu in concert in November or Blu gift guaranteed Call 09061104276 to claim TS&Cs www.smsco.net cost£3.75max "
);
console.log(
  "Resultado: ",
  categorizar(
    classificador,
    "Congratulations U can claim 2 VIP row A Tickets 2 C Blu in concert in November or Blu gift guaranteed Call 09061104276 to claim TS&Cs www.smsco.net cost£3.75max "
  )
);
console.log("");
console.log("");
console.log("Exemplo de HAM (não spam) não apresentado no treinamento");
console.log(
  "Sounds better than my evening im just doing my costume. Im not sure what time i finish tomorrow but i will txt you at the end."
);
console.log(
  "Resultado: ",
  categorizar(
    classificador,
    "Sounds better than my evening im just doing my costume. Im not sure what time i finish tomorrow but i will txt you at the end."
  )
);

console.log("/---------------------------------------------------/");
