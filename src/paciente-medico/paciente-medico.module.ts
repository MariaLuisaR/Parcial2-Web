/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { PacienteMedicoController } from './paciente-medico.controller';

@Module({
  providers: [PacienteMedicoService],
  controllers: [PacienteMedicoController],
})
export class PacienteMedicoModule {}
