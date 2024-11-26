# Caching-Proxy

##### Cache the response and serve without loading the main server

![alt text](image.png)

### Tech stack

- Server - Express Js
- Cache - Redis - ioredis

### Installation

```git clone https://github.com/Tribhuwan-Joshi/caching-proxy```  
```cd caching-proxy```  
```npm install```

### Usage

To start proxy - `npm run caching-proxy --port <number> --origin <url>`  
To clear cache - `npm run caching-proxy -- --clear-cache`
