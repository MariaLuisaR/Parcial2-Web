/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessError } from '../shared/errors/business-errors';
import { faker } from '@faker-js/faker';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = (): MockRepository => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: MockRepository<MedicoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicoService,
        {
          provide: getRepositoryToken(MedicoEntity),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<MockRepository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
  });

  describe('findAll', () => {
    it('should return all medicos', async () => {
      const medicos = [
        {
          id: "",
          name: faker.person.fullName(),
          specialty: faker.lorem.word(),
          phone: faker.phone.number(),
          pacientes: [],
        },
      ];
      repository.find.mockResolvedValue(medicos);

      const result = await service.findAll();
      expect(result).toEqual(medicos);
      expect(repository.find).toHaveBeenCalledWith({ relations: ['pacientes'] });
    });
  });

  describe('findOne', () => {
    it('should return a medico by id', async () => {
      const medico = {
        id: "",
        name: faker.person.fullName(),
        specialty: faker.lorem.word(),
        phone: faker.phone.number(),
        pacientes: [],
      };
      repository.findOne.mockResolvedValue(medico);

      const result = await service.findOne(medico.id);
      expect(result).toEqual(medico);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: medico.id },
        relations: ['pacientes'],
      });
    });

    it('should throw an exception if medico not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne("")).rejects.toMatchObject({
        message: "The medico with the given id was not found",
        type: BusinessError.NOT_FOUND,
      });
    });
  });

  describe('create', () => {
    it('should create and return a medico', async () => {
      const medico = {
        id: "",
        name: faker.person.fullName(),
        specialty: faker.lorem.word(),
        phone: faker.phone.number(),
        pacientes: [],
      };
      repository.save.mockResolvedValue(medico);

      const result = await service.create(medico as MedicoEntity);
      expect(result).toEqual(medico);
      expect(repository.save).toHaveBeenCalledWith(medico);
    });

    it('should throw an exception if name is missing', async () => {
      const medico = {
        id: "",
        name: null,
        specialty: faker.lorem.word(),
        phone: faker.phone.number(),
        pacientes: [],
      };

      await expect(service.create(medico as MedicoEntity)).rejects.toMatchObject({
        message: "The medico must have a name",
        type: BusinessError.BAD_REQUEST,
      });
    });

    it('should throw an exception if specialty is missing', async () => {
      const medico = {
        id: "",
        name: faker.person.fullName(),
        specialty: null,
        phone: faker.phone.number(),
        pacientes: [],
      };

      await expect(service.create(medico as MedicoEntity)).rejects.toMatchObject({
        message: "The medico must have a specialty",
        type: BusinessError.BAD_REQUEST,
      });
    });
  });

  describe('delete', () => {
    it('should delete a medico', async () => {
      const medico = {
        id: "",
        name: faker.person.fullName(),
        specialty: faker.lorem.word(),
        phone: faker.phone.number(),
        pacientes: [],
      };
      repository.findOne.mockResolvedValue(medico);
      repository.remove.mockResolvedValue(null);

      await service.delete(medico.id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: medico.id } });
      expect(repository.remove).toHaveBeenCalledWith(medico);
    });

    it('should throw an exception if medico not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.delete("")).rejects.toMatchObject({
        message: "The medico with the given id was not found",
        type: BusinessError.NOT_FOUND,
      });
    });

    it('should throw an exception if medico has pacientes', async () => {
      const medico = {
        id: "",
        name: faker.person.fullName(),
        specialty: faker.lorem.word(),
        phone: faker.phone.number(),
        pacientes: [{ id: "", name: faker.person.fullName() }],
      };
      repository.findOne.mockResolvedValue(medico);

      await expect(service.delete(medico.id)).rejects.toMatchObject({
        message: "Medicos with patients cannot be deleted",
        type: BusinessError.BAD_REQUEST,
      });
    });
  });
});
