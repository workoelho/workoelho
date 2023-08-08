CREATE TABLE IF NOT EXISTS companies (
	id public.xid PRIMARY KEY DEFAULT xid(),
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE,
	name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS people (
	id public.xid PRIMARY KEY DEFAULT xid(),
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE,
	name TEXT NOT NULL,
	company_id public.xid NOT NULL REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS users (
	id public.xid PRIMARY KEY DEFAULT xid(),
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	deleted_at TIMESTAMP WITH TIME ZONE,
	status TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password_digest TEXT NOT NULL,
	company_id public.xid NOT NULL REFERENCES companies(id),
	person_id public.xid NOT NULL REFERENCES people(id)
);

CREATE TABLE IF NOT EXISTS sessions (
	id public.xid PRIMARY KEY DEFAULT xid(),
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
	user_id public.xid NOT NULL REFERENCES users(id),
	remote_addr TEXT NOT NULL,
	user_agent TEXT NOT NULL
);
