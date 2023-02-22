FROM node:16

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npm ci --silen
RUN npm install react-scripts@3.4.1 -g --silent
ENV PORT=80
ENV REACT_APP_BACKEND_URL=https://challengeme.me:8080

COPY ./ ./

RUN npm run build

# RUN npm
# # If you are building your code for production
# # RUN npm ci --only=production

# # Bundle app source
CMD ["npm", "run", "start"]

# Serve these static files with NGINX.
# FROM nginx:1.21.6-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]