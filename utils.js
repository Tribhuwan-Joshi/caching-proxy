const chalk = require('chalk');
const getParams = (argv) => {
  const [, , ...args] = argv;
  const n = args.length;
  let port;
  let url;

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

module.exports = getParams;
