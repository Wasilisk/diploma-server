import { Request } from 'express';

export interface RequestWithUserRole extends Request {
  user: Record<string, any>;
}
