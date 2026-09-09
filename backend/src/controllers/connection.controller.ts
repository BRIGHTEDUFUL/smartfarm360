import { Request, Response } from 'express';
import { ConnectionService } from '../services/connection.service';

export class ConnectionController {
  static async getConnections(req: Request, res: Response): Promise<void> {
    try {
      const connections = await ConnectionService.getConnections(req.user!.id);
      res.json({ success: true, data: connections });
    } catch {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch connections' } });
    }
  }

  static async getPending(req: Request, res: Response): Promise<void> {
    try {
      const pending = await ConnectionService.getPendingRequests(req.user!.id);
      res.json({ success: true, data: pending });
    } catch {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch pending requests' } });
    }
  }

  static async sendRequest(req: Request, res: Response): Promise<void> {
    try {
      const addresseeId = parseInt(req.params.userId);
      if (isNaN(addresseeId)) {
        res.status(400).json({ success: false, error: { code: 'INVALID_ID', message: 'Invalid user ID' } });
        return;
      }
      const connection = await ConnectionService.sendRequest(req.user!.id, addresseeId);
      res.status(201).json({ success: true, data: connection });
    } catch (err: any) {
      if (err.message === 'Connection already exists') {
        res.status(409).json({ success: false, error: { code: 'DUPLICATE', message: err.message } });
      } else if (err.message === 'Cannot connect with yourself') {
        res.status(400).json({ success: false, error: { code: 'INVALID_REQUEST', message: err.message } });
      } else {
        res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to send connection request' } });
      }
    }
  }

  static async respond(req: Request, res: Response): Promise<void> {
    try {
      const connectionId = parseInt(req.params.connectionId);
      const { action } = req.body;
      if (!['Accept', 'Decline'].includes(action)) {
        res.status(400).json({ success: false, error: { code: 'INVALID_ACTION', message: 'Action must be Accept or Decline' } });
        return;
      }
      const connection = await ConnectionService.respond(connectionId, req.user!.id, action);
      res.json({ success: true, data: connection });
    } catch (err: any) {
      if (err.message === 'Forbidden') {
        res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You cannot respond to this request' } });
      } else if (err.message === 'Connection not found') {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Connection not found' } });
      } else {
        res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to respond to request' } });
      }
    }
  }
}
