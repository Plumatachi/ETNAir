INSERT INTO "user" (idUser, username, email, password, userType)
VALUES
('570fdc7e-1b5c-4d15-8fa1-5633b78bd053', 'Cassandra', 'cassandra@etna.com', 'hello123', 'OWNER'),
('dc986b12-e084-4bb0-88a9-0ba0070af9ec', 'Yoann', 'yoann@etna.com', 'hello123', 'CLIENT'),
('f54016fa-7eb8-48a9-a64e-421f1cef03e1', 'Erwan', 'erwan@etna.com', 'hello123', 'CLIENT'),
('f9f6c1ac-d1a2-4eef-9d00-3c7ff4cbb7d6', 'Zineb', 'zineb@etna.com', 'hello123', 'CLIENT'),
('1c0a393e-735b-4c80-9c87-1fd1a8f0fa76', 'Margaux', 'margaux@etna.com', 'hello123', 'OWNER'),
('c0554a34-e66a-4aa3-afd7-4f2448d39b56', 'Godric Gryffindor', 'gg@etna.com', 'hello123', 'OWNER'),
('b16a59bb-3e3f-4bd9-ba18-2afcb75092a1', 'Salazar Slytherin', 'ss@etna.com', 'hello123', 'OWNER'),
('8b7b7f52-2817-4b44-b111-b6af7d0fbf34', 'Helga Hufflepuff', 'hh@etna.com', 'hello123', 'OWNER'),
('b5c5a7c6-02fa-4ad4-a401-b8cb796b4a6e', 'Rowena Ravenclaw', 'rr@etna.com', 'hello123', 'OWNER');

INSERT INTO "home" (idHome, nameHome, description, price, idUser)
VALUES
('dca3a93c-85e0-4a7d-8f26-d05871c28efd', 'House Gryffindor', 'Bravery, courage, and a strong sense of justice.', 100, 'c0554a34-e66a-4aa3-afd7-4f2448d39b56'),
('ea7c4834-e164-45cf-ae73-410981b5f5a2', 'House Slytherin', 'Cunning, ambition, and resourcefulness.', 90, 'b16a59bb-3e3f-4bd9-ba18-2afcb75092a1'),
('8d1f01f0-6e7d-4d58-a7fb-2ef76ffd5e55', 'House Hufflepuff', 'Hard work, loyalty, and fair play.', 120, '8b7b7f52-2817-4b44-b111-b6af7d0fbf34'),
('1a09de40-7e64-4312-a815-74cde1dfb79d', 'House Ravenclaw', 'Intelligence, wisdom and creativity.', 80, 'b5c5a7c6-02fa-4ad4-a401-b8cb796b4a6e');

INSERT INTO "booking" (idBooking, startDate, endDate, idUser, idHome)
VALUES
-- Yoann → House Slytherin
('7a4c7c52-97a3-4b89-9d31-9b9cf69e2e90', '2025-12-01', '2025-12-05', 'dc986b12-e084-4bb0-88a9-0ba0070af9ec', 'ea7c4834-e164-45cf-ae73-410981b5f5a2'),
-- Erwan → House Gryffindor
('8b9ec4b1-9a1f-4f6a-bc58-afb1c95f8fd6', '2025-12-10', '2025-12-15', 'f54016fa-7eb8-48a9-a64e-421f1cef03e1', 'dca3a93c-85e0-4a7d-8f26-d05871c28efd'),
-- Zineb → House Ravenclaw
('33f4ccbe-85a0-40ac-9a65-1f83e17536b7', '2025-12-03', '2025-12-08', 'f9f6c1ac-d1a2-4eef-9d00-3c7ff4cbb7d6', '1a09de40-7e64-4312-a815-74cde1dfb79d'),
-- Yoann → House Hufflepuff
('d6d7586d-7ed0-4eef-b7f8-86bb7bcf4b5e', '2025-12-20', '2025-12-25', 'dc986b12-e084-4bb0-88a9-0ba0070af9ec', '8d1f01f0-6e7d-4d58-a7fb-2ef76ffd5e55');

INSERT INTO "disponibility" (startDate, endDate, idHome)
VALUES
('2025-12-01','2025-12-31','ea7c4834-e164-45cf-ae73-410981b5f5a2'),
('2025-12-01','2025-12-31','dca3a93c-85e0-4a7d-8f26-d05871c28efd'),
('2025-12-01','2025-12-31','8d1f01f0-6e7d-4d58-a7fb-2ef76ffd5e55'),
('2025-12-01','2025-12-31','1a09de40-7e64-4312-a815-74cde1dfb79d');
