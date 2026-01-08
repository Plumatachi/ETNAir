export interface Booking {
    idbooking: string;
    startdate: string;
    enddate: string;
    iduser: string;
    idhome: string;
    home?: {
        namehome: string;
        price: number;
        address: string;
        city: string;
        postalcode?: string;
        country?: string;
        home_image?: Array<{
            imageurl: string;
        }>;
    };
    user?: {
        username: string;
        email: string;
    };
}

export interface CreateBookingData {
    idhome: string;
    startdate: string;
    enddate: string;
}

export interface BookingAvailability {
    available: boolean;
    inDisponibilityRange: boolean;
    hasBookingConflict: boolean;
}

export interface BookingFormData {
    startDate: string;
    endDate: string;
}

export interface BookingError {
    message: string;
    field?: string;
}