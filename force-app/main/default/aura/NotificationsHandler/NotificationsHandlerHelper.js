({
	setChatNotificationsSettings: function (component) {
		let action = component.get('c.getChatNotifications');

		action.setCallback(this, function (response) {
			if (component.isValid() && response !== null && response.getState() === 'SUCCESS') {
				//saving custom setting to attribute
				component.set('v.notificationSettings', response.getReturnValue());				

				// Initialize dictionaries
				component.set('v.chatRequestsDict', {});
				component.set('v.timeoutsChatRequestDict', {});
				component.set('v.messagesNotificationDict', {});
				component.set('v.timeoutsMessageDict', {});
			}
		});

		// eslint-disable-next-line no-undef
		$A.enqueueAction(action);
	},

	clearPreviousNotification: function (notification, timeout) {
		// First close the last chat request browser notification
		if (notification) {
			notification.close();
		}
		// Clean the timeout as well if exists
		if (timeout) {
			clearTimeout(timeout);
		}
	},

	createNotification: function (component, workItemId, newMessage, message, body) {
		let notification = new Notification(message, {
			body: body,
			icon: '/logos/Salesforce/LightningService/logo.png',
			requireInteraction: true,
		});
		// Add an onclick listener for closing it
		notification.onclick = function () {
			window.focus();
			this.close();

			if (newMessage) {
				const workspaceAPI = component.find("workspace");
				workspaceAPI.openTab({
					url: `/lightning/r/LiveChatTranscript/${workItemId}/view`,
				}).then(function (response) {
					workspaceAPI.focusTab({tabId: response});
				}).catch(function (error) {
					console.log(error);
				});
			}
		};
		return notification;
	},

	updateComponentDict: function (component, key, id, value) {
		let dict = component.get(key);
		dict[id] = value;
		//saving notification in component attribute
		component.set(key, dict);
	},

	notifyNewWork: function (component, workItemId) {
		this.clearPreviousNotification(
			component.get('v.chatRequestsDict')[workItemId],
			component.get('v.timeoutsChatRequestDict')[workItemId]
		);

		let notification = this.createNotification(component, workItemId, false,
			component.get('v.notificationSettings').chatMessage, 'Click here to return to the Service Console'
		);
		this.updateComponentDict(component, 'v.chatRequestsDict', workItemId, notification);

		// 1 minute timeout to close the browser notification
		const timeoutChatRequest = setTimeout(notification.close.bind(notification), 60000);
		this.updateComponentDict(component, 'v.timeoutsChatRequestDict', workItemId, timeoutChatRequest);
	},

	notifyNewMessage: function (component, workItemId, name, content) {
		this.clearPreviousNotification(
			component.get('v.messagesNotificationDict')[workItemId],
			component.get('v.timeoutsMessageDict')[workItemId]
		);

		let notification = this.createNotification(component, workItemId, true,
			`Message from ${name}`, content
		);
		this.updateComponentDict(component, 'v.messagesNotificationDict', workItemId, notification);

		// 1 minute timeout to close the browser notification
		const timeoutMessage = setTimeout(notification.close.bind(notification), 60000);
		this.updateComponentDict(component, 'v.timeoutsMessageDict', workItemId, timeoutMessage);

		// Play alert sound if the option is on
		this.playAlertSound(component.get('v.notificationSettings').customSoundURL);
	},

	playAlertSound: function (soundURL) {
		if (soundURL && soundURL.length > 0) {
			this.playSound(soundURL);
		} else {
			// eslint-disable-next-line no-undef
			this.playSound($A.get('$Resource.Default_Alert_Sound'));
		}
	},

	playSound: function (soundFile) {
		const audio = new Audio(soundFile);
		audio.play().catch(error => {
			console.log('Error trying to play notification alert sound', error);
		});
	}
});