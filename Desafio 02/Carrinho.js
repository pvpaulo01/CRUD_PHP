// Função para obter o carrinho do localStorage
function obterCarrinhoDoLocalStorage() {
  // Verifica se há um carrinho no localStorage
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  return carrinho;
}

// Função para adicionar uma pizza ao carrinho
function adicionarAoCarrinho(id, foto, descricao, preco) {
  // Obtém o carrinho do localStorage
  let carrinho = obterCarrinhoDoLocalStorage();

  // Verifica se a pizza já está no carrinho
  const index = carrinho.findIndex(item => item.id === id);

  let quantidadeTotal = 0;

  if (index !== -1) {
    // Se a pizza já está no carrinho, incrementa a quantidade
    carrinho[index].quantidade += 1;
    carrinho[index].total = carrinho[index].quantidade * carrinho[index].preco;
    quantidadeTotal = carrinho[index].quantidade;
  } else {
    // Se a pizza não está no carrinho, adiciona como um novo item
    carrinho.push({ id, foto, descricao, preco, quantidade: 1, total: preco });
    quantidadeTotal = 1;
  }

  // Atualiza o localStorage com o novo carrinho
  localStorage.setItem('carrinho', JSON.stringify(carrinho));

  // Exibe um alerta para confirmar que a pizza foi adicionada ao carrinho (opcional)
  alert(`Pizza ${descricao} adicionada ao carrinho!`);

  // Atualiza o carrinho na página
  exibirCarrinhoNaPagina();

  // Retorna a quantidade total de produtos com o mesmo ID
  return quantidadeTotal;
}


// Função para exibir o carrinho na página de carrinho
// ...

// Função para exibir o carrinho na página de carrinho
function exibirCarrinhoNaPagina() {
  // Obtém o carrinho do localStorage
  const carrinho = obterCarrinhoDoLocalStorage();

  // Selecione o elemento onde você deseja exibir o carrinho
  const carrinhoElement = document.getElementById('carrinho');

  // Selecione o elemento onde você deseja exibir o total do pedido
  const totalElement = document.getElementById('total');

  // Verifica se o elemento foi encontrado antes de tentar modificá-lo
  if (carrinhoElement && totalElement) {
    // Limpe o conteúdo existente no elemento (evitar duplicatas)
    carrinhoElement.innerHTML = '';
    totalElement.innerHTML = '';

    // Mapa para armazenar a soma dos itens por id
    const somaPorId = new Map();

    // Variável para armazenar o total do pedido
    let totalPedido = 0;

    // Itera sobre os itens do carrinho e os soma por id
    carrinho.forEach(item => {
      const id = item.id;
      const precoItem = item.quantidade * item.preco;

      // Se o id já existe no mapa, soma o preço
      if (somaPorId.has(id)) {
        somaPorId.set(id, somaPorId.get(id) + precoItem);
      } else {
        somaPorId.set(id, precoItem);
      }
    });

    // Itera sobre os ids únicos e exibe os itens agrupados
    somaPorId.forEach((totalItem, id) => {
      const itemNoCarrinho = carrinho.find(item => item.id === id);

      const itemElement = document.createElement('div');
      itemElement.className = 'item';

      itemElement.innerHTML = `
        <img src="${itemNoCarrinho.foto}" alt="${itemNoCarrinho.descricao}">
        <div class="info">
          <h2>${itemNoCarrinho.descricao}</h2>
          <p>Preço unitário: R$ ${itemNoCarrinho.preco.toFixed(2)}</p>
          <p>Total: R$ ${itemNoCarrinho.preco.toFixed(2)}</p>
        </div>
        <button class="remover" data-id="${itemNoCarrinho.id}">Remover</button>
        
      `;

      carrinhoElement.appendChild(itemElement);

      // Adiciona o total do item ao total do pedido
      totalPedido += totalItem;
    });

    // Exibe o total do pedido no elemento correspondente
    totalElement.innerHTML = `<p>Total do Pedido: R$ ${totalPedido.toFixed(2)}</p>`;

    // Adiciona os manipuladores de eventos para os botões "Remover"
    const botoesRemover = document.querySelectorAll('.remover');
    botoesRemover.forEach(botao => {
      botao.addEventListener('click', () => {
        const idProduto = botao.getAttribute('data-id');
        removerDoCarrinho(idProduto);
        location.reload();
      });
    });
  } else {
    console.error('Elemento do carrinho ou total não encontrado.');
  }
}

// Função para remover um item do carrinho
function removerDoCarrinho(id) {
  let carrinho = obterCarrinhoDoLocalStorage();
  const carrinhoFiltrado = carrinho.filter(item => item.id !== id);
  localStorage.setItem('carrinho', JSON.stringify(carrinhoFiltrado));
  exibirCarrinhoNaPagina();
}



// Chame a função para exibir o carrinho na inicialização da página de carrinho
exibirCarrinhoNaPagina();
