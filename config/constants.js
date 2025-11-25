const PORT = process.env.PORT || 3000;

const PRODUCTION_DOMAIN = 'https://boycott.api.yaqiin.org';

function getBaseUrl() {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    return PRODUCTION_DOMAIN;
  }
  return `http://localhost:${PORT}`;
}

module.exports = {
  PORT,
  getBaseUrl,
  PRODUCTION_DOMAIN,
};

