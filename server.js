const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { getLanguage, translate } = require('./utils/i18n');
const { loadData } = require('./utils/dataLoader');
const { getProducts } = require('./utils/productService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Boycott API',
      version: '1.0.0',
      description: 'Backend API providing data about alternatives to non-ethical products',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const data = loadData();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get products with pagination and filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: string
 *           example: tech
 *         description: Filter by category ID
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *           example: US
 *         description: Filter by country code
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           default: en
 *           enum: [ar, bn, en, es, fr, id, tr, ur]
 *         description: Language preference
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       category:
 *                         type: string
 *                       country:
 *                         type: string
 *                       alternatives:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             link:
 *                               type: string
 *                             country:
 *                               type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *       500:
 *         description: Internal server error
 */
app.get('/products', (req, res) => {
  try {
    const lang = getLanguage(req);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categoryId = req.query.category_id;
    const countryCode = req.query.country;

    const result = getProducts(
      data.products,
      data.categories,
      data.countries,
      lang,
      { categoryId, countryCode },
      { page, limit }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all product categories
 *     tags: [Categories]
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           default: en
 *           enum: [ar, bn, en, es, fr, id, tr, ur]
 *         description: Language preference
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
app.get('/categories', (req, res) => {
  try {
    const lang = getLanguage(req);

    const translatedCategories = data.categories.map(category => ({
      id: category.id,
      name: translate(category.name, lang),
    }));

    res.json({ data: translatedCategories });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

/**
 * @swagger
 * /why-boycott:
 *   get:
 *     summary: Get educational content about boycotting
 *     tags: [Why Boycott]
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           default: en
 *           enum: [ar, bn, en, es, fr, id, tr, ur]
 *         description: Language preference
 *     responses:
 *       200:
 *         description: List of boycott reasons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       icon:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
app.get('/why-boycott', (req, res) => {
  try {
    const lang = getLanguage(req);

    const translatedReasons = data.whyBoycott.map(reason => ({
      icon: reason.icon,
      title: translate(reason.title, lang),
      description: translate(reason.description, lang),
    }));

    res.json({ data: translatedReasons });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});
