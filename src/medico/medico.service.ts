/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicoEntity } from './medico.entity';
import {
    BusinessError,
    BusinessLogicException,
  } from '../shared/errors/business-errors';

@Injectable()
export class MedicoService {
    constructor(
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>,
    ) {}

    async findAll(): Promise<MedicoEntity[]> {
        return await this.medicoRepository.find({ relations: ["pacientes"] });
    }

    async findOne(id: string): Promise<MedicoEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id}, relations: ["pacientes"] } );
        if (!medico)
          throw new BusinessLogicException("The medico with the given id was not found", BusinessError.NOT_FOUND);
   
        return medico;
    }

    async create(medico: MedicoEntity): Promise<MedicoEntity> {
        if (!medico.name) {
            throw new BusinessLogicException(
                "The medico must have a name",
                BusinessError.BAD_REQUEST
            );
        }

        if (!medico.specialty) {
            throw new BusinessLogicException(
                "The medico must have a specialty",
                BusinessError.BAD_REQUEST
            );
        }

        return await this.medicoRepository.save(medico);
    }

    async delete(id: string) {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where:{id}});
        if (!medico) {
          throw new BusinessLogicException("The medico with the given id was not found", BusinessError.NOT_FOUND);
        }

        if (medico.pacientes.length != 0) {
            throw new BusinessLogicException("Medicos with patients cannot be deleted", BusinessError.BAD_REQUEST);
        }

        await this.medicoRepository.remove(medico);
    }

}
