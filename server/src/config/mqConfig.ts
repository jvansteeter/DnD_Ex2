export const MqConfig = {
	encounterQueueName: 'serverQueue',
	friendRequestQueueName: 'serverFriendRequestQueue',
	campaignInviteQueueName: 'serverCampaignInviteQueue',
	amqpUrl: 'amqp://guest:guest@localhost',
	encounterExchange: 'encounterExchange',
	userExchange: 'userExchange',
	encounterTopic: 'encounter.*',
	campaignExchange: 'campaignExchange',
	campaignTopic: 'campaign.*',
	friendRequestTopic: 'user.*.friendRequest',
	campaignInviteTopic: 'user.*.campaignInvite',
	hostname: 'localhost',
	port: 15672,
	auth: 'guest:guest',
	vHost: '%2f',
};