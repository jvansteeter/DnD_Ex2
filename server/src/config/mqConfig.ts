export const MqConfig = {
	encounterQueueName: 'serverQueue',
	friendRequestQueueName: 'serverFriendRequestQueue',
	amqpUrl: 'amqp://admin:admin@localhost',
	encounterExchange: 'encounterExchange',
	userExchange: 'userExchange',
	encounterTopic: 'encounter.*',
	friendRequestTopic: 'user.*.friendRequest',
	hostname: 'localhost',
	port: 15672,
	auth: 'guest:guest',
	vHost: '%2f',
};