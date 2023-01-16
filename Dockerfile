# build environment
FROM node:16-alpine as builder
WORKDIR /code/
ADD package-lock.json .
ADD package.json .
RUN npm ci
ADD . .
RUN npm run build

FROM devforth/spa-to-http:latest
COPY --from=builder /code/dist/ .
