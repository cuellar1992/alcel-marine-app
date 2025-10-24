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

const router = express.Router()

router.route('/')
  .get(getAllClients)
  .post(createClient)

router.route('/:id')
  .put(updateClient)
  .delete(deleteClient)

export default router

