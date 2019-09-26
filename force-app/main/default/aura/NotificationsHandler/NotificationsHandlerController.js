({
	onInit: function (component, event, helper) {
		// Ask for notifications permission if needed
		component.set('v.notifyPermission', false);
		if (!("Notification" in window)) {
			alert("This browser does not support system notifications");
		} else if (Notification.permission === "granted") {
			component.set('v.notifyPermission', true);
		} else if (Notification.permission !== 'denied') {
			Notification.requestPermission(function (permission) {
				if (permission === "granted") {
					component.set('v.notifyPermission', true);
				}
			});
		}
	},

	onOmniNewWork: function (component, event, helper) {
		var workItemId = event.getParam('workItemId');
		var workId = event.getParam('workId');
		var workspace = component.find("workspace");
		console.log('New omnichannel work assigned: ', workItemId, workId);
		if (component.get('v.notifyPermission') === true && document.visibilityState === "hidden") {
			helper.notifyNewWork();
		}
	},

	onNewMessage: function (component, event, helper) {
		var recordId = event.getParam('recordId');
		var content = event.getParam('content');
		var name = event.getParam('name');
		var type = event.getParam('type');
		var timestamp = event.getParam('timestamp');
		var workspace = component.find("workspace");
		console.log('New message: ', recordId, content, name, type, timestamp);
		if (component.get('v.notifyPermission') === true && document.visibilityState === "hidden") {
			helper.notifyNewMessage(content, name);
		}
	}
})
