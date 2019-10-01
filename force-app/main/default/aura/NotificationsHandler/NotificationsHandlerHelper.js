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

	notifyNewWork: function (message, soundActive) {
		let notification = new Notification(message, {
			body: "Click here to return to the Service Console",
			icon: "/logos/Salesforce/LightningService/logo.png",
			requireInteraction: true,
		});

		if (soundActive) {
			console.log('Play sound from static resource here...');
			this.playSound($A.get('$Resource.Chat_Sound'));
		}

		notification.onclick = function () {
			window.focus();
			this.close();
		};
		const timeoutNewWork = setTimeout(notification.close.bind(notification), 10000);
	},

	notifyNewMessage: function (content, user, soundActive) {
		let notification = new Notification(`Message from ${user}`, {
			body: content,
			icon: "/logos/Salesforce/LightningService/logo.png",
			requireInteraction: true,
		});

		if (soundActive) {
			console.log('Play sound from static resource here...');
			this.playSound($A.get('$Resource.Message_Sound'));
		}

		notification.onclick = function () {
			window.focus();
			this.close();
		};
		const timeoutNewMessage = setTimeout(notification.close.bind(notification), 10000);
	},

	playSound: function (soundFile) {
		const audio = new Audio(soundFile);
		audio.play().then( result => {
			console.log('Playing notification sound!', result);
		}).catch( error => {
			console.log('Error trying to play notification sound', error);
		});
	}
});