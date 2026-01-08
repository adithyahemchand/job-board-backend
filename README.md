# Job Board – Backend

## Overview

This repository contains the backend APIs for a simple Job Board application built as part of an internship evaluation.

The backend is implemented as a standalone service and focuses on clean API design, cursor-based pagination, and a clear separation of concerns using Domain-Driven Design (DDD).

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Architecture: Domain-Driven Design (DDD)

---

## Features

- Role-based authorization via cookies (User: read-only, Admin: CRUD)
- Job listing with cursor-based pagination
- Stable ordering using `postedDate + jobId`
- Admin-only create, update, and delete operations

Each job includes title, author, posted date, and description.  
Duplicate titles are allowed; jobs are uniquely identified by `jobId`.

Pagination uses a cursor (`postedDate`, `jobId`) passed via query params and returns a `loadMore` flag.

---

## Project Structure

The codebase follows a layered structure:

- Domain: Core entities and repository interfaces
- Application: Use cases and DTOs
- Infrastructure: MongoDB implementations
- Interfaces: HTTP controllers, routes, and middleware

Business logic remains independent of framework and database details.

---

## MongoDB Setup

1. Install MongoDB Community Server: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Start MongoDB:

   ```bash
   mongod
   ```

3. Add the URI in your .env file. MongoDB will automatically create the database on first write.
   example : mongodb://localhost:27017/job-board

---

## Setup & Run Locally

Clone the repo:

```bash
git clone <repo-url>
cd <repo-folder>
```

Create a `.env` file with the following values:

```bash
PORT=<backend-port>
MONGO_URI=<your-mongodb-uri>
MONGO_TEST_URI=<your-mongodb-uri-for-tests>
FRONTEND_ORIGIN=<your-frontend-url>
```

Install and run:

```sh
npm install
npm run dev
```

The server exposes a `/health` endpoint for basic sanity checks.

---

## Testing

Run the following command in the terminal:

```bash
npm run test
```

or, if you want to run in watch mode:

```bash
npm run test:watch
```
