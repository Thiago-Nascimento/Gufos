CREATE TABLE Tipo_usuario(
	Tipo_usuario_id INT IDENTITY PRIMARY KEY,
	Titulo VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Usuario(
	Usuario_id INT IDENTITY PRIMARY KEY,
	Nome VARCHAR(255) NOT NULL,
	Email VARCHAR(255) UNIQUE NOT NULL,
	Senha TEXT NOT NULL,
	Tipo_usuario_id INT FOREIGN KEY REFERENCES Tipo_usuario(Tipo_usuario_id)	
);

CREATE TABLE Localizacao (
	Localizacao_id INT IDENTITY PRIMARY KEY,
	CNPJ CHAR(14) UNIQUE NOT NULL,
	Razao_social VARCHAR(255) UNIQUE NOT NULL,
	Endereco VARCHAR(255) NOT NULL
);

CREATE TABLE Categoria (
	Categoria_id INT IDENTITY PRIMARY KEY,
	Titulo VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Evento (
	Evento_id INT IDENTITY PRIMARY KEY,
	Titulo VARCHAR(255) NOT NULL,
	Categoria_id INT FOREIGN KEY REFERENCES Categoria(Categoria_id),
	Acesso_livre BIT DEFAULT(1) NOT NULL,
	Data_evento DATETIME NOT NULL,
	Localizacao_id INT FOREIGN KEY REFERENCES Localizacao(Localizacao_id)
);

CREATE TABLE Presenca (
	Presenca_id INT IDENTITY PRIMARY KEY,
	Usuario_id INT FOREIGN KEY REFERENCES Usuario(Usuario_id),
	Evento_id INT FOREIGN KEY REFERENCES Evento(Evento_id),
	Presenca_status VARCHAR(255) NOT NULL
);