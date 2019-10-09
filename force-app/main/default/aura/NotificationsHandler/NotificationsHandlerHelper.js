({
	setChatNotificationsSettings: function (component) {
		let action = component.get("c.getChatNotifications");

		action.setCallback(this, function (response) {
			if (component.isValid() && response !== null && response.getState() === 'SUCCESS') {
				//saving custom setting to attribute
				component.set("v.notificationSettings", response.getReturnValue());
				console.debug(response.getReturnValue());
			}
		});

		// eslint-disable-next-line no-undef
		$A.enqueueAction(action);
	},

	clearPreviousNotification: function (prevNotification, timeout) {
		// First close the last chat request browser notification
		if (prevNotification) {
			prevNotification.close();
		}
		// Clean the timeout as well if exists
		if (timeout) {
			clearTimeout(timeout);
		}
	},

	createNotification: function (message, body) {
		let notification = new Notification(message, {
			body: body,
			icon: "/logos/Salesforce/LightningService/logo.png",
			requireInteraction: true,
		});
		// Add an onclick listener for closing it
		notification.onclick = function () {
			window.focus();
			this.close();
		};
		return notification;
	},

	notifyNewWork: function (component) {
		this.clearPreviousNotification(
			component.get("v.chatRequestNotification"),
			component.get("v.timeoutChatRequest")
		);

		let notification = this.createNotification(
			component.get('v.notificationSettings').chatMessage,
			"Click here to return to the Service Console"
		);
		//saving notification in component attribute
		component.set("v.chatRequestNotification", notification);

		// 1 minute timeout to close the browser notification
		const timeoutChatRequest = setTimeout(notification.close.bind(notification), 60000);
		component.set("v.timeoutChatRequest", timeoutChatRequest);
	},

	notifyNewMessage: function (component, user, content) {
		this.clearPreviousNotification(
			component.get("v.messageNotification"),
			component.get("v.timeoutMessage")
		);

		let notification = this.createNotification(
			`Message from ${user}`,
			content
		);
		//saving notification in component attribute
		component.set("v.messageNotification", notification);

		// Play alert sound if the option is on
		this.playAlertSound(
			component.get('v.notificationSettings').messageSoundActive,
			component.get('v.notificationSettings').customSoundURL
		);

		// 1 minute timeout to close the browser notification
		const timeoutMessage = setTimeout(notification.close.bind(notification), 60000);
		component.set("v.timeoutMessage", timeoutMessage);
	},

	playAlertSound: function (active, soundURL) {
		if (active) {
			if (soundURL && soundURL.length > 0) {
				console.log('Playing sound file from custom sound URL field...');
				this.playSound(soundURL);
			} else {
				console.log('Play default sound from static resource here...');
				// eslint-disable-next-line no-undef
				this.playSound($A.get('$Resource.Default_Alert_Sound'));
			}
		}
	},

	playSound: function (soundFile) {
		const audio = new Audio(soundFile);
		audio.play().then(() => {
			console.log('Playing notification alert sound!');
		}).catch(error => {
			console.log('Error trying to play notification alert sound', error);
		});
	}
});