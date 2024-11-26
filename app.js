// call the util fn and get cmd params
const getParams = require('./utils');
const { port, url } = getParams(process.argv);

console.log(port, url);
