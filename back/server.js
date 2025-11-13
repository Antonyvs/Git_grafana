const express = require('express');
const prometheus = require('prom-client');

const app = express();
const port = 3000;

// Criar uma métrica de contagem de requisições HTTP
const requestCounter = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'status'],
});

// Criar uma métrica de contagem de cliques no botão
const clickCounter = new prometheus.Counter({
  name: 'button_clicks_total',
  help: 'Total de cliques no botão',
});

// Middleware para contar as requisições
app.use((req, res, next) => {
  res.on('finish', () => {
    requestCounter.inc({ method: req.method, status: res.statusCode });
  });
  next();
});

// Rota para expor as métricas do Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});

// Rota para incrementar a contagem de cliques
app.post('/api/increment-clicks', (req, res) => {
  clickCounter.inc();  // Incrementa a contagem de cliques
  res.send('Clique registrado!');
});

// Rota principal
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

