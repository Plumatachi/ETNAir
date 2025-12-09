CREATE TABLE "user" (
    idUser UUID PRIMARY KEY,
    username VARCHAR(100) NOT NULL, 
    email VARCHAR(320) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    userType VARCHAR(20) NOT NULL
);

CREATE INDEX idx_user_username ON "user"(username);

-------------------------------------------------------

CREATE TABLE "home" (
    idHome UUID PRIMARY KEY, 
    nameHome VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL,
    idUser UUID NOT NULL,
    
    CONSTRAINT fk_posted
        FOREIGN KEY (idUser) 
        REFERENCES "user"(idUser)
        ON DELETE CASCADE
);

CREATE INDEX idx_home_nameHome ON "home"(nameHome);
CREATE INDEX idx_home_price ON "home"(price);
CREATE INDEX idx_home_idUser ON "home"(idUser);

-------------------------------------------------------

CREATE TABLE "booking" (
    idBooking UUID PRIMARY KEY,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    idUser UUID NOT NULL,
    idHome UUID NOT NULL,

    CONSTRAINT fk_bookedBy
        FOREIGN KEY (idUser)
        REFERENCES "user"(idUser)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_bookedIn
        FOREIGN KEY (idHome)
        REFERENCES "home"(idHome)
        ON DELETE CASCADE
);

CREATE INDEX idx_booking_idUser ON "booking"(idUser);
CREATE INDEX idx_booking_idHome ON "booking"(idHome);

-------------------------------------------------------

CREATE TABLE "disponibility" (
    idDisponibility SERIAL PRIMARY KEY,
    startDate DATE NOT NULL, 
    endDate DATE NOT NULL,
    idHome UUID NOT NULL,

    CONSTRAINT fk_define
        FOREIGN KEY (idHome)
        REFERENCES "home"(idHome)
        ON DELETE CASCADE
);

CREATE INDEX idx_disponibility_idHome ON "disponibility"(idHome);