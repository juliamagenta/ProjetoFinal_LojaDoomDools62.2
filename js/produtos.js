// Catálogo demonstrativo. Preços em centavos; fotografias originais dos ZIPs enviados.
const PRODUTOS = [
  {
    "id": "briar-beauty",
    "nome": "Briar Beauty",
    "colecao": "Ever After High",
    "preco": 32990,
    "anterior": null,
    "imagem": "midia/briar-beauty-principal.webp",
    "galeria": [
      "midia/briar-beauty-principal.webp",
      "midia/briar-beauty-vista-1.webp",
      "midia/briar-beauty-vista-2.webp",
      "midia/briar-beauty-vista-3.webp",
      "midia/briar-beauty-vista-4.webp"
    ],
    "estoque": 5,
    "novo": false,
    "destaque": false,
    "nota": 4.9,
    "avaliacoes": 24,
    "descricao": "Um conto de fadas com personalidade. Briar combina rosas, detalhes delicados e um visual cheio de encanto para completar sua coleção.",
    "detalhes": [
      "Vestido com detalhes de rosas",
      "Cabelos longos em tons castanhos e rosa",
      "Articulações para diferentes poses",
      "Coleção de contos de fadas"
    ],
    "cor": "rose"
  },
  {
    "id": "draculaura",
    "nome": "Draculaura",
    "colecao": "Monster High",
    "preco": 35990,
    "anterior": null,
    "imagem": "midia/draculaura-principal.webp",
    "estoque": 4,
    "novo": false,
    "destaque": false,
    "nota": 4.9,
    "avaliacoes": 32,
    "descricao": "O charme gótico que nunca sai da coleção. Draculaura traz uma combinação de preto e rosa, com pequenos detalhes que fazem toda a diferença.",
    "detalhes": [
      "Visual gótico em preto e rosa",
      "Cabelos longos com mechas",
      "Boneca articulada para exposição",
      "Estilo clássico Monster High"
    ],
    "cor": "purple",
    "galeria": [
      "midia/draculaura-principal.webp",
      "midia/draculaura-vista-1.webp",
      "midia/draculaura-vista-2.webp",
      "midia/draculaura-vista-3.webp",
      "midia/draculaura-vista-4.webp"
    ]
  },
  {
    "id": "madeline-hatter",
    "nome": "Madeline Hatter",
    "colecao": "Ever After High",
    "preco": 29990,
    "anterior": null,
    "imagem": "midia/madeline-hatter-principal.webp",
    "galeria": [
      "midia/madeline-hatter-principal.webp",
      "midia/madeline-hatter-vista-1.webp",
      "midia/madeline-hatter-vista-2.webp",
      "midia/madeline-hatter-vista-3.webp"
    ],
    "estoque": 6,
    "novo": false,
    "destaque": false,
    "nota": 4.8,
    "avaliacoes": 18,
    "descricao": "Um convite para uma coleção fora do comum. Madeline mistura cores, texturas e referências ao chá da tarde em um visual divertido e cheio de detalhes.",
    "detalhes": [
      "Cabelos em tons de verde e roxo",
      "Roupa inspirada no universo do País das Maravilhas",
      "Articulações para poses",
      "Detalhes delicados no figurino"
    ],
    "cor": "green"
  },
  {
    "id": "bratz-cowgirl",
    "nome": "Bratz Omydoll",
    "colecao": "Bratz",
    "preco": 24990,
    "anterior": null,
    "imagem": "midia/bratz-cowgirl-principal.webp",
    "estoque": 7,
    "novo": true,
    "destaque": false,
    "nota": 4.8,
    "avaliacoes": 15,
    "descricao": "Atitude de sobra em cada detalhe. A combinação de jeans, chapéu e tons terrosos traz uma inspiração western para sua prateleira.",
    "detalhes": [
      "Look de inspiração western",
      "Chapéu e peças em jeans",
      "Cabelos longos castanhos",
      "Ideal para exposição na coleção"
    ],
    "cor": "sand",
    "galeria": [
      "midia/bratz-cowgirl-principal.webp",
      "midia/bratz-cowgirl-vista-1.webp",
      "midia/bratz-cowgirl-vista-2.webp",
      "midia/bratz-cowgirl-vista-3.webp"
    ]
  },
  {
    "id": "blythe-noir",
    "nome": "Blythe Clawdeen",
    "colecao": "Blythe",
    "preco": 38990,
    "anterior": null,
    "imagem": "midia/blythe-noir-principal.webp",
    "galeria": [
      "midia/blythe-noir-principal.webp",
      "midia/blythe-noir-vista-1.webp",
      "midia/blythe-noir-vista-2.webp",
      "midia/blythe-noir-vista-3.webp",
      "midia/blythe-noir-vista-4.webp"
    ],
    "estoque": 3,
    "novo": false,
    "destaque": false,
    "nota": 4.9,
    "avaliacoes": 11,
    "descricao": "Olhos expressivos e uma presença única. Uma peça delicada para quem aprecia o estilo marcante das bonecas Blythe.",
    "detalhes": [
      "Olhos grandes e expressivos",
      "Cabelos longos castanhos",
      "Figurino em preto, branco e rosa",
      "Acabamento delicado para colecionadores"
    ],
    "cor": "sand"
  },
  {
    "id": "barbie-festa",
    "nome": "Barbie Festa",
    "colecao": "Barbie",
    "preco": 21990,
    "anterior": null,
    "imagem": "midia/barbie-festa-principal.webp",
    "estoque": 8,
    "novo": false,
    "destaque": false,
    "nota": 4.7,
    "avaliacoes": 21,
    "descricao": "Uma celebração dos pequenos sonhos. Barbie usa um vestido de festa rosa com brilho, uma escolha clássica para uma coleção com histórias.",
    "detalhes": [
      "Vestido de festa rosa",
      "Detalhes com brilho",
      "Cabelos loiros",
      "Visual clássico de coleção"
    ],
    "cor": "rose",
    "galeria": [
      "midia/barbie-festa-principal.webp",
      "midia/barbie-festa-vista-1.webp",
      "midia/barbie-festa-vista-2.webp",
      "midia/barbie-festa-vista-3.webp",
      "midia/barbie-festa-vista-4.webp"
    ]
  },
  {
    "id": "sally-costuras",
    "nome": "Sally — Costuras da Noite",
    "colecao": "Monster High",
    "preco": 41990,
    "anterior": null,
    "imagem": "new_doll.png",
    "estoque": 2,
    "novo": false,
    "destaque": false,
    "nota": 5,
    "avaliacoes": 9,
    "descricao": "Uma personagem de outro mundo, entre retalhos e histórias. Sally é a escolha para quem prefere uma coleção com um toque misterioso.",
    "detalhes": [
      "Vestido com inspiração em retalhos",
      "Cabelos longos avermelhados",
      "Paleta de cores noturnas",
      "Peça de exposição para colecionadores"
    ],
    "cor": "green",
    "visivel": false
  },
  {
    "id": "ca-cupid",
    "nome": "C.A. Cupid",
    "colecao": "Ever After High",
    "preco": 37990,
    "anterior": null,
    "imagem": "hero_doll.png",
    "estoque": 4,
    "novo": false,
    "destaque": false,
    "nota": 4.9,
    "avaliacoes": 27,
    "descricao": "Uma história de amor pela sua coleção. C.A. Cupid reúne corações, cabelos rosados e uma delicadeza que dá vontade de guardar para sempre.",
    "detalhes": [
      "Cabelos em tons de rosa",
      "Detalhes inspirados em corações",
      "Boneca de coleção",
      "Uma peça cheia de personalidade"
    ],
    "cor": "rose",
    "visivel": false
  },
  {
    "id": "hello-kitty-lyla",
    "nome": "Bratz Hello Kitty Lyla",
    "colecao": "Hello Kitty",
    "preco": 39990,
    "anterior": null,
    "imagem": "midia/hello-kitty-lyla-principal.webp",
    "estoque": 6,
    "novo": false,
    "oferta": false,
    "destaque": true,
    "nota": 4.9,
    "avaliacoes": 12,
    "descricao": "Lyla traz o conjunto rosa e os detalhes Hello Kitty em cada peça. Uma peça cheia de estilo para completar a coleção.",
    "detalhes": [
      "Conjunto rosa com estampa Hello Kitty",
      "Cabelos pretos e franja",
      "Botas e bolsa combinando"
    ],
    "cor": "gray",
    "galeria": [
      "midia/hello-kitty-lyla-principal.webp",
      "midia/hello-kitty-lyla-vista-1.webp",
      "midia/hello-kitty-lyla-vista-2.webp",
      "midia/hello-kitty-lyla-vista-3.webp"
    ]
  },
  {
    "id": "hello-kitty-caroline",
    "nome": "Bratz Hello Kitty Caroline",
    "colecao": "Hello Kitty",
    "preco": 39099,
    "anterior": null,
    "imagem": "midia/hello-kitty-caroline-principal.webp",
    "estoque": 6,
    "novo": false,
    "oferta": false,
    "destaque": true,
    "nota": 4.9,
    "avaliacoes": 12,
    "descricao": "Caroline combina blusa vermelha, jeans e uma delicada bolsa Hello Kitty. Um visual cheio de personalidade para sua coleção.",
    "detalhes": [
      "Blusa vermelha e calça jeans",
      "Cabelos castanhos com franja",
      "Bolsa Hello Kitty"
    ],
    "cor": "gray",
    "galeria": [
      "midia/hello-kitty-caroline-principal.webp",
      "midia/hello-kitty-caroline-vista-1.webp",
      "midia/hello-kitty-caroline-vista-2.webp",
      "midia/hello-kitty-caroline-vista-3.webp"
    ]
  },
  {
    "id": "hello-kitty-tiffany",
    "nome": "Bratz Hello Kitty Tiffany",
    "colecao": "Hello Kitty",
    "preco": 39099,
    "anterior": null,
    "imagem": "midia/hello-kitty-tiffany-principal.webp",
    "estoque": 6,
    "novo": false,
    "oferta": false,
    "destaque": true,
    "nota": 4.9,
    "avaliacoes": 12,
    "descricao": "Tiffany completa os destaques Hello Kitty com cabelos loiros e um conjunto rosa e branco. Pequenos detalhes para uma coleção com personalidade.",
    "detalhes": [
      "Cabelos loiros",
      "Visual em rosa e branco",
      "Bolsa e acessórios Hello Kitty"
    ],
    "cor": "gray",
    "galeria": [
      "midia/hello-kitty-tiffany-principal.webp",
      "midia/hello-kitty-tiffany-vista-1.webp",
      "midia/hello-kitty-tiffany-vista-2.webp",
      "midia/hello-kitty-tiffany-vista-3.webp"
    ]
  },
  {
    "id": "hello-kitty-sammy",
    "nome": "Bratz Hello Kitty Sammy",
    "colecao": "Hello Kitty",
    "preco": 39990,
    "anterior": null,
    "imagem": "midia/hello-kitty-sammy-principal.webp",
    "estoque": 6,
    "novo": false,
    "oferta": false,
    "destaque": true,
    "nota": 4.9,
    "avaliacoes": 12,
    "descricao": "Sammy traz cabelos claros, blusa vermelha e jeans na combinação Hello Kitty para uma coleção cheia de estilo.",
    "detalhes": [
      "Cabelos claros com laço vermelho",
      "Blusa vermelha e calça jeans",
      "Detalhes Hello Kitty"
    ],
    "cor": "gray",
    "galeria": [
      "midia/hello-kitty-sammy-principal.webp",
      "midia/hello-kitty-sammy-vista-1.webp",
      "midia/hello-kitty-sammy-vista-2.webp",
      "midia/hello-kitty-sammy-vista-3.webp"
    ]
  },
  {
    "id": "blythe-cabelo-preto",
    "nome": "Blythe Noir",
    "colecao": "Blythe",
    "preco": 39000,
    "anterior": null,
    "imagem": "midia/blythe-cabelo-preto-principal.webp",
    "estoque": 6,
    "novo": true,
    "oferta": false,
    "destaque": false,
    "nota": 4.9,
    "avaliacoes": 12,
    "descricao": "Uma boneca de cabelos pretos, olhos expressivos e roupa escura. Pequenos detalhes para quem coleciona histórias.",
    "detalhes": [
      "Cabelos pretos com franja",
      "Olhos grandes e expressivos",
      "Roupa em preto"
    ],
    "cor": "gray",
    "galeria": [
      "midia/blythe-cabelo-preto-principal.webp",
      "midia/blythe-cabelo-preto-vista-1.webp",
      "midia/blythe-cabelo-preto-vista-2.webp",
      "midia/blythe-cabelo-preto-vista-3.webp",
      "midia/blythe-cabelo-preto-vista-4.webp",
      "midia/blythe-cabelo-preto-vista-5.webp",
      "midia/blythe-cabelo-preto-vista-6.webp",
      "midia/blythe-cabelo-preto-vista-7.webp"
    ]
  },
  {
    "id": "lagoona-blue",
    "nome": "Lagoona Blue",
    "colecao": "Monster High",
    "preco": 50000,
    "anterior": null,
    "imagem": "midia/lagoona-blue-principal.webp",
    "estoque": 6,
    "novo": true,
    "oferta": false,
    "destaque": false,
    "nota": 4.9,
    "avaliacoes": 12,
    "descricao": "Cabelos loiros, pele clara e um visual cheio de detalhes. Uma combinação marcante para sua coleção.",
    "detalhes": [
      "Cabelos loiros ondulados",
      "Detalhes em rosa e verde",
      "Peça para uma coleção cheia de personalidade"
    ],
    "cor": "gray",
    "galeria": [
      "midia/lagoona-blue-principal.webp",
      "midia/lagoona-blue-vista-1.webp",
      "midia/lagoona-blue-vista-2.webp",
      "midia/lagoona-blue-vista-3.webp",
      "midia/lagoona-blue-vista-4.webp"
    ]
  },
  {
    "id": "raven-queen",
    "nome": "Raven Queen — Purple Night",
    "colecao": "Ever After High",
    "preco": 22900,
    "anterior": null,
    "imagem": "midia/raven-queen-principal.webp",
    "estoque": 6,
    "novo": true,
    "oferta": false,
    "destaque": false,
    "nota": 4.9,
    "avaliacoes": 12,
    "descricao": "Tons de roxo, cabelos escuros e detalhes delicados. Uma escolha delicada, com um toque de mistério.",
    "detalhes": [
      "Cabelos escuros com mechas",
      "Visual em tons de roxo",
      "Detalhes delicados no figurino"
    ],
    "cor": "gray",
    "galeria": [
      "midia/raven-queen-principal.webp",
      "midia/raven-queen-vista-1.webp",
      "midia/raven-queen-vista-2.webp",
      "midia/raven-queen-vista-3.webp",
      "midia/raven-queen-vista-4.webp"
    ]
  },
  {
    "id": "bratz-fada-pop",
    "nome": "Bratz Fada Pop",
    "colecao": "Bratz",
    "preco": 45000,
    "anterior": null,
    "imagem": "midia/bratz-fada-pop-principal.webp",
    "estoque": 6,
    "novo": false,
    "oferta": true,
    "destaque": false,
    "nota": 4.9,
    "avaliacoes": 12,
    "descricao": "Uma peça com asas rosadas e muito estilo. Um achado especial para sua coleção.",
    "detalhes": [
      "Asas em tons de rosa",
      "Cabelos loiros",
      "Peça para uma coleção cheia de personalidade"
    ],
    "cor": "gray",
    "galeria": [
      "midia/bratz-fada-pop-principal.webp",
      "midia/bratz-fada-pop-vista-1.webp",
      "midia/bratz-fada-pop-vista-2.webp",
      "midia/bratz-fada-pop-vista-3.webp",
      "midia/bratz-fada-pop-vista-4.webp"
    ]
  },
  {
    "id": "barbie-bichop",
    "nome": "Barbie Bichop",
    "colecao": "Barbie",
    "preco": 132000,
    "anterior": null,
    "imagem": "midia/barbie-bichop-principal.webp",
    "estoque": 6,
    "novo": false,
    "oferta": true,
    "destaque": false,
    "nota": 4.9,
    "avaliacoes": 12,
    "descricao": "Cabelos loiros cacheados e um vestido delicado em tons suaves. Uma escolha cheia de delicadeza.",
    "detalhes": [
      "Cabelos loiros cacheados",
      "Vestido em tons suaves",
      "Detalhes em rosa"
    ],
    "cor": "gray",
    "galeria": [
      "midia/barbie-bichop-principal.webp",
      "midia/barbie-bichop-vista-1.webp",
      "midia/barbie-bichop-vista-2.webp",
      "midia/barbie-bichop-vista-3.webp",
      "midia/barbie-bichop-vista-4.webp"
    ]
  },
  {
    "id": "blythe-castanha",
    "nome": "Blythe Doll Castanha",
    "colecao": "Blythe",
    "preco": 13099,
    "anterior": null,
    "imagem": "midia/blythe-castanha-principal.webp",
    "estoque": 6,
    "novo": false,
    "oferta": true,
    "destaque": false,
    "nota": 4.9,
    "avaliacoes": 12,
    "descricao": "Cabelos castanhos e um vestido rosa delicado. Uma peça delicada, com olhos grandes e expressivos.",
    "detalhes": [
      "Cabelos castanhos",
      "Olhos grandes e expressivos",
      "Vestido rosa"
    ],
    "cor": "gray",
    "galeria": [
      "midia/blythe-castanha-principal.webp",
      "midia/blythe-castanha-vista-1.webp",
      "midia/blythe-castanha-vista-2.webp",
      "midia/blythe-castanha-vista-3.webp",
      "midia/blythe-castanha-vista-4.webp"
    ]
  },
  {
    "id": "frankie-stein",
    "nome": "Frankie Stein",
    "colecao": "Monster High",
    "preco": 42000,
    "anterior": null,
    "imagem": "midia/frankie-stein-principal.webp",
    "estoque": 6,
    "novo": false,
    "oferta": true,
    "destaque": false,
    "nota": 4.9,
    "avaliacoes": 12,
    "descricao": "Cabelos pretos e claros, pele verde e um visual marcante. Uma combinação cheia de atitude para sua coleção.",
    "detalhes": [
      "Cabelos em preto e branco",
      "Pele em tom de verde",
      "Figurino com detalhes quadriculados"
    ],
    "cor": "gray",
    "galeria": [
      "midia/frankie-stein-principal.webp",
      "midia/frankie-stein-vista-1.webp",
      "midia/frankie-stein-vista-2.webp",
      "midia/frankie-stein-vista-3.webp",
      "midia/frankie-stein-vista-4.webp"
    ]
  }
];
