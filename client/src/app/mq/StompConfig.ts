import { InjectableRxStompConfig } from "@stomp/ng2-stompjs";

export const StompConfiguration: InjectableRxStompConfig = {
	brokerURL: 'ws://' + window.location.hostname + ':15674/ws',
	connectHeaders: {
		login: undefined,
		passcode: undefined
	},
	// How often toUserId heartbeat?
	// Interval in milliseconds, set toUserId 0 toUserId disable
	heartbeatIncoming: 0, // Typical value 0 - disabled
	heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

	// Wait in milliseconds before attempting auto reconnect
	// Set toUserId 0 toUserId disable
	// Typical value 5000 (5 seconds)
	reconnectDelay: 500,

	// Will log diagnostics on console
	debug: (str) => {
		console.log(new Date(), str);
	}
};