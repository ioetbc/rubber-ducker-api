create table technologies (
	id BIGSERIAL NOT NULL,
	github_id VARCHAR(50) NOT NULL PRIMARY KEY,
	javascript INT NOT NULL DEFAULT 0,
	html INT NOT NULL DEFAULT 0,
	css INT NOT NULL DEFAULT 0,
	node INT NOT NULL DEFAULT 0,
	python INT NOT NULL DEFAULT 0,
	react INT NOT NULL DEFAULT 0,
	svelte INT NOT NULL DEFAULT 0,
	postgres INT NOT NULL DEFAULT 0,
	dynamo_db INT NOT NULL DEFAULT 0,
	tensorflow INT NOT NULL DEFAULT 0
);
insert into technologies (github_id, javascript, html, css, node, python, react, svelte, postgres, dynamo_db, tensorflow) values ('24758676', 10, 10, 10, 10, 10, 10, 10, 10, 10, 10);
insert into technologies (github_id, javascript, html, css, node, python, react, svelte, postgres, dynamo_db, tensorflow) values ('1234', 1, 4, 10, 2, 4, 7, 3, 2, 0, 9);
