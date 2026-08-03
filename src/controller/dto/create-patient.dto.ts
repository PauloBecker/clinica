import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsString,
  IsNotEmpty,
  IsEmail,
  ValidateNested,
  IsNumber,
} from 'class-validator';

class createAdressDto {
  @IsString()
  @IsNotEmpty()
  rua!: string;
}

export class createPatientDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsNumber()
  @IsNotEmpty()
  idade!: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  data_nascimento!: Date;

  @IsString()
  @IsNotEmpty()
  cpf!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createAdressDto)
  enderecos!: createAdressDto[];
}
