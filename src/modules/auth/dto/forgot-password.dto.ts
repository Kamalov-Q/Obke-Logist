import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({ example: '+998901234567' })
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @ApiProperty({ example: '1234' })
    @IsNotEmpty()
    @IsString()
    pincode: string;

    @ApiProperty({ example: 'newPassword123' })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    newPassword: string;
}
