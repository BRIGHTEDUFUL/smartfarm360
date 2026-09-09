import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { IrrigationService } from '../services/irrigation.service';

export class IrrigationController {
  static createScheduleValidation = [
    body('field_name').trim().notEmpty().withMessage('Field name is required'),
    body('crop_type').trim().notEmpty().withMessage('Crop type is required'),
    body('frequency_days').isInt({ min: 1, max: 30 }).withMessage('Frequency must be between 1 and 30 days'),
    body('irrigation_method').optional().isIn(['Drip', 'Sprinkler', 'Flood', 'Manual']).withMessage('Invalid irrigation method'),
    body('area_hectares').optional().isFloat({ min: 0 }).withMessage('Area must be a positive number'),
  ];

  static logWateringValidation = [
    body('field_name').trim().notEmpty().withMessage('Field name is required'),
    body('duration_minutes').optional().isInt({ min: 0 }).withMessage('Duration must be positive'),
    body('amount_liters').optional().isFloat({ min: 0 }).withMessage('Amount must be positive'),
    body('rainfall_mm').optional().isFloat({ min: 0 }).withMessage('Rainfall must be positive'),
  ];

  // GET /api/irrigation/schedules
  static async getSchedules(req: Request, res: Response): Promise<void> {
    try {
      const schedules = await IrrigationService.getSchedules(req.user!.id);
      res.json({ success: true, data: schedules });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch schedules' } });
    }
  }

  // POST /api/irrigation/schedules
  static async createSchedule(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_FAILED', message: 'Validation failed', details: errors.array() } });
      return;
    }
    try {
      const schedule = await IrrigationService.createSchedule(req.user!.id, req.body);
      res.status(201).json({ success: true, data: schedule });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create schedule' } });
    }
  }

  // PUT /api/irrigation/schedules/:id
  static async updateSchedule(req: Request, res: Response): Promise<void> {
    try {
      const schedule = await IrrigationService.updateSchedule(parseInt(req.params.id), req.user!.id, req.body);
      if (!schedule) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Schedule not found' } });
        return;
      }
      res.json({ success: true, data: schedule });
    } catch (err: any) {
      if (err.message === 'Forbidden') {
        res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You can only edit your own schedules' } });
      } else {
        res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update schedule' } });
      }
    }
  }

  // DELETE /api/irrigation/schedules/:id
  static async deleteSchedule(req: Request, res: Response): Promise<void> {
    try {
      await IrrigationService.deleteSchedule(parseInt(req.params.id), req.user!.id);
      res.json({ success: true, message: 'Schedule deleted' });
    } catch (err: any) {
      if (err.message === 'Forbidden') {
        res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You can only delete your own schedules' } });
      } else {
        res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete schedule' } });
      }
    }
  }

  // POST /api/irrigation/schedules/:id/log  OR  /api/irrigation/log/manual
  static async logWatering(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_FAILED', message: 'Validation failed', details: errors.array() } });
      return;
    }
    try {
      const rawId = req.params.id;
      const parsed = rawId ? parseInt(rawId) : NaN;
      const scheduleId = !isNaN(parsed) ? parsed : null;
      const log = await IrrigationService.logWatering(req.user!.id, scheduleId, req.body);
      res.status(201).json({ success: true, data: log });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to log watering' } });
    }
  }

  // GET /api/irrigation/logs
  static async getLogs(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt((req.query.limit as string) || '20');
      const offset = parseInt((req.query.offset as string) || '0');
      const logs = await IrrigationService.getLogs(req.user!.id, limit, offset);
      res.json({ success: true, data: logs });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch logs' } });
    }
  }

  // GET /api/irrigation/due
  static async getDue(req: Request, res: Response): Promise<void> {
    try {
      const due = await IrrigationService.getDueSchedules(req.user!.id);
      res.json({ success: true, data: due });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch due schedules' } });
    }
  }
}
