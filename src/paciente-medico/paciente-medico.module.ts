/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';

@Module({
  providers: [PacienteMedicoService],
})
export class PacienteMedicoModule {}
