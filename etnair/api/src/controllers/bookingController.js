const bookingService = require('../services/bookingService');

class BookingController {
    async createBooking(req, res) {
        try {
            const { idhome, startdate, enddate } = req.body;

            const iduser = req.user.id;

            if (!iduser) {
                return res.status(401).json({
                    success: false,
                    message: 'User ID not found in token'
                });
            }

            const booking = await bookingService.createBooking({
                idhome,
                iduser,
                startdate,
                enddate
            });

            const totalPrice = bookingService.calculateTotalPrice(
                booking.home.price,
                startdate,
                enddate
            );

            res.status(201).json({
                success: true,
                data: {
                    ...booking,
                    totalPrice
                },
                message: 'Booking created successfully'
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async getBooking(req, res) {
        try {
            const { idbooking } = req.params;
            const booking = await bookingService.getBookingById(idbooking);

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }

            if (booking.iduser !== req.user.iduser && req.user.usertype !== 'ADMIN') {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized to view this booking'
                });
            }

            const totalPrice = bookingService.calculateTotalPrice(
                booking.home.price,
                booking.startdate,
                booking.enddate
            );

            res.json({
                success: true,
                data: {
                    ...booking,
                    totalPrice
                }
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async getMyBookings(req, res) {
        try {
            const iduser = req.user.id;
            const { upcoming, past } = req.query;

            const filters = {
                upcoming: upcoming === 'true',
                past: past === 'true'
            };

            const bookings = await bookingService.getUserBookings(iduser, filters);

            res.json({
                success: true,
                count: bookings.length,
                data: bookings
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async getHomeBookings(req, res) {
        try {
            const { idhome } = req.params;
            const bookings = await bookingService.getHomeBookings(idhome);

            res.json({
                success: true,
                count: bookings.length,
                data: bookings
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async updateBooking(req, res) {
        try {
            const { idbooking } = req.params;
            const { startdate, enddate } = req.body;
            const iduser = req.user.id;

            const booking = await bookingService.updateBooking(
                idbooking,
                { startdate, enddate },
                iduser
            );

            const totalPrice = bookingService.calculateTotalPrice(
                booking.home.price,
                booking.startdate,
                booking.enddate
            );

            res.json({
                success: true,
                data: {
                    ...booking,
                    totalPrice
                },
                message: 'Booking updated successfully'
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async deleteBooking(req, res) {
        try {
            const { idbooking } = req.params;
            const iduser = req.user.id;
            const isAdmin = req.user.role === 'ADMIN';

            await bookingService.deleteBooking(idbooking, iduser, isAdmin);

            res.json({
                success: true,
                message: 'Booking cancelled successfully'
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async checkAvailability(req, res) {
        try {
            const { idhome } = req.params;
            const { startdate, enddate } = req.query;

            if (!startdate || !enddate) {
                return res.status(400).json({
                    success: false,
                    message: 'Start date and end date are required'
                });
            }

            const isAvailable = await bookingService.checkAvailability(
                idhome,
                new Date(startdate),
                new Date(enddate)
            );

            const hasOverlap = await bookingService.checkBookingOverlap(
                idhome,
                new Date(startdate),
                new Date(enddate)
            );

            res.json({
                success: true,
                data: {
                    available: isAvailable && !hasOverlap,
                    inDisponibilityRange: isAvailable,
                    hasBookingConflict: hasOverlap
                }
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    handleError(res, error) {
        console.error('Booking error:', error);

        const errorMessages = {
            HOME_NOT_FOUND: { status: 404, message: 'Home not found' },
            BOOKING_NOT_FOUND: { status: 404, message: 'Booking not found' },
            START_DATE_PAST: { status: 400, message: 'Start date cannot be in the past' },
            INVALID_DATE_RANGE: { status: 400, message: 'End date must be after start date' },
            HOME_NOT_AVAILABLE: { status: 400, message: 'Home is not available for selected dates' },
            BOOKING_OVERLAP: { status: 409, message: 'Home is already booked for selected dates' },
            UNAUTHORIZED: { status: 403, message: 'Unauthorized to perform this action' }
        };

        const errorInfo = errorMessages[error.message] || {
            status: 500,
            message: 'Internal server error'
        };

        res.status(errorInfo.status).json({
            success: false,
            message: errorInfo.message
        });
    }
}

module.exports = new BookingController();