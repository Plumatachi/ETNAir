const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class BookingService {
    async checkBookingOverlap(idhome, startdate, enddate, excludeBookingId = null) {
        const whereClause = {
            idhome,
            OR: [
                {
                    AND: [
                        { startdate: { lte: startdate } },
                        { enddate: { gte: startdate } }
                    ]
                },
                {
                    AND: [
                        { startdate: { lte: enddate } },
                        { enddate: { gte: enddate } }
                    ]
                },
                {
                    AND: [
                        { startdate: { gte: startdate } },
                        { enddate: { lte: enddate } }
                    ]
                }
            ]
        };

        if (excludeBookingId) {
            whereClause.idbooking = { not: excludeBookingId };
        }

        const overlappingBookings = await prisma.booking.findMany({
            where: whereClause
        });

        return overlappingBookings.length > 0;
    }

    async checkAvailability(idhome, startdate, enddate) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (!idhome || !uuidRegex.test(idhome)) {
            throw new Error(`Invalid home ID format: ${idhome}`);
        }

        const unavailabilities = await prisma.disponibility.findMany({
            where: {
                idhome,
                OR: [
                    {
                        AND: [
                            { startdate: { lte: startdate } },
                            { enddate: { gte: startdate } }
                        ]
                    },
                    {
                        AND: [
                            { startdate: { lte: enddate } },
                            { enddate: { gte: enddate } }
                        ]
                    },
                    {
                        AND: [
                            { startdate: { gte: startdate } },
                            { enddate: { lte: enddate } }
                        ]
                    }
                ]
            }
        });

        return unavailabilities.length === 0;
    }

    async createBooking(data) {
        const { idhome, iduser, startdate, enddate } = data;

        const home = await prisma.home.findUnique({
            where: { idhome }
        });

        if (!home) {
            throw new Error('HOME_NOT_FOUND');
        }

        // Vérifier que les dates sont valides
        const start = new Date(startdate);
        const end = new Date(enddate);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (start < now) {
            throw new Error('START_DATE_PAST');
        }

        if (end <= start) {
            throw new Error('INVALID_DATE_RANGE');
        }

        // Vérifier les disponibilités
        const isAvailable = await this.checkAvailability(idhome, start, end);
        if (!isAvailable) {
            throw new Error('HOME_NOT_AVAILABLE');
        }

        // Vérifier les chevauchements
        const hasOverlap = await this.checkBookingOverlap(idhome, start, end);
        if (hasOverlap) {
            throw new Error('BOOKING_OVERLAP');
        }

        const booking = await prisma.booking.create({
            data: {
                idbooking: data.idbooking || crypto.randomUUID(),
                startdate: start,
                enddate: end,
                iduser,
                idhome
            },
            include: {
                home: {
                    select: {
                        namehome: true,
                        price: true,
                        address: true,
                        city: true
                    }
                },
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });

        return booking;
    }

    async getBookingById(idbooking) {
        const booking = await prisma.booking.findUnique({
            where: { idbooking },
            include: {
                home: {
                    select: {
                        namehome: true,
                        price: true,
                        address: true,
                        city: true,
                        postalcode: true,
                        country: true
                    }
                },
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });

        return booking;
    }

    async getUserBookings(iduser, filters = {}) {
        const where = { iduser };

        if (filters.upcoming) {
            where.startdate = { gte: new Date() };
        }

        if (filters.past) {
            where.enddate = { lt: new Date() };
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                home: {
                    select: {
                        namehome: true,
                        price: true,
                        address: true,
                        city: true,
                        home_image: {
                            take: 1,
                            orderBy: { ordernum: 'asc' },
                            select: { imageurl: true }
                        }
                    }
                }
            },
            orderBy: { startdate: 'asc' }
        });

        return bookings;
    }

    async getHomeBookings(idhome) {
        const bookings = await prisma.booking.findMany({
            where: { idhome },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            },
            orderBy: { startdate: 'asc' }
        });

        return bookings;
    }

    async updateBooking(idbooking, data, userId) {
        const existingBooking = await prisma.booking.findUnique({
            where: { idbooking }
        });

        if (!existingBooking) {
            throw new Error('BOOKING_NOT_FOUND');
        }

        // Vérifier que l'utilisateur est propriétaire de la réservation
        if (existingBooking.iduser !== userId) {
            throw new Error('UNAUTHORIZED');
        }

        // Si les dates changent, vérifier la disponibilité
        if (data.startdate || data.enddate) {
            const newStartDate = data.startdate ? new Date(data.startdate) : existingBooking.startdate;
            const newEndDate = data.enddate ? new Date(data.enddate) : existingBooking.enddate;

            if (newEndDate <= newStartDate) {
                throw new Error('INVALID_DATE_RANGE');
            }

            const isAvailable = await this.checkAvailability(
                existingBooking.idhome,
                newStartDate,
                newEndDate
            );

            if (!isAvailable) {
                throw new Error('HOME_NOT_AVAILABLE');
            }

            const hasOverlap = await this.checkBookingOverlap(
                existingBooking.idhome,
                newStartDate,
                newEndDate,
                idbooking
            );

            if (hasOverlap) {
                throw new Error('BOOKING_OVERLAP');
            }
        }

        const updatedBooking = await prisma.booking.update({
            where: { idbooking },
            data: {
                ...(data.startdate && { startdate: new Date(data.startdate) }),
                ...(data.enddate && { enddate: new Date(data.enddate) })
            },
            include: {
                home: {
                    select: {
                        namehome: true,
                        price: true
                    }
                }
            }
        });

        return updatedBooking;
    }

    async deleteBooking(idbooking, userId, isAdmin = false) {
        const booking = await prisma.booking.findUnique({
            where: { idbooking }
        });

        if (!booking) {
            throw new Error('BOOKING_NOT_FOUND');
        }

        if (!isAdmin && booking.iduser !== userId) {
            throw new Error('UNAUTHORIZED');
        }

        await prisma.booking.delete({
            where: { idbooking }
        });

        return { message: 'Booking deleted successfully' };
    }

    calculateTotalPrice(pricePerNight, startdate, enddate) {
        const start = new Date(startdate);
        const end = new Date(enddate);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return nights * pricePerNight;
    }
}

module.exports = new BookingService();