# MERN Stack Application with Docker

## Prerequisites
- Docker Engine (v20.10+) and Docker Compose (v2.0+)
- Node.js (v18+) - only needed for local development
- Git

## Setup
### 1. Clone the repository

git clone https://github.com/your-repo/botcalm.git
cd botcalm

### 2. Clone the repository
Create environment files by copying the examples:

cp botcalm-be-app/.env.example botcalm-be-app/.env

cp botcalm-fe-app/.env.example botcalm-fe-app/.env

Then edit the .env files with your actual values.

### 3. Run with Docker
docker-compose up --build
