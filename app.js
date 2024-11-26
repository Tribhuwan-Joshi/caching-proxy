// call the util fn and get cmd params
const { getParams, getCache, setCache, clearCacheFn } = require('./utils');
const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());
const { clearCache, url, port } = getParams(process.argv);
const BaseUrl = 'http://localhost';

if (clearCache) {
  await clearCacheFn();
  process.exit();
}

app.use('/:target*', async (req, res) => {
  const originalUrl = req.originalUrl;
  const targetUrl = `${url}/${originalUrl}`;
  const cacheRes = getCache(targetUrl);
  if (cacheRes) {
    res
      .status(200)
      .header({ ...cacheRes.headers, 'X-CACHE': 'HIT' })
      .json({ data: cacheRes.data });
  } else {
    const axiosRes = await axios.get(targetUrl);
    const responseObj = {
      data: axiosRes.data,
      headers: axiosRes.headers,
    };

    setCache(targetUrl, responseObj);
    res
      .status(201)
      .header({ ...axiosRes.headers, 'X-CACHE': 'MISS' })
      .json({ data: axiosRes.data });
  }
});

app.listen(port, () =>
  console.log('proxy server started at ', `${BaseUrl}:${port}`)
);
