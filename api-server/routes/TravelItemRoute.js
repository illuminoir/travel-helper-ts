import express from 'express';
import { createItem, deleteTravelItemById, getAllTravelItems, getTravelItemById, updateTravelItemById } from '../controllers/TravelItemController.js';

const router = express.Router()

router.post("/item", createItem)
router.get("/items", getAllTravelItems)
router.delete("/item/:id", deleteTravelItemById)
router.put("/item/:id", updateTravelItemById)
router.get("/item/:id", getTravelItemById)

export default router