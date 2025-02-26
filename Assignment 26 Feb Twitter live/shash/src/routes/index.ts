import { Router } from 'express';
import { bookRoutes } from './books';

const router = Router();

router.get('/', (req, res) => {
    res.send('Welcome to the Book Store API');
});

router.use('/api/books', bookRoutes);

export const routes = router;
