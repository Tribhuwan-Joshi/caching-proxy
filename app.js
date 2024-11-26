// call the util fn and get cmd params
const { getParams, getCache, setCache } = require('./utils');
const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());
const { clearCache, url, port } = getParams(process.argv);
const BaseUrl = 'http://localhost';

const clearCacheFn = async () => {
  const emptyCache = { cache: {} };
  try {
    await fs.writeFile('cache.json', JSON.stringify(emptyCache, null, 2)); // Write file asynchronously
    console.log('Cache cleared successfully.');
  } catch (err) {
    console.error('Error clearing cache:', err);
  }
};

if (clearCache) {
  await clearCacheFn();
  process.exit();
}

app.use('/:target*', async (req, res) => {
  const originalUrl = req.originalUrl;
  const targetUrl = `${url}/${originalUrl}`;
  const cacheRes = getCache(targetUrl);
  if (cacheRes) {
    res.status(200).header.json({ data: cacheRes.data });
  } else {
    const axiosRes = await axios.get(targetUrl);
    const responseObj = {
      data: axiosRes.data,
      headers: axiosRes.headers,
    };

    setCache(targetUrl, responseObj);
    res.status(201).header({ 'X-CACHE': 'MISS' }).json({ data: cacheRes });
  }
});

app.listen(port, () =>
  console.log('proxy server started at ', `${BaseUrl}:${port}`)
);
