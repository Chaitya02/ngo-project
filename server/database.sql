CREATE DATABASE ngo;

CREATE TABLE "user"(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    mobile_no NUMERIC(10) UNIQUE,
    is_admin BOOLEAN DEFAULT false,
    address VARCHAR(50),
    pin NUMERIC(6),
    state VARCHAR(50),
    dob DATE,
    blood_group VARCHAR(5),
    verified BOOLEAN DEFAULT false
);

CREATE TABLE "donor"(
    id SERIAL PRIMARY KEY,
    donor_name VARCHAR(255),
    mobile_no NUMERIC(10),
    blood_group VARCHAR(5),
    previous_donation_date DATE,
    address VARCHAR(255)
);
