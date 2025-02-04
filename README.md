# Solita Dev Academy pre assignment Joni Harju

This project implements an Electricity Data Application that showcases electricity consumption data in both table and graph formats. The application fetches data from a database, processes it, and presents it in a structured manner

## Features

- Daily Electricity Statistics: Displays electricity data in a tabular format, summarizing daily statistics.
  - Filtering: Allows user to filter by min and max values of different columns.
  - Sorting: Allows users to sort columns in ascending and descending order
  - Searching: Allows users to search for a specific day
  - Pagination: Allows users to fetch more rows and go back to previous ones.
- Single Day View: Users can open a modal from the table to view a detailed breakdown of electricity usage for a selected day.
- Graphical Representation: Visualizes hourly electricity data through interactive graphs.
- End to end testing implemented with playwright
- API Endpoints
  -The backend provides the following API endpoints:
  - **GET `/api/daily-stats`** – Fetches daily electricity statistics.
  - **GET `/api/day/:date`** – Fetches detailed data for a specific day.

## Tech Stack

### Frontend

| Feature                | Library/Tool                                         |
| ---------------------- | ---------------------------------------------------- |
| **Frontend Framework** | [React](https://reactjs.org/)                        |
| **Build Tool**         | [Vite](https://vitejs.dev/)                          |
| **Styling**            | [Tailwind CSS](https://tailwindcss.com/)             |
| **Linting**            | [ESLint](https://eslint.org/)                        |
| **Data Tables**        | [TanStack Table](https://tanstack.com/table/latest/) |
| **Charts and graphs**  | [Recharts](https://recharts.org/en-US/)              |
| **Testing**            | [Playwright](https://playwright.dev/)                |

### Backend

| Feature               | Library/Tool                                                          |
| --------------------- | --------------------------------------------------------------------- |
| **Backend Framework** | [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) |
| **ORM**               | [Drizzle](https://orm.drizzle.team/)                                  |
| **Database**          | [PostgreSQL](https://www.postgresql.org/)                             |

### Deployment & Containerization

| Feature              | Library/Tool                      |
| -------------------- | --------------------------------- |
| **Containerization** | [Docker](https://www.docker.com/) |
| **Deployment**       | [Coolify](https://coolify.io/)    |

## Deployment

The application is deployed on a personal VPS using [Coolify](https://coolify.io/)

- frontend: https://solita.joniharju.fi/
- backend: https://solita.backend.joniharju.fi/

## Installation

Application can be run inside a **Docker container (recommended)** or in **development mode** if you want to modify the code and run tests.

### Docker

1.  first make sure you have docker installed in your computer if not go to https://docs.docker.com/desktop/ and install it

2.  clone this repository

```bash
git clone https://github.com/JonipHarju/joni-harju-solita-dev-academy-spring-2025-exercise.git
```

3. Then in your command line navigate to that folder and run

```bash
   docker compose up --build
```

4. after successfully running this you should be able to access:

- backend at (http://localhost:3010)
- frontend at (http://localhost:8081)

5. to stop and remove all running containers, run

```bash
docker compose down
```

### Development & Testing

⚠️ Note: If running in development you need to have your own version of the electricity-db running at port:5432.

1.  clone this repository

```sh
git clone https://github.com/JonipHarju/joni-harju-solita-dev-academy-spring-2025-exercise.git
```

2. Navigate to the root directory of the project in your terminal

```bash
cd joni-harju-solita-dev-academy-spring-2025-exercise
```

3. Navigate to the backend folder

```bash
cd backend
```

4. Install backend dependencies.

```bash
npm install
```

5. start the backend development server

```bash
npm run dev
```

6. Navigate back to the project root directory and then to the frontend directory

```bash
cd ..
cd frontend
```

7. install the frontend dependencies and playwright testing utilities.

```bash
npm install
npx playwright install
```

8. Start the development server for frontend

```bash
npm run dev
```

9. run tests

```bash
npx playwright test
```

10. View the frontend and backend dev instances

- backend at (http://localhost:3010)
- frontend at (http://localhost:5173)
