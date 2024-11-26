const chalk = require('chalk');
const fs = require('fs').promises;

const getParams = async (argv) => {
  const [, , ...args] = argv;
  const n = args.length;
  let port;
  let url;

  // if clear-cache flag provided

  if (args.indexOf('--clear-cache') > -1) {
    await clearCache();
    console.log(
      chalk.greenBright.bold(
        'All cache cleared. All Request would be forwarded'
      )
    );
  }

  if (args.indexOf('--port') > -1) {
    const portInd = args.indexOf('--port') + 1;

    if (
      portInd >= n ||
      isNaN(args[portInd]) ||
      isNaN(parseInt(args[portInd]))
    ) {
      console.log(chalk.red('Provide a valid port number or skip --port flag'));
      process.exit();
    } else {
      port = args[portInd];
    }
  }

  if (args.indexOf('--origin') > -1) {
    const urlInd = args.indexOf('--origin') + 1;
    if (urlInd >= n) {
      console.log(chalk.red('Provide a valid url'));
      process.exit();
    } else {
      url = args[urlInd];
      if (!URL.canParse(url)) {
        console.log(chalk.redBright('provide a valid url to serve'));
      }
    }
  } else {
    console.log(
      chalk.red(
        'Provide --origin flag and valid url to spin the caching proxy. For example caching-proxy --origin https://example.com'
      )
    );
    process.exit();
  }
  port = port || 3000;

  return { port, url };
};

const clearCache = async () => {
  const emptyCache = { cache: {} };
  try {
    await fs.writeFile('cache.json', JSON.stringify(emptyCache, null, 2)); // Write file asynchronously
    console.log('Cache cleared successfully.');
  } catch (err) {
    console.error('Error clearing cache:', err);
  }
};

const getCache = async (url) => {
  try {
    const data = await fs.readFile('cache.json', 'utf8'); // Read file asynchronously
    const cache = JSON.parse(data); // Parse JSON data
    return cache[url] || -1; // Return the value or -1 if not found
  } catch (err) {
    console.error('Error reading or parsing file:', err);
    return -1; // Return -1 on error
  }
};

const setCache = async (url, res) => {
  try {
    const data = await fs.readFile('cache.json', 'utf8'); // Read file asynchronously
    const cache = JSON.parse(data);
    cache[url] = res;
    await fs.writeFile('cache.json', JSON.stringify(cache, null, 2));
  } catch (err) {
    throw err;
  }
};

module.exports = { getParams, getCache, setCache };
