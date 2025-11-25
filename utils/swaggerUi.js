const { getBaseUrl } = require('../config/constants');

function getSwaggerUiHtml() {
  const baseUrl = getBaseUrl();
  const specUrl = `${baseUrl}/api-docs/swagger.json`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boycott API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js" defer></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js" defer></script>
  <script>
    window.addEventListener('load', function() {
      if (typeof SwaggerUIBundle === 'undefined' || typeof SwaggerUIStandalonePreset === 'undefined') {
        document.getElementById('swagger-ui').innerHTML = 
          '<div style="padding: 20px; text-align: center;"><h2>Failed to load Swagger UI</h2><p>Please refresh the page.</p></div>';
        return;
      }
      
      window.ui = SwaggerUIBundle({
        url: "${specUrl}",
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout",
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true
      });
    });
  </script>
</body>
</html>`;
}

module.exports = { getSwaggerUiHtml };

