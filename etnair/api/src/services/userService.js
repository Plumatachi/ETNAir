const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class UserService {
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id) {
        return prisma.user.findUnique({
            where: { iduser: id },
            select: {
                iduser: true,
                email: true,
                username: true,
                usertype: true,
            },
        });
    }

    async create({ email, password, username, usertype = 'LOCATOR' }) {
        const hashedPassword = await bcrypt.hash(password, 10);

        return prisma.user.create({
            data: {
                iduser: crypto.randomUUID(),
                email,
                password: hashedPassword,
                username,
                usertype,
            },
            select: {
                iduser: true,
                email: true,
                username: true,
                usertype: true,
            },
        });
    }

    async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    async emailExists(email) {
        const user = await this.findByEmail(email);
        return !!user;
    }

    async update(id, data) {
        return prisma.user.update({
            where: { iduser: id }, 
            data, 
            select: { 
                iduser: true,
                email: true,
                username: true,
                usertype: true,
            },
        });
    }

    async delete(id) {
        return prisma.user.delete({
            where: { iduser: id },
        });
    }
}

module.exports = new UserService();