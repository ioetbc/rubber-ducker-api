create table messages (
	github_id VARCHAR(50) NOT NULL,
	text VARCHAR(50) NOT NULL,
	recipient VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
insert into messages (github_id, text, recipient) values ('24758676', 'hello peter, wanna help we with the filtering', '25121356');
insert into messages (github_id, text, recipient) values ('25121356', 'sure give me a moment though', '24758676');
insert into messages (github_id, text, recipient) values ('24758676', 'yeah thats cool, just lemme know when you start', '25121356');
