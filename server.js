const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.use(express.json());

app.post('/scan', async (req, res) => {

  try {

    const { url, uf, limite = 10 } = req.body;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(response.data);

    const oportunidades = [];

    $('a').each((i, el) => {

      const texto = $(el).text().trim();
      const href = $(el).attr('href');

      if (
        href &&
        texto &&
        oportunidades.length < limite
      ) {

        oportunidades.push({
          titulo: texto,
          cidade: uf,
          valor_avaliacao: null,
          valor_venda: null,
          link_imovel: href.startsWith('http')
            ? href
            : `https://venda-imoveis.caixa.gov.br${href}`,
          link_matricula: null
        });

      }

    });

    return res.json(oportunidades);

  } catch (error) {

    return res.status(500).json({
      erro: error.message
    });

  }

});

app.listen(process.env.PORT || 3000);
