// call the util fn and get cmd params
const { getParams, getCache, setCache } = require('./utils');
const axios = require('axios');
const getResponse = async (url) => {
  const res = await getCache(url);
  if (res == -1) {
    try {
      const res = await axios.get(url);
      await setCache(url, res);
      res.headers['x-cache'] = 'MISS';
      console.log(res.headers);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      return;
    }
  } else {
    console.log('HIT HOGYA');
    res.headers['x-cache'] = 'HIT';
    console.log(res.headers);
    console.log(res.data);
  }
};

const runProxy = async () => {
  const { port, url } = await getParams(process.argv);
  const res = await getResponse(url);
  console.log(res);
};

runProxy();
