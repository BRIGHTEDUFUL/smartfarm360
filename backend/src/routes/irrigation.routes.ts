import { Router } from 'express';
import { IrrigationController } from '../controllers/irrigation.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

const farmerOnly = [authenticate, authorize('Farmer')];

router.get('/schedules', ...farmerOnly, IrrigationController.getSchedules);
router.post('/schedules', ...farmerOnly, IrrigationController.createScheduleValidation, IrrigationController.createSchedule);
router.put('/schedules/:id', ...farmerOnly, IrrigationController.updateSchedule);
router.delete('/schedules/:id', ...farmerOnly, IrrigationController.deleteSchedule);
router.post('/schedules/:id/log', ...farmerOnly, IrrigationController.logWateringValidation, IrrigationController.logWatering);
router.post('/log/manual', ...farmerOnly, IrrigationController.logWateringValidation, IrrigationController.logWatering);
router.get('/logs', ...farmerOnly, IrrigationController.getLogs);
router.get('/due', ...farmerOnly, IrrigationController.getDue);

export default router;
