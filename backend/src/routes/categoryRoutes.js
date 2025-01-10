// test CRUD ok
import express from 'express';
import { CategoryController } from '../controllers/Category/CategoryController.js';
const CategoryRoute = express.Router()
const categroryController = new CategoryController()


CategoryRoute.post('/create', categroryController.create); 
CategoryRoute.get('/all', categroryController.getAll);
CategoryRoute.get('/:id', categroryController.getCategoryById);
CategoryRoute.put('/:id/edit', categroryController.updateCategory);
CategoryRoute.delete('/:id/delete', categroryController.deleteCategory);

export {CategoryRoute};
