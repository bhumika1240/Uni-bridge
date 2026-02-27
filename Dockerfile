# Base image to use
FROM node:latest

# set a working directory
WORKDIR /src

# Copy across project configuration information
# Install application dependencies
COPY package*.json /src/

# Ask npm to install the dependencies
RUN npm install -g supervisor && npm install && npm install supervisor

# Copy across all our files
COPY . /src

RUN npm install express pug body-parser mysql2 dotenv

#for hash password
RUN npm install express pug body-parser mysql2 dotenv bcrypt
# Expose our application port (3000)
EXPOSE 3000


