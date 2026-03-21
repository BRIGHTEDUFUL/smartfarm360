import winston from 'winston';
import { config } from '../config/env';

const maskSensitiveData = (info: any) => {
  const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'cardNumber', 'cvv'];
  
  if (typeof info === 'object') {
    const masked = { ...info };
    for (const field of sensitiveFields) {
      if (masked[field]) {
        masked[field] = '***MASKED***';
      }
    }
    return masked;
  }
  
  return info;
};

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const maskedInfo = maskSensitiveData(info);
    const { timestamp, level, message, ...rest } = maskedInfo;
    const restString = Object.keys(rest).length ? JSON.stringify(rest, null, 2) : '';
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${restString}`;
  })
);

export const logger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  format: customFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
