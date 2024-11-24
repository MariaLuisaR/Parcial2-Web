/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { PacienteMedicoService } from './paciente-medico.service';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessError } from '../shared/errors/business-errors';
import { faker } from '@faker-js/faker';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = (): MockRepository => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let medicoRepository: MockRepository<MedicoEntity>;
  let pacienteRepository: MockRepository<PacienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteMedicoService,
        {
          provide: getRepositoryToken(MedicoEntity),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(PacienteEntity),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    medicoRepository = module.get<MockRepository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    pacienteRepository = module.get<MockRepository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
  });

  describe('addMedicoToPaciente', () => {
    it('should add a medico to a paciente', async () => {
      const medico = {
        id: "",
        name: faker.person.fullName(),
        specialty: faker.lorem.word(),
        phone: faker.phone.number(),
        pacientes: [],
      };

      const paciente = {
        id: "",
        name: faker.person.fullName(),
        diagnosticos: [],
        medicos: [],
      };

      medicoRepository.findOne.mockResolvedValue(medico);
      pacienteRepository.findOne.mockResolvedValue(paciente);
      pacienteRepository.save.mockResolvedValue({
        ...paciente,
        medicos: [medico],
      });

      const result = await service.addMedicoToPaciente(paciente.id, medico.id);

      expect(result.medicos.length).toBe(1);
      expect(result.medicos[0]).toEqual(medico);
      expect(medicoRepository.findOne).toHaveBeenCalledWith({
        where: { id: medico.id },
        relations: ['pacientes'],
      });
      expect(pacienteRepository.findOne).toHaveBeenCalledWith({
        where: { id: paciente.id },
        relations: ['medicos', 'exhibitions'],
      });
      expect(pacienteRepository.save).toHaveBeenCalledWith({
        ...paciente,
        medicos: [medico],
      });
    });

    it('should throw an exception if medico not found', async () => {
      medicoRepository.findOne.mockResolvedValue(null);

      await expect(service.addMedicoToPaciente("", "addssdjsd")).rejects.toMatchObject({
        message: "The medico with the given id was not found",
        type: BusinessError.NOT_FOUND,
      });
    });

    it('should throw an exception if paciente not found', async () => {
      const medico = {
        id: "",
        name: faker.person.fullName(),
        specialty: faker.lorem.word(),
        phone: faker.phone.number(),
        pacientes: [],
      };

      medicoRepository.findOne.mockResolvedValue(medico);
      pacienteRepository.findOne.mockResolvedValue(null);

      await expect(service.addMedicoToPaciente("adlassjs", medico.id)).rejects.toMatchObject({
        message: "The paciente with the given id was not found",
        type: BusinessError.NOT_FOUND,
      });
    });

    it('should throw an exception if paciente already has 5 medicos', async () => {
      const medico = {
        id: "",
        name: faker.person.fullName(),
        specialty: faker.lorem.word(),
        phone: faker.phone.number(),
        pacientes: [],
      };

      const paciente = {
        id: "",
        name: faker.person.fullName(),
        diagnosticos: [],
        medicos: Array(5).fill({
          id: "",
          name: faker.person.fullName(),
          specialty: faker.lorem.word(),
          phone: faker.phone.number(),
        }),
      };

      medicoRepository.findOne.mockResolvedValue(medico);
      pacienteRepository.findOne.mockResolvedValue(paciente);

      await expect(service.addMedicoToPaciente(paciente.id, medico.id)).rejects.toMatchObject({
        message: "The paciente cannot have more than 5 medicos",
        type: BusinessError.BAD_REQUEST,
      });
    });
  });
});
