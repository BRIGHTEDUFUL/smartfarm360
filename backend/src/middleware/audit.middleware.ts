import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services/audit.service';

interface AuditConfig {
  action_type: string;
  entity_type: string;
  getEntityId: (req: Request, res: Response, body?: any) => number;
  getDetails: (req: Request, res: Response, body?: any) => Record<string, any>;
}

/**
 * Audit middleware factory
 * Creates middleware that logs administrative actions to the audit_logs table
 */
export function auditMiddleware(config: AuditConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store original res.json to intercept response
    const originalJson = res.json.bind(res);
    
    // Override res.json to capture response data
    res.json = function(body: any) {
      // Only log successful responses (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          // Extract user_id from authenticated request
          const user_id = (req as any).user?.id;
          
          if (user_id) {
            // Extract IP address
            const ip_address = req.ip || req.socket.remoteAddress || 'unknown';
            
            // Extract entity_id and details from request/response
            const entity_id = config.getEntityId(req, res, body);
            const details = config.getDetails(req, res, body);
            
            // Create audit log entry (async, don't wait)
            AuditService.createAuditLog({
              user_id,
              action_type: config.action_type,
              entity_type: config.entity_type,
              entity_id,
              details,
              ip_address
            }).catch(error => {
              console.error('Audit logging failed:', error);
            });
          }
        } catch (error) {
          console.error('Audit middleware error:', error);
        }
      }
      
      // Call original json method
      return originalJson(body);
    };
    
    next();
  };
}
