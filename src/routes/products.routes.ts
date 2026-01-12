import { Router } from 'express';
import * as productsController from '../controllers/products.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

// GET /api/v1/products
router.get('/', productsController.getAllProducts);

// GET /api/v1/products/best-sellers
router.get('/best-sellers', productsController.getBestSellers);

// GET /api/v1/products/new-arrivals
router.get('/new-arrivals', productsController.getNewArrivals);

// GET /api/v1/products/featured
router.get('/featured', productsController.getFeaturedProducts);

// GET /api/v1/products/search
router.get('/search', productsController.searchProducts);

// GET /api/v1/products/recommended (requires auth)
router.get('/recommended', authenticate, productsController.getRecommended);

// GET /api/v1/products/:slug (MUST be last - catches all slugs)
router.get('/:slug', productsController.getProductBySlug);

export default router;

