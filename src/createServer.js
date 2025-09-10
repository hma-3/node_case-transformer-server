const http = require('http');
const { validate } = require('./validate');
const { convertToCase } = require('./convertToCase');

const createServer = () =>
  http.createServer((req, res) => {
    const { pathname, searchParams } = new URL(
      req.url,
      `http://${req.headers.host}`,
    );
    const originalText = pathname.slice(1);
    const targetCase = searchParams.get('toCase');
    const errors = validate(originalText, targetCase);

    res.setHeader('Content-type', 'application/json');

    if (errors.length) {
      res.statusCode = 400;
      res.end(JSON.stringify({ errors }));

      return;
    }

    const { originalCase, convertedText } = convertToCase(
      originalText,
      targetCase,
    );

    res.statusCode = 200;

    res.end(
      JSON.stringify({
        originalCase,
        targetCase,
        convertedText,
        originalText,
      }),
    );
  });

module.exports = {
  createServer,
};
