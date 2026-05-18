const { readFileSync } = require('fs');
const { join } = require('path');

module.exports = (req, res) => {
  const html = readFileSync(join(__dirname, '..', 'apidocs', 'index.html'), 'utf8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.status(200).send(html);
};
