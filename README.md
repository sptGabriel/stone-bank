# Tecnologias utilizadas
- TypeScript;

## 🔧 Executar localmente
- Siga as instruções da README.md;
- Clone este repositório `https://github.com/sptGabriel/stone-bank`;
- A porta 5432, deve está livre
- A porta 8080, deve está livre
- Execute o comando inciar o servidor em modo desenvolvimento: `yarn docker:up ou npm docker:up`;
- Execute o comando inciar o servidor com docker: `docker-compose up --build -d`;
- Para test execute o comando: yarn ou npm test

# Rotas

# `POST /api/accounts`

Cria uma nova conta para que a cliente possa começar a operar. A conta criada deve possui um saldo incial de **R$ 1000,00** (mil reais).

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

*Regras de validação para esta rota*

- `name` campo obrigatório. Um nome válido possui 8 ou mais caracteres;
- `email` campo obrigatório. Deve ser um e-mail válido;
- `password` campo obrigatório. Um password válido possui 8 ou mais caracteres;


# `POST /api/signin`

#### Exemplo de request

```sh
curl "http://localhost:3000/api/signin" \
     -H 'Content-Type: application/json' \
     -d '{
 				"email": "stone@stone.com",
       "password": "stone12345678"
     }'

```

*Regras de validação para esta rota*

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

#### Exemplo de response

```json
[{
    "id": "e69ede95-8793-4de9-ba2c-a1441f167e71",
    "origin_email": "michelangelo@tmnt.com",
    "target_email": "donatello@tmnt.com",
    "amount": 15000,
    "created_at": "2021-01-02T15:00:00Z"
},
{
    "id": "a0d8eb64-f804-4672-afaa-b3f61b22be61",
    "origin_email": "raphael@tmnt.com",
    "target_email": "michelangelo@tmnt.com",
    "amount": 15000,
    "created_at": "2021-01-02T15:00:00Z"
}]

```

# `POST /transfers`

Realiza a transferência entre o usuário autenticado e a conta de destino (`target_email`).

#### Exemplo de request

```sh
curl "http://localhost:3000/api/transfers" \
     -H 'Authorization: Bearer <TOKEN>' \
     -H 'Content-Type: application/json' \
     -d '{
       "target_email": "donatello@tmnt.com",
       "amount": 15000
     }' 

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
     }' "http://localhost:3000/api/withdraw"

```

##### <p align="center"> <strong> < desenvolvido por <a href="https://github.com/sptGabriel">Gabriel Costa</a> /> </strong> 👋