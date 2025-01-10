// test CRUD ok
import express from 'express';
import { TagController } from '../controllers/Tag/TagController.js';
const TagRoute = express.Router()
const tagcontroller = new TagController()


TagRoute.post('/create', tagcontroller.create); 
TagRoute.get('/all', tagcontroller.getAll);
TagRoute.get('/:id', tagcontroller.getTagById);
TagRoute.put('/:id/edit', tagcontroller.updateTag);
TagRoute.delete('/:id/delete', tagcontroller.deleteTag);

export {TagRoute};
