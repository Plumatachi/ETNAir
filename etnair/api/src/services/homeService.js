const prisma = require('../config/database');
const s3Service = require('./s3Service');
const crypto = require('crypto');

const uuidv4 = () => crypto.randomUUID();

class HomeService {
    async create(data) {
        const idhome = uuidv4();

        const home = await prisma.home.create({
            data: {
                idhome,
                namehome: data.namehome,
                description: data.description,
                price: parseInt(data.price),
                address: data.address,
                city: data.city,
                postalcode: data.postalcode,
                country: data.country,
                propertytype: data.propertytype,
                iduser: data.iduser,
            },
            include: {
                user: {
                    select: {
                        iduser: true,
                        username: true,
                        email: true,
                    }
                },
                home_image: {
                    orderBy: { ordernum: 'asc' }
                }
            }
        });

        return home;
    }

    async createWithImages(homeData, files) {
        const idhome = uuidv4();

        const home = await prisma.home.create({
            data: {
                idhome,
                namehome: homeData.namehome,
                description: homeData.description,
                price: parseInt(homeData.price),
                address: homeData.address,
                city: homeData.city,
                postalcode: homeData.postalcode,
                country: homeData.country,
                propertytype: homeData.propertytype,
                iduser: homeData.iduser,
            }
        });

        if (files && files.length > 0) {
            const uploadedImages = await s3Service.uploadMultipleHomeImages(idhome, files);

            const imageRecords = uploadedImages.map(img => ({
                idimage: img.idimage,
                idhome: idhome,
                imageurl: img.imageurl,
                imagekey: img.imagekey,
                ordernum: img.ordernum,
            }));

            await prisma.homeImage.createMany({
                data: imageRecords
            });
        }

        return await this.findById(idhome);
    }

    async findAll() {
        return await prisma.home.findMany({
            include: {
                user: {
                    select: {
                        iduser: true,
                        username: true,
                        email: true,
                    }
                },
                home_image: {
                    orderBy: { ordernum: 'asc' }
                }
            },
            orderBy: {
                namehome: 'asc'
            }
        });
    }

    async findById(idhome) {
        return await prisma.home.findUnique({
            where: { idhome },
            include: {
                user: {
                    select: {
                        iduser: true,
                        username: true,
                        email: true,
                    }
                },
                home_image: {
                    orderBy: { ordernum: 'asc' }
                }
            }
        });
    }

    async update(idhome, data) {
        const updateData = {
            ...(data.namehome && { namehome: data.namehome }),
            ...(data.description && { description: data.description }),
            ...(data.price && { price: parseInt(data.price) }),
            ...(data.address && { address: data.address }),
            ...(data.city && { city: data.city }),
            ...(data.postalcode && { postalcode: data.postalcode }),
            ...(data.country && { country: data.country }),
        };

        if (data.propertyType) {
            updateData.propertytype = data.propertyType;
        } else if (data.propertytype) {
            updateData.propertytype = data.propertytype;
        }

        return await prisma.home.update({
            where: { idhome },
            data: updateData,
            include: {
                user: {
                    select: {
                        iduser: true,
                        username: true,
                        email: true,
                    }
                },
                home_image: {
                    orderBy: { ordernum: 'asc' }
                }
            }
        });
    }

    async delete(idhome) {
        await s3Service.deleteAllHomeImages(idhome);

        return await prisma.home.delete({
            where: { idhome }
        });
    }

    async addImages(idhome, files) {
        const home = await this.findById(idhome);
        if (!home) {
            throw new Error('Logement non trouvé');
        }

        const maxOrder = home.home_image.length > 0
            ? Math.max(...home.home_image.map(img => img.ordernum))
            : -1;

        const uploadedImages = await s3Service.uploadMultipleHomeImages(idhome, files);

        const imageRecords = uploadedImages.map((img, index) => ({
            idimage: img.idimage,
            idhome: idhome,
            imageurl: img.imageurl,
            imagekey: img.imagekey,
            ordernum: maxOrder + 1 + index,
        }));

        await prisma.homeImage.createMany({
            data: imageRecords
        });

        return await this.findById(idhome);
    }

    async deleteImage(idimage) {
        const image = await prisma.homeImage.findUnique({
            where: { idimage }
        });

        if (!image) {
            throw new Error('Image non trouvée');
        }

        await s3Service.deleteHomeImage(image.imagekey);

        await prisma.homeImage.delete({
            where: { idimage }
        });

        return true;
    }

    async reorderImages(idhome, imageOrders) {
        // imageOrders est un tableau du type: [{ idimage: 'uuid', ordernum: 0 }, ...]
        const updatePromises = imageOrders.map(({ idimage, ordernum }) =>
            prisma.homeImage.update({
                where: { idimage },
                data: { ordernum }
            })
        );

        await Promise.all(updatePromises);
        return await this.findById(idhome);
    }
}

module.exports = new HomeService();