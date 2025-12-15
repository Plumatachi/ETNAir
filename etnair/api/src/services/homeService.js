const prisma = require('../config/database');
const crypto = require('crypto');

class HomeService {
    async create({ namehome, description, price, iduser }) {
        return prisma.home.create({
            data : {
                idhome: crypto.randomUUID(),
                namehome, 
                description, 
                price, 
                iduser,
            },
            select: {
                idhome: true, 
                namehome: true, 
                description: true,
                price: true, 
                iduser: true,
            },
        });
    }

    async findAll() {
        return prisma.home.findMany({
            select: {
                idhome: true, 
                namehome: true, 
                description: true, 
                price: true, 
                iduser: true,
            },
        });
    }

    async findById(id) {
        return prisma.home.findUnique({
            where: { idhome: id },
            select: {
                idhome: true, 
                namehome: true,
                description: true, 
                price: true, 
                iduser: true,
            },
        });
    }

    async update(id, data) {
        return prisma.home.update({
            where: { idhome: id }, 
            data, 
            select: {
                idhome: true, 
                namehome: true,
                description: true, 
                price: true, 
                iduser: true,
            },
        });
    }

    async delete(id) {
        return prisma.home.delete({
            where: { idhome: id },
        });
    }
}

module.exports = new HomeService();