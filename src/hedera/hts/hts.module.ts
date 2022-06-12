import { Module } from '@nestjs/common';
import { HtsService } from './hts.service';
import { HtsRestService } from './hts-rest.service';
import { ClientModule } from '../client/client.module';
import { RestModule } from '../rest/rest.module';

@Module({
  imports: [ClientModule, RestModule],
  controllers: [],
  providers: [HtsService, HtsRestService],
  exports: [HtsService, HtsRestService]
})
export class HtsModule {}
