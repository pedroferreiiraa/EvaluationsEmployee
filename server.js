const express = require('express');
const path = require('path');
const app = express();

// Caminho para a pasta onde os arquivos compilados do Angular estão
const distFolder = path.join(__dirname, 'dist', 'angular-shop');  // Substitua 'my-app' pelo nome correto da pasta gerada

// Serve os arquivos estáticos do Angular
app.use(express.static(distFolder));

// Redireciona todas as outras requisições para o arquivo index.html da sua aplicação Angular
app.get('*', (req, res) => {
  res.sendFile(path.join(distFolder, 'index.html'));
});

// Porta que o servidor Express vai rodar
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
