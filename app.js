// call the util fn and get cmd params
const { getParams, getCache, setCache } = require('./utils');
const axios = require('axios');
const { port, url } = getParams(process.argv);

// const express = require('express');
// const app = express();

// app.get('/', async (req, res) => {
//   const { data } = await axios.get(url);
//   res.status(201).json({ data });
// });

const getResponse = async (url) => {
  const res = getCache(url);
  if (res == -1) {
    try {
      const res = await axios.get(url);
      setCache(url, res);
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

getResponse(url);

console.log(port, url);
