import { Like, Repository } from 'typeorm';

import { CreatePatientDto } from '../controller/dto/create-patient.dto';
import { Paciente } from '../model/patient.model';
import { PatientRepository } from '../repositories/patient.repository';

export interface Patient {
  id: number;
  nome: string;
  idade: number;
}

export class PatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async create(patientData: CreatePatientDto) {
    const newPatient = new Paciente();

    this.patientRepository.merge(newPatient, patientData);

    const patient = await this.patientRepository.save(newPatient);

    return patient;
  }

  list(filter?: { name?: string }): Promise<Paciente[]> {
    const { name } = filter ?? {};

    const patientRepository =
      this.patientRepository.getDriver() as Repository<Paciente>;

    return patientRepository.find({
      where: {
        nome: name ? Like(`%${name}%`) : undefined,
      },
      relations: { enderecos: true },
    });
  }
}
const patients: Patient[] = [];

export function getPatient(id: number): Patient | undefined {
  return patients.find((patient) => patient.id === id);
}

export function updatePatient(
  id: number,
  data: Partial<Omit<Patient, 'id'>>,
): Patient {
  const patient = getPatient(id);

  if (!patient) {
    throw new Error('Patient not found');
  }

  const { nome, idade } = data;

  if (nome) {
    patient.nome = nome;
  }
  if (idade) {
    patient.idade = idade;
  }

  return patient;
}
