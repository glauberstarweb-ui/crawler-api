const express = require('express');

const app = express();

app.use(express.json());

app.post('/scan', async (req, res) => {
  return res.json([
    {
      titulo: "Teste imóvel",
      cidade: "Varginha",
      valor_avaliacao: 200000,
      valor_venda: 120000,
      link_imovel: "https://teste.com",
      link_matricula: "https://teste.com/matricula.pdf"
    }
  ]);
});

app.listen(process.env.PORT || 3000);
