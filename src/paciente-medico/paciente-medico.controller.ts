/* eslint-disable prettier/prettier */
import { Controller, Post, Param, UseInterceptors } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('pacientes/:pacienteId/medicos')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteMedicoController {
  constructor(private readonly pacienteMedicoService: PacienteMedicoService) {}

  @Post(':medicoId')
  async addMedicoToPaciente(
    @Param('pacienteId') pacienteId: string,
    @Param('medicoId') medicoId: string,
  ) {
    return await this.pacienteMedicoService.addMedicoToPaciente(pacienteId, medicoId);
  }
}

