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

const router = express.Router()

router.route('/')
  .get(getAllPorts)
  .post(createPort)

router.route('/:id')
  .put(updatePort)
  .delete(deletePort)

export default router

