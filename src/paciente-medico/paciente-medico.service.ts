/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import {
    BusinessError,
    BusinessLogicException,
  } from '../shared/errors/business-errors';

  @Injectable()
  export class PacienteMedicoService {
      constructor(
          @InjectRepository(MedicoEntity)
          private readonly medicoRepository: Repository<MedicoEntity>,
          
          @InjectRepository(PacienteEntity)
          private readonly pacienteRepository: Repository<PacienteEntity>,
      ) {}
      
      async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({ where: { id: medicoId }, relations: ['pacientes'] });
        if (!medico)
          throw new BusinessLogicException("The medico with the given id was not found", BusinessError.NOT_FOUND);
      
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {id: pacienteId}, relations: ["medicos", "exhibitions"]})
        if (!paciente)
          throw new BusinessLogicException("The paciente with the given id was not found", BusinessError.NOT_FOUND);
    
        paciente.medicos = [...paciente.medicos, medico];

        if (paciente.medicos.length >= 5)
            throw new BusinessLogicException("The paciente cannot have more than 5 medicos", BusinessError.BAD_REQUEST);

        return await this.pacienteRepository.save(paciente);
      }
      
  
  }
  