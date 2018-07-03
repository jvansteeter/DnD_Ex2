import { StompConfig } from "@stomp/ng2-stompjs";

export const StompConfiguration: StompConfig = {
	url: 'ws://' + window.location.hostname + ':15674/ws',
	headers: {
		login: undefined,
		passcode: undefined
	},
	// How often toUserId heartbeat?
	// Interval in milliseconds, set toUserId 0 toUserId disable
	heartbeat_in: 0, // Typical value 0 - disabled
	heartbeat_out: 20000, // Typical value 20000 - every 20 seconds

	// Wait in milliseconds before attempting auto reconnect
	// Set toUserId 0 toUserId disable
	// Typical value 5000 (5 seconds)
	reconnect_delay: 5000,

	// Will log diagnostics on console
	debug: false
};