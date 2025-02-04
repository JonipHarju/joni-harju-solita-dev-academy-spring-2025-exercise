# Step 1: Build the vite react app
FROM node:18 AS build
# Declare the build-time argument for VITE_BACKEND_URL
ARG VITE_BACKEND_URL
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" > .env.production
RUN npm run build  # Creates "dist/" folder

# Step 2: Use Nginx to serve the built app
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
