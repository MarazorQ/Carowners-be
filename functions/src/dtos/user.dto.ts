import { IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(64)
  username: string;

  @IsNotEmpty()
  @MaxLength(20)
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

export class CheckUserPhoneDto {
  @IsNotEmpty()
  @MaxLength(20)
  phoneNumber: string;
}
