# NG2 Backend
The backend service for the ng2 Api.

# Requirements
1. [Node.JS](https://nodejs.org/en/download)
2. [Docker](https://www.docker.com)

# Additional Requirements
1. Mongodb  

# Mongodb
1. docker pull circleci/mongo:3.6.5
2. docker run --name ng2-mongo --publish 27017:27017 -d mongo
3. npm run create-mongo-admin-user
4. npm run create-mongo-api-user

# Environment Variables
List of environment variables that needs to be exported.
They are served as sensitive data which are serve in our
production environment

* NG2_SERVER_PORT
* NG2_JWT_SECRET
* NG2_MONGO_DBURL
* NG2_MONGO_DBNAME

# Running the server (dev mode)
1. npm install
2. npm run dev

# Running the server (prod mode)
1. npm install
2. NODE_ENV=production
3. npm run prod

# Utilities
**`npm run lint`** - for checking our code structure.  
**`npm run test`** - running our unit test specs.  

