import { IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @MaxLength(64)
  brand: string;

  @IsNotEmpty()
  @MaxLength(64)
  mileage: string;

  @IsNotEmpty()
  @MaxLength(64)
  model: string;

  @IsNotEmpty()
  @MaxLength(64)
  price: string;

  @IsNotEmpty()
  @MaxLength(64)
  year: string;
}
