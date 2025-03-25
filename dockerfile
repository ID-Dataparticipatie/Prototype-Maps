FROM alpine AS builder

# Install dependencies
RUN apk update && \
apk add nodejs npm

WORKDIR /app

COPY . . 

RUN npm install --verbose
RUN npm run build


FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html/
EXPOSE 80