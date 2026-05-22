import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../enums/task-status.enum";


export class UpdateTaskStatusDto {
    @ApiProperty({ enum: TaskStatus, description: 'Task status' })
    @IsEnum(TaskStatus)
    status: TaskStatus;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    completionDescription?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    completionLink?: string;
}