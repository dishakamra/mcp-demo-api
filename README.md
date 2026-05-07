# mcp-demo-api

A small Express.js REST API for managing products, used as a demo project. Data is stored in-memory.

## Requirements

- Node.js 18+ (Node 20+ recommended)
- npm 9+

## Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/dishakamra/mcp-demo-api.git
cd mcp-demo-api
npm install
```

## Run

| Command | Description |
| --- | --- |
| `npm start` | Start the server with Node (`node src/server.js`). |
| `npm run dev` | Start the server with nodemon (auto-reload on file changes). |
| `npm test` | Run the Jest test suite. |

By default the server listens on port `3000`. Override with the `PORT` environment variable:

```bash
# Windows (cmd)
set PORT=4000 && npm start

# PowerShell
$env:PORT=4000; npm start

# bash
PORT=4000 npm start
```

Health check: <http://localhost:3000/health>

## Endpoints

Base URL: `http://localhost:3000`

### Health

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Returns `{ "status": "ok" }`. |

### Products

| Method | Path | Description | Success | Errors |
| --- | --- | --- | --- | --- |
| GET | `/products` | List all products. | 200 | — |
| GET | `/products/:id` | Get a product by id. | 200 | 404 |
| POST | `/products` | Create a new product. | 201 | 400 |
| PUT | `/products/:id` | Update an existing product. | 200 | 400, 404 |
| DELETE | `/products/:id` | Delete a product. | 204 | 404 |

#### Product schema

```json
{
  "id": "string",
  "name": "string (>= 2 chars)",
  "price": "number (> 0)"
}
```

Validation rules (enforced on `POST` and `PUT`):

- `name` — string, at least 2 characters.
- `price` — number, greater than 0.

A `400` response includes the failed rules under `details`:

```json
{
  "error": "Invalid product",
  "details": ["name must be a string with at least 2 characters"]
}
```

#### Examples

Create a product:

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Notebook\",\"price\":9.99}"
```

List products:

```bash
curl http://localhost:3000/products
```

Update a product:

```bash
curl -X PUT http://localhost:3000/products/<id> \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Notebook Pro\",\"price\":14.5}"
```

Delete a product:

```bash
curl -X DELETE http://localhost:3000/products/<id>
```

## Testing

Tests use [Jest](https://jestjs.io/) and [supertest](https://github.com/ladjs/supertest).

```bash
# Run all tests
npm test

# Run a specific file
npx jest tests/integration/products.api.test.js

# Watch mode
npx jest --watch
```

Test layout:

- `tests/unit/` — unit tests (e.g. model validation).
- `tests/integration/` — HTTP-level tests against the Express app via supertest.

## Project Structure

```
src/
  server.js              # Express app + bootstrap
  routes/products.js     # /products routes
  services/productService.js
  models/product.js      # validation
tests/
  unit/
  integration/
```
