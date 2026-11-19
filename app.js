
import express from 'express';
import { produtos } from './produto.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// GET - Listar todos os produtos
app.get('/produtos', (req, res) => {
    res.status(200).json(produtos);
});

// GET - Buscar produto por ID
app.get('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === id);

    if (produto) {
        res.status(200).json(produto);
    } else {
        res.status(404).json({ mensagem: 'Produto não encontrado' });
    }
});

// GET - Buscar produto por Categoria
app.get('/produtos/categoria/:cat', (req, res) => {
    const categoria = req.params.cat;
    const produtosFiltrados = produtos.filter(p => p.categoria === categoria);

    if (produtosFiltrados.length > 0) {
        res.status(200).json(produtosFiltrados);
    } else {
        res.status(404).json({ mensagem: `Nenhum produto encontrado na categoria ${categoria}` });
    }
});

// POST - Cadastrar produto
app.post('/produtos', (req, res) => {
    const { nome, preco, estoque, categoria } = req.body;

    if (!nome || preco === undefined || estoque === undefined || !categoria) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    const novoProduto = {
        id: produtos.length + 1,
        nome,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        categoria
    };

    produtos.push(novoProduto);

    res.status(201).json(novoProduto);
});

// PUT - Atualizar produto
app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, preco, estoque, categoria } = req.body;
    const index = produtos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            mensagem: `Produto com ID ${id} não encontrado para atualização`
        });
    }

    if (!nome || preco === undefined || estoque === undefined || !categoria) {
        return res.status(400).json({
            mensagem: 'Todos os campos (nome, preco, estoque, categoria) devem ser informados'
        });
    }

    produtos[index] = {
        id,
        nome,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        categoria
    };

    res.status(200).json(produtos[index]);
});

// DELETE - Excluir produto
app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = produtos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            mensagem: `Produto com ID ${id} não encontrado para exclusão`
        });
    }

    const [produtoRemovido] = produtos.splice(index, 1);

    res.status(200).json({
        mensagem: `Produto com ID ${id} removido com sucesso`,
        produto: produtoRemovido
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Acesse http://localhost:${PORT}/produtos para testar.`);
});
