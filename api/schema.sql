CREATE TABLE IF NOT EXISTS companies (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE,
	name TEXT NOT NULL,
);

CREATE TABLE IF NOT EXISTS people {
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE,
	name TEXT NOT NULL,
}

CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE,
	status ENUM ('unconfirmed', 'active', 'blocked') NOT NULL DEFAULT 'unconfirmed',
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	company_id INTEGER NOT NULL REFERENCES companies(id),
	person_id INTEGER NOT NULL REFERENCES people(id),
);

CREATE TABLE IF NOT EXISTS sessions (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
	user_id INTEGER NOT NULL REFERENCES users(id),
	token TEXT NOT NULL UNIQUE,
	remote_addr TEXT NOT NULL,
	user_agent TEXT NOT NULL,
);
