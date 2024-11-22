/* eslint-disable prettier/prettier */
import { PacienteEntity } from '../paciente/paciente.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
@Entity()
export class DiagnosticoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(() => PacienteEntity, paciente => paciente.diagnosticos)
    pacientes: PacienteEntity[];

}
