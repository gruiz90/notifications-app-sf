({
	notifyNewWork: function () {
		let notification = new Notification('You have a new conversation request!', {
			body: "Click here to return to the Service Console",
			icon: "/logos/Salesforce/LightningService/logo.png",
			requireInteraction: true,
		});

		notification.onclick = function () {
			window.focus();
			this.close();
		};
		setTimeout(notification.close.bind(notification), 10000);
	},

	notifyNewMessage: function (content, user) {
		let notification = new Notification(`Message from ${user}`, {
			body: content,
			icon: "/logos/Salesforce/LightningService/logo.png",
			requireInteraction: true,
		});

		notification.onclick = function () {
			window.focus();
			this.close();
		};
		setTimeout(notification.close.bind(notification), 10000);
	}
})