import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserRole } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersSeeder implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    async onModuleInit() {
        const phoneNumber = '+998994778241';

        const exists = await this.userRepo.findOne({
            where: { role: UserRole.DIRECTOR }
        });

        if (exists) return;

        const director = this.userRepo.create({
            firstName: 'Main',
            lastName: 'Director',
            phoneNumber,
            role: UserRole.DIRECTOR,
            parentId: null,
            password: await bcrypt.hash('tourland123', 10)
        });

        await this.userRepo.save(director);

    }
}