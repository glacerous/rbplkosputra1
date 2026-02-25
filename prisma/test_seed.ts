import 'dotenv/config';
console.log('Dotenv loaded');
import { Role } from '@prisma/client';
console.log('Prisma Client imported');
import * as bcrypt from 'bcryptjs';
console.log('bcryptjs imported');

async function main() {
    console.log('Role enum:', Role);
}

main();
