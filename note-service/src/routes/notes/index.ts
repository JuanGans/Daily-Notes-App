import { Router } from 'express';
import crudRoutes from './crud';
import byIdRoutes from './by-id';
import byDateRoutes from './by-date';
import uploadRoutes from './upload';


const router = Router();

router.use('/', crudRoutes);     // GET, POST /notes
router.use('/', byIdRoutes);     // GET, PUT, DELETE /notes/:id
router.use('/', byDateRoutes);   // GET /notes/by-date
router.use('/', uploadRoutes);   // POST /notes/upload

export default router;
