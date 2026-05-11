const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

app.post('/scan', async (req, res) => {
  const { url, uf = 'MG', limite = 10 } = req.body;

  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
    });

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    const title = await page.title();

    const links = await page.$$eval('a', (anchors, limite) => {
      return anchors
        .map(a => ({
          titulo: (a.innerText || '').trim(),
          link_imovel: a.href || null
        }))
        .filter(x => x.titulo && x.link_imovel)
        .slice(0, limite);
    }, limite);

    const oportunidades = links.map(item => ({
      titulo: item.titulo,
      cidade: uf,
      valor_avaliacao: null,
      valor_venda: null,
      link_imovel: item.link_imovel,
      link_matricula: null
    }));

    return res.json({
      ok: true,
      pagina: title,
      total: oportunidades.length,
      oportunidades
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      erro: error.message
    });

  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(process.env.PORT || 3000);
