/**
 * Client Routes
 * API endpoints for clients
 */

import express from 'express'
import {
  getAllClients,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/clientController.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { requireAdmin, requireUserOrAdmin } from '../middleware/roleMiddleware.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

router.route('/')
  .get(getAllClients)
  .post(requireUserOrAdmin, createClient)

router.route('/:id')
  .put(requireUserOrAdmin, updateClient)
  .delete(requireAdmin, deleteClient)

export default router

