/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import {
    BusinessError,
    BusinessLogicException,
  } from '../shared/errors/business-errors';

@Injectable()
export class PacienteService {
    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>,
    ) {}

    async findAll(): Promise<PacienteEntity[]> {
        return await this.pacienteRepository.find({ relations: ["diagnosticos", "medicos"] });
    }

    async findOne(id: string): Promise<PacienteEntity> {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {id}, relations: ["diagnosticos", "medicos"] } );
        if (!paciente)
          throw new BusinessLogicException("The paciente with the given id was not found", BusinessError.NOT_FOUND);
   
        return paciente;
    }

    async create(paciente: PacienteEntity): Promise<PacienteEntity> {
        if (!paciente.name || paciente.name.length < 3) {
            throw new BusinessLogicException(
                "The name of the paciente must be longer than three characters",
                BusinessError.BAD_REQUEST,
            );
        }
        
        return await this.pacienteRepository.save(paciente);
    }

    async delete(id: string) {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where:{id}});
        if (!paciente) {
          throw new BusinessLogicException("The paciente with the given id was not found", BusinessError.NOT_FOUND);
        }

        if (paciente.diagnosticos.length != 0) {
            throw new BusinessLogicException("Patients with diagnoses cannot be deleted", BusinessError.BAD_REQUEST);
        }

        await this.pacienteRepository.remove(paciente);
    }

}
