import { Injectable, Logger } from '@nestjs/common';

/**
 * Injectable
 */
@Injectable()
export class HederaService {

  /**
   * Logger Service
   */
  protected logger: Logger = new Logger("Hedera Service");
}
