-- Create Database and drop if existing database
DROP DATABASE IF EXISTS etnair_database;
CREATE DATABASE IF NOT EXISTS etnair_database;
\c etnair_database;

-------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-------------------------------------------------------

CREATE TABLE "USER" (
    idUser UUID PRIMARY KEY,
    username VARCHAR(100) NOT NULL, 
    email VARCHAR(320) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    userType VARCHAR(20) NOT NULL
);

CREATE INDEX idx_user_username ON "USER"(username);

-------------------------------------------------------

CREATE TABLE HOME (
    idHome UUID PRIMARY KEY, 
    nameHome VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL,
    idUser UUID NOT NULL,
    
    CONSTRAINT fk_posted
        FOREIGN KEY (idUser) 
        REFERENCES "USER"(idUser)
        ON DELETE CASCADE
);

CREATE INDEX idx_home_nameHome ON HOME(nameHome);
CREATE INDEX idx_home_price ON HOME(price);
CREATE INDEX idx_home_idUser ON HOME(idUser);

-------------------------------------------------------

CREATE TABLE BOOKING (
    idBooking UUID PRIMARY KEY,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    idUser UUID NOT NULL,
    idHome UUID NOT NULL,

    CONSTRAINT fk_bookedBy
        FOREIGN KEY (idUser)
        REFERENCES "USER"(idUser)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_bookedIn
        FOREIGN KEY (idHome)
        REFERENCES HOME(idHome)
        ON DELETE CASCADE
);

CREATE INDEX idx_booking_idUser ON BOOKING(idUser);
CREATE INDEX idx_booking_idHome ON BOOKING(idHome);

-------------------------------------------------------

CREATE TABLE DISPONIBILITY (
    idDisponibility SERIAL PRIMARY KEY,
    startDate DATE NOT NULL, 
    endDate DATE NOT NULL,
    idHome UUID NOT NULL,

    CONSTRAINT fk_define
        FOREIGN KEY (idHome)
        REFERENCES HOME(idHome)
        ON DELETE CASCADE
);

CREATE INDEX idx_disponibility_idHome ON DISPONIBILITY(idHome);