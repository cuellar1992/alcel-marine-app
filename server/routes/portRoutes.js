/**
 * Port Routes
 * API endpoints for ports
 */

import express from 'express'
import {
  getAllPorts,
  createPort,
  updatePort,
  deletePort
} from '../controllers/portController.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { requireAdmin, requireUserOrAdmin } from '../middleware/roleMiddleware.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

router.route('/')
  .get(getAllPorts)
  .post(requireUserOrAdmin, createPort)

router.route('/:id')
  .put(requireUserOrAdmin, updatePort)
  .delete(requireAdmin, deletePort)

export default router

