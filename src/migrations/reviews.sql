create table reviews (
	github_id VARCHAR(50) NOT NULL,
	review VARCHAR(500) NOT NULL,
	stars INT NOT NULL
);
insert into reviews (github_id, review, stars) values ('24758676', 'amazing', 5);
insert into reviews (github_id, review, stars) values ('24758676', 'amazing', 5);
insert into reviews (github_id, review, stars) values ('24758676', 'a very good teacher. Explained what I was doign wrong', 5);
insert into reviews (github_id, review, stars) values ('1234', 'yeah pretty good, fixed the issue but was a bit rude', 3);
insert into reviews (github_id, review, stars) values ('1234', 'fantastic', 4);
insert into reviews (github_id, review, stars) values ('1234', 'this guy is a dick', 2);