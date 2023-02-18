const winston = require('winston')

const { combine, prettyPrint, timestamp } = winston.format;
const LEVEL = Symbol.for('level');
function filterOnly(level) {
  return format(function (info) {
    if (info[LEVEL] === level) {
      return info;
    }
  })();
}
function buildDefaultLogger() {
  return winston.createLogger({
    format: combine(timestamp(), prettyPrint()),
    transports: [new winston.transports.Console({ level: 'info' })],
  });
}

function buildProdLogger() {
  return winston.createLogger({
    format: combine(timestamp(), prettyPrint()),
    transports: [
      new winston.transports.File({
        level: 'warn',
        format: filterOnly('warn'),
        filename: 'warn.log',
      }),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
  });
}

let logger = buildDefaultLogger();
if (process.env.NODE_ENV == 'prod') {
  logger = buildProdLogger();
}

module.exports = logger;