/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: getRepositoryToken(PacienteEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(
      getRepositoryToken(PacienteEntity),
    );
  });

  it('should create a paciente successfully', async () => {
    const paciente = {
      id: '1',
      name: 'John Doe',
      diagnosticos: [],
      medicos: [],
    } as PacienteEntity;

    const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(paciente);

    const result = await service.create(paciente);

    expect(result).toEqual(paciente);
    expect(saveSpy).toHaveBeenCalledWith(paciente);
  });

  it('should throw an exception when creating a paciente with a name less than 3 characters', async () => {
    const paciente = {
      id: '2',
      name: 'Jo',
      diagnosticos: [],
      medicos: [],
    } as PacienteEntity;
  
    await expect(service.create(paciente)).rejects.toThrowError(
      new BusinessLogicException(
        'The airport code must have exactly three characters',
        BusinessError.BAD_REQUEST,
      ),
    );
  });
  
});
