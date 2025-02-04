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

## Installation

Application can be run inside a docker as unified project, or you can run the fontend and backend separately if you have the database running on your machine.

### Docker

1. Inr your terminal navigate to the project folder.

```bash

```

destroy
docker-compose down

build
docker-compose up --build

docker ps list running containers
