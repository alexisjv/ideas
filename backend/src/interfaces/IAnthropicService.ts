import { Session, GeneratedVenture } from '../types';
import { Response } from 'express';

export interface IAnthropicService {
  generateVenture(session: Session): Promise<GeneratedVenture>;
  streamGenerateVenture(session: Session, res: Response): Promise<void>;
}
