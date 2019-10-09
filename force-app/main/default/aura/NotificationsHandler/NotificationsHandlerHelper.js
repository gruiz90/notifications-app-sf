({
	setChatNotificationsSettings: function (component) {
		let action = component.get("c.getChatNotifications");

		action.setCallback(this, function(response){
			if(component.isValid() && response !== null && response.getState() === 'SUCCESS'){
				//saving custom setting to attribute
				component.set("v.notificationSettings", response.getReturnValue());
				console.debug(response.getReturnValue());//Check the output
			}
		});

		$A.enqueueAction(action);
	},

	notifyNewWork: function (component) {
		// First close the last chat request browser notification
		const oldNotification = component.get("v.chatRequestNotification");
		if (oldNotification) {
			oldNotification.close();
		}
		// Clean the timeout as well if exists
		let timeoutChatRequest = component.get("v.timeoutChatRequest");
		if (timeoutChatRequest) {
			clearTimeout(timeoutChatRequest);
		}

		// Then create the chat request browser notification
		const message = component.get('v.notificationSettings').chatMessage;
		let notification = new Notification(message, {
			body: "Click here to return to the Service Console",
			icon: "/logos/Salesforce/LightningService/logo.png",
			requireInteraction: true,
		});
		// Add an onclick listener for closing it
		notification.onclick = function () {
			window.focus();
			this.close();
		};
		//saving notification in component attribute
		component.set("v.chatRequestNotification", notification);

		// 1 minute timeout to close the browser notification
		timeoutChatRequest = setTimeout(notification.close.bind(notification), 60000);
		component.set("v.timeoutChatRequest", timeoutChatRequest);
	},

	notifyNewMessage: function (content, user, component) {
		// First close the last chat request browser notification
		const oldNotification = component.get("v.messageNotification");
		if (oldNotification) {
			oldNotification.close();
		}
		// Clean the timeout as well if exists
		let timeoutMessage = component.get("v.timeoutMessage");
		if (timeoutMessage) {
			clearTimeout(timeoutMessage);
		}

		// Then create the new message browser notification
		let notification = new Notification(`Message from ${user}`, {
			body: content,
			icon: "/logos/Salesforce/LightningService/logo.png",
			requireInteraction: true,
		});
		// Add an onclick listener for closing it
		notification.onclick = function () {
			window.focus();
			this.close();
		};
		//saving new message notification in component attribute
		component.set("v.messageNotification", notification);

		// Play alert sound if the option is on
		if (component.get('v.notificationSettings').messageSoundActive) {
			const soundURL = component.get('v.notificationSettings').customSoundURL;
			if (soundURL && soundURL.length > 0) {
				console.log('Playing sound file from custom sound URL field...');
				this.playSound(soundURL);
			} else {
				console.log('Play default sound from static resource here...');
				this.playSound($A.get('$Resource.Message_Alert_Sound'));
			}
		}

		// 1 minute timeout to close the browser notification
		timeoutMessage = setTimeout(notification.close.bind(notification), 60000);
		component.set("v.timeoutMessage", timeoutMessage);
	},

	playSound: function (soundFile) {
		const audio = new Audio(soundFile);
		audio.play().then( result => {
			console.log('Playing notification alert sound!');
		}).catch( error => {
			console.log('Error trying to play notification alert sound', error);
		});
	}
});