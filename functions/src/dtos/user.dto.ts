import { IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(64)
  username: string;

  @IsNotEmpty()
  phoneNumber: string;
}

export class UpdateUserDto {
  @IsOptional()
  @MaxLength(64)
  username: string;

  @IsOptional()
  @MaxLength(64)
  email: string;
}
