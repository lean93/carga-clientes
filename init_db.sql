create schema if not exists carga_cliente;

create table if not exists Registro(
    id bigint(20) NOT NULL AUTO_INCREMENT,
    nombre varchar(100) DEFAULT NULL,
    apellido varchar(100) DEFAULT NULL,
    dni varchar(100) DEFAULT NULL,
    fechaNacimiento varchar(20) default null,
    domicilio varchar(100),
    email varchar(50),
    localidad varchar(50),
    departamento varchar(50),
    numeroBeneficio varchar(20),
    numeroTramite varchar(20),
    telefono varchar(20),
    PRIMARY KEY (`id`)
);

create table if not exists Prestadores(
    id bigint(20) NOT NULL AUTO_INCREMENT,
    nombre varchar(100) DEFAULT NULL,
    apellido varchar(100) DEFAULT NULL,
    dni varchar(100) DEFAULT NULL,
    domicilio varchar(100),
    especialidad varchar(100),
    telefono varchar(20),
    PRIMARY KEY (`id`)
);

create table if not exists Hospital(
    id bigint(20) NOT NULL AUTO_INCREMENT,
    nombre varchar(100) DEFAULT NULL,
    domicilio varchar(100),
    telefono varchar(20),
    PRIMARY KEY (`id`)
);