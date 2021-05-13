const express = require("express");
const cors = require("cors");

 const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];                                                                                                          //Array que recebe todos os repositorios cadastrados

app.get("/repositories", (request, response) => {
  const { title } = request.query;                                                                                                //Recebe o titulo como filtro de busca no query 

  const results = title                                                                                                           //Teste para verificar se há repositorios com o nome do filtro
  ? repositories.filter(repository => repository.title.include(title))
  : repositories;                                                                                                                 //Se não houver retorna todos os repositorios

  return response.json(results)
  
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;                                                                                  //Parametros obrigatorios informados no body

  const repository = {                                                                                                         //Objeto contendo as informações de cadastro de um novo projeto
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);                                                                                                //Adiciona novo objeto no array

  return response.json(repository);                                                                                             //Retorna o objeto criado
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;                                                                                                  //Informa o id no endereco da requisição
  const { title, url, techs } = request.body;                                                                                     //valores que deverm se passados no body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);                                             //Procura o index do repository dentro do array repositories comparando o id

  if(repositoryIndex < 0){                                                                                                        //Verifica se o index é invalido (<0)
    return response.status(400).json({error: 'Repository not found'});                                                            //retorna erro por não existir o id informado no array
  }

  const repository = {                                                                                                            //Se exitir e não cair no erro, os valores do array serão substituidos pelos informados no body da requisição 
    url,
    title,
    techs,
  }

  repositories[repositoryIndex] = {                                                                                               //Atualiza dentro do array apenas as alterações feitas do repositorio.
    ...repositories[repositoryIndex],
    ...repository
  };                                                                                     

  return response.json(repositories[repositoryIndex])                                                                             //Retorna o repositorio que foi alterado.
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;                                                                                                  //Recebe o id como parametros

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);                                             //Verifica dentro do array repositores, o index do id infomado no parametro  

  if(repositoryIndex < 0){                                                                                                        //Se retornar menor que zero quer dizer que não existe
    return response.status(400).json({error: 'Repository not found !'})                                                           //Retorna mensagem de erro com status 400
  }

  repositories.splice(repositoryIndex, 1);                                                                                        //Exclui 1 registro começando do index encontrado
  return response.status(204).send();                                                                                             //Retorna status 200 sem mensagem.
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;                                                                                                  //Informa o id no endereco da requisição

  const repository = repositories.find(repository => repository.id === id);                                                       //Procura o ferpository dentro do array repositories comparando o id

  if(!repository){
    return response.status(400).send();
  }

  repository.likes += 1;                                                                                                          //Aumenta mais um like no repositorio informado no id

  return response.json(repository)                                                                                                //Retorna o repositorio informado no id com 1 like a mais
});

module.exports = app;
