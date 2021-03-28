# Tecnologias utilizadas

- TypeScript;

## 🔧 Executar localmente

- Siga as instruções da README.md;
- Clone este repositório `https://github.com/sptGabriel/stone-bank`;
- A porta 5432, deve está livre
- A porta 8080, deve está livre
- Execute o comando inciar o servidor em modo desenvolvimento: `yarn docker:up ou npm docker:up ou docker-compose up --build -d`;
- Para test execute o comando: yarn ou npm test

# Rotas

# `POST /api/accounts`

Cria uma nova conta para que a cliente possa começar a operar. A conta criada possui um saldo incial de **R$ 1000,00** (mil reais).

#### Exemplo de request

```sh
curl "http://localhost:8080/api/accounts" \
     -H 'Content-Type: application/json' \
     -d '{
       "name": "stone stone",
       "email": "stone@stone.com",
       "password": "stone12345678"
     }'

```

_Regras de validação para esta rota_

- `name` campo obrigatório. Um nome válido possui 8 ou mais caracteres;
- `email` campo obrigatório. Deve ser um e-mail válido;
- `password` campo obrigatório. Um password válido possui 8 ou mais caracteres;

#### Exemplo de response

```json
{
  "id": "6c2409e2-b4ef-463a-a757-6378fb3ee9a2",
  "name": "stonedasdsad",
  "email": "biel2@stone.com.br",
  "balance": 1000
}
```

# `POST /api/signin`

#### Exemplo de request

```sh
curl "http://localhost:8080/api/signin" \
     -H 'Content-Type: application/json' \
     -d '{
 	"email": "stone@stone.com",
       "password": "stone12345678"
     }'

```

_Regras de validação para esta rota_

- `email` campo obrigatório;
- `password` campo obrigatório;

#### Exemplo de response

```json
{
    "token": <TOKEN>
}
```

## Rotas autenticadas

O token retornado pela rota de login deve ser repassado as rotas seguintes através do header de Authorization.

```
Authorization: Bearer <TOKEN>
```

# `GET /transfers`

Obtém o extrato de transferências efetuadas e recebidas referente a conta autenticada.

_Parametros da paginação_

- `limit` Deve ser um number, retornar um limite de transferências;
- `page` Deve ser um number, retorna a pagina;

```sh
curl -X GET \
     -H 'Authorization: Bearer <TOKEN>' \
     -H 'Content-Type: application/json' \
     -d '{
       "amount": 30000
     }' "http://localhost:8080/api/transfers?limit=5&page=1"

```

#### Exemplo de response

```json
[
  {
    "id": "a9bb80d2-c5e7-4661-b1e6-3187da1ae7b1",
    "owner_email": "biel@stone.com.br",
    "target_email": "biel2@stone.com.br",
    "amount": "1.00",
    "created_at": "2021-03-27T15:44:38.846Z"
  },
  {
    "id": "58887e64-865b-4e1d-91ac-c094575b4c53",
    "owner_email": "biel@stone.com.br",
    "target_email": "biel2@stone.com.br",
    "amount": "1.00",
    "created_at": "2021-03-27T15:44:38.662Z"
  },
  {
    "id": "dc5f973b-a56a-40e6-800e-9dfa1ce93da1",
    "owner_email": "biel@stone.com.br",
    "target_email": "biel2@stone.com.br",
    "amount": "1.00",
    "created_at": "2021-03-27T15:44:38.483Z"
  },
  {
    "id": "ed848bf2-ae4b-4523-b191-d127bf788076",
    "owner_email": "biel@stone.com.br",
    "target_email": "biel2@stone.com.br",
    "amount": "1.00",
    "created_at": "2021-03-27T15:44:38.290Z"
  },
  {
    "id": "a28a4810-7393-43a3-8fba-cf3f78893004",
    "owner_email": "biel@stone.com.br",
    "target_email": "biel2@stone.com.br",
    "amount": "1.00",
    "created_at": "2021-03-27T15:44:38.098Z"
  }
]
```

# `POST /transfers`

Realiza a transferência entre o usuário autenticado e a conta de destino (`target_email`).

#### Exemplo de request

```sh
curl "http://localhost:8080/api/transfers" \
     -H 'Authorization: Bearer <TOKEN>' \
     -H 'Content-Type: application/json' \
     -d '{
       "target_email": "donatello@tmnt.com",
       "amount": 15000
     }'

```

#### Exemplo de response

```json
{
  "id": "2941a4e4-8dd0-438d-b5b8-967e83abf229",
  "origin_email": "biel@stone.com.br",
  "target_email": "biel2@stone.com.br",
  "amount": 1,
  "created_at": "2021-03-27T15:44:39.775Z"
}
```

# `POST /api/withdraw`

Realiza o saque de um determinado valor(`amount`).

#### Exemplo de request

```sh
curl -X POST \
     -H 'Authorization: Bearer <TOKEN>' \
     -H 'Content-Type: application/json' \
     -d '{
       "amount": 30000
     }' "http://localhost:8080/api/withdraw"

```

#### Exemplo de response

```json
{
  "message": "Money withdrawn successfully",
  "accounts": {
    "id": "5da13957-5067-402b-ba6b-b3b9b99a0b8b",
    "name": "stonedasdsad",
    "email": "biel@stone.com.br",
    "balance": "997.00"
  }
}
```

##### <p align="center"> <strong> < desenvolvido por <a href="https://github.com/sptGabrie/">Gabriel Costa</a> /> </strong> 👋
