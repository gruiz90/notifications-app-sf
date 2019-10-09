({
	onInit: function (component, event, helper) {
		// Ask for notifications permission if needed
		component.set('v.notifyPermission', false);
		if (!("Notification" in window)) {
			console.log("This browser does not support system notifications");
		} else if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
			Notification.requestPermission().then(result => {
				if (result === 'denied') {
					console.log('Permission wasn\'t granted. Allow a retry.');
				}
				if (result === 'default') {
					console.log('The permission request was dismissed.');
				}
			});
		}

		// Do something with the granted permission.
		if (Notification.permission === "granted") {
			component.set('v.notifyPermission', true);
			// Get Chat Notifications custom setting only if permission granted
			// For now this is only done in the onInit function
			helper.setChatNotificationsSettings(component);
		}
	},

	onOmniNewWork: function (component, event, helper) {
		const workItemId = event.getParam('workItemId');
		const workId = event.getParam('workId');
		console.log('New omni channel work assigned: ', workItemId, workId);

		if (component.get('v.notificationSettings').chatRequestActive) {
			console.log('Chat request active so show notification if permission granted -> ');
			if (component.get('v.notifyPermission') === true && document.visibilityState === "hidden") {
				helper.notifyNewWork(component);
			}
		}
	},

	onNewMessage: function (component, event, helper) {
		const recordId = event.getParam('recordId');
		const content = event.getParam('content');
		const name = event.getParam('name');
		const type = event.getParam('type');
		const timestamp = event.getParam('timestamp');
		console.log('New message: ', recordId, content, name, type, timestamp);
		if (component.get('v.notificationSettings').newMessageActive) {
			console.log('Message active so show notification if permission granted -> ');
			if (component.get('v.notifyPermission') === true && document.visibilityState === "hidden") {
				helper.notifyNewMessage(component, name, content);
			}
		}
	}
});
