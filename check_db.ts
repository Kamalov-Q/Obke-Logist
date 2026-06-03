import { DataSource } from "typeorm";
import { Attendance } from "./src/modules/attendance/entities/attendance.entity";
import { User } from "./src/modules/users/entities/user.entity";

async function check() {
    const ds = new DataSource({
        type: "postgres",
        host: "localhost",
        port: 1029,
        username: "kamal",
        password: "kamalov-tourland",
        database: "tourland",
        entities: [Attendance, User],
        synchronize: false,
    });

    await ds.initialize();
    console.log("Connected to DB");

    const attendanceRepo = ds.getRepository(Attendance);
    const all = await attendanceRepo.find({
        order: { date: 'DESC' },
        take: 50
    });

    console.log("Recent Attendance Records:");
    all.forEach(a => {
        console.log(`${a.date} - Employee: ${a.employeeId} - Status: ${a.status}`);
    });

    await ds.destroy();
}

check().catch(console.error);
