create table user_metadata (
	github_id VARCHAR(50) NOT NULL PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	avatar_url VARCHAR(250) NOT NULL,
	bio TEXT,
	phone_number VARCHAR(50),
	email_marketing_consent VARCHAR(50) NOT NULL,
	text_message_consent VARCHAR(50) NOT NULL,
	teacher VARCHAR(50) NOT NULL,
	stripe_client_id VARCHAR(40),
	crypto_wallet_address BOOLEAN,
	has_completed_onboarding VARCHAR(40),
	per_hour_rate INT NOT NULL
);
insert into user_metadata (github_id, username, avatar_url, bio, phone_number, email_marketing_consent, text_message_consent, teacher, stripe_client_id, crypto_wallet_address, has_completed_onboarding, per_hour_rate) values ('24758676', 'ioetbc', 'https://avatars.githubusercontent.com/u/24758676?v=4', 'a short bio about yourself', '312-216-2979', false, true, false, 'cd421c2d-54a0-4630-99c9-0b95b897e700', null, false, 200);
insert into user_metadata (github_id, username, avatar_url, bio, phone_number, email_marketing_consent, text_message_consent, teacher, stripe_client_id, crypto_wallet_address, has_completed_onboarding, per_hour_rate) values ('1234', 'jpenticoot0', 'https://robohash.org/cumqueomnisea.png?size=50x50&set=set1', 'In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum.', '312-216-2979', false, true, false, 'cd421c2d-54a0-4630-99c9-0b95b897e700', null, false, 100);