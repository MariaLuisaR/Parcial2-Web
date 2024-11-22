/* eslint-disable prettier/prettier */
import { MedicoEntity } from '../medico/medico.entity';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
@Entity()
export class PacienteEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    gender: string;

    @ManyToMany(() => DiagnosticoEntity, diagnostico => diagnostico.pacientes)
    diagnosticos: DiagnosticoEntity[];

    @ManyToMany(() => MedicoEntity, medico => medico.pacientes)
    medicos: MedicoEntity[];

}
