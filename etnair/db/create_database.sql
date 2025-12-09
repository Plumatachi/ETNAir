CREATE TABLE "user" (
                        iduser UUID PRIMARY KEY,
                        username VARCHAR(100) NOT NULL,
                        email VARCHAR(320) NOT NULL UNIQUE,
                        password VARCHAR(100) NOT NULL,
                        usertype VARCHAR(20) NOT NULL
);

CREATE INDEX idx_user_username ON "user"(username);

-------------------------------------------------------

CREATE TABLE "home" (
                        idhome UUID PRIMARY KEY,
                        namehome VARCHAR(100) NOT NULL,
                        description TEXT NOT NULL,
                        price INT NOT NULL,
                        iduser UUID NOT NULL,

                        CONSTRAINT fk_home_user
                            FOREIGN KEY (iduser)
                                REFERENCES "user"(iduser)
                                ON DELETE CASCADE
);

CREATE INDEX idx_home_nameHome ON "home"(namehome);
CREATE INDEX idx_home_price ON "home"(price);
CREATE INDEX idx_home_idUser ON "home"(iduser);

-------------------------------------------------------

CREATE TABLE "booking" (
                           idbooking UUID PRIMARY KEY,
                           startdate DATE NOT NULL,
                           enddate DATE NOT NULL,
                           iduser UUID NOT NULL,
                           idhome UUID NOT NULL,

                           CONSTRAINT fk_booking_user
                               FOREIGN KEY (iduser)
                                   REFERENCES "user"(iduser)
                                   ON DELETE CASCADE,

                           CONSTRAINT fk_booking_home
                               FOREIGN KEY (idhome)
                                   REFERENCES "home"(idhome)
                                   ON DELETE CASCADE
);

CREATE INDEX idx_booking_idUser ON "booking"(iduser);
CREATE INDEX idx_booking_idHome ON "booking"(idhome);

-------------------------------------------------------

CREATE TABLE "disponibility" (
                                 iddisponibility SERIAL PRIMARY KEY,
                                 startdate DATE NOT NULL,
                                 enddate DATE NOT NULL,
                                 idhome UUID NOT NULL,

                                 CONSTRAINT fk_dispo_home
                                     FOREIGN KEY (idhome)
                                         REFERENCES "home"(idhome)
                                         ON DELETE CASCADE
);

CREATE INDEX idx_disponibility_idHome ON "disponibility"(idhome);

-------------------------------------------------------

CREATE TABLE "home_image" (
                              idimage UUID PRIMARY KEY,
                              idhome UUID NOT NULL,
                              imageurl VARCHAR(500) NOT NULL,
                              imagekey VARCHAR(500) NOT NULL,
                              ordernum INT DEFAULT 0,

                              CONSTRAINT fk_image_home
                                  FOREIGN KEY (idhome)
                                      REFERENCES "home"(idhome)
                                      ON DELETE CASCADE
);

CREATE INDEX idx_homeimage_idhome ON "home_image"(idhome);
