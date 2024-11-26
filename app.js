// call the util fn and get cmd params
const { getParams, getCache, setCache, clearCacheFn } = require('./utils');
const axios = require('axios');
const chalk = require('chalk');
const express = require('express');
const app = express();
app.use(express.json());
const { clearCache, url, port } = getParams(process.argv);

if (clearCache) {
  clearCacheFn().then((res) => {
    console.log(chalk.blueBright('All cache cleared'));
    process.exit();
  });
}

app.use('/:target*', async (req, res, next) => {
  const originalUrl = req.originalUrl;
  const targetUrl = `${url}${originalUrl}`;
  const cacheRes = await getCache(targetUrl);
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

    await setCache(targetUrl, responseObj);
    res
      .status(200)
      .header({ ...axiosRes.headers, 'X-CACHE': 'MISS' })
      .json({ data: axiosRes.data });
  }
  next();
});

app.listen(port, () => console.log('proxy server started'));
