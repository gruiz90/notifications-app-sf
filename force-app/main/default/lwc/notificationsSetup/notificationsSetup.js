import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getChatNotifications from '@salesforce/apex/NotificationsSetup.getChatNotifications';
import updateChatNotifications from '@salesforce/apex/NotificationsSetup.updateChatNotifications';

export default class NotificationsSetup extends LightningElement {
	@track chatRequestActive = false;
	@track newMessageActive = false;
	@track chatSoundActive = false;
	@track messageSoundActive = false;
	@track chatMessage  = '';

	@track valueChatRequest = '0';
	@track valueNewMessage = '0';
	@track valueChatSound = '0';
	@track valueMessageSound = '0';

	@wire(getChatNotifications)
	wiredNotificationSettings({ error, data }) {
		if (data) {
			console.log(JSON.stringify(data));
			this.chatRequestActive = data.Chat_Request_Active__c;
			this.newMessageActive = data.Chat_Message_Notification_Active__c;
			this.chatSoundActive = data.Chat_Request_Sound_Active__c;
			this.messageSoundActive = data.Chat_Message_Sound_Active__c;
			this.chatMessage = data.Chat_Request_Message__c;

			this.valueChatRequest = this.chatRequestActive ? '1' : '0';
			this.valueNewMessage = this.newMessageActive ? '1' : '0';
			this.valueChatSound = this.chatSoundActive ? '1' : '0';
			this.valueMessageSound = this.messageSoundActive ? '1' : '0';
		} else if (error) {
			this.dispatchEvent(
				new ShowToastEvent({
					title: 'Error using wire on Chat Notifications',
					message: error.message,
					variant: 'error'
				})
			);
		}
	}

	get options() {
		return [
			{ label: 'On', value: '1' },
			{ label: 'Off (Use Default experience)', value: '0' },
		];
	}

	get optionsChatSound() {
		return [
			{ label: 'On  (Audio file from Chat_Sound static resource)', value: '1' },
			{ label: 'Off (Use Default experience)', value: '0' },
		];
	}

	get optionsMessageSound() {
		return [
			{ label: 'On  (Audio file from Message_Sound static resource)', value: '1' },
			{ label: 'Off (Use Default experience)', value: '0' },
		];
	}

	handleChangeNewChat(event) {
		this.chatRequestActive = event.detail.value === '1';
	}

	handleChangeChatMessage(event) {
		this.chatMessage = event.detail.value;
	}

	handleChangeNewChatSound(event) {
		this.chatSoundActive = event.detail.value === '1';
	}

	handleChangeNewMessage(event) {
		this.newMessageActive = event.detail.value === '1';
	}

	handleChangeNewMessageSound(event) {
		this.messageSoundActive = event.detail.value === '1';
	}

	handleSave() {
		const chatOptions = {
			chatActive: this.chatRequestActive,
			messageActive: this.newMessageActive,
			chatSoundActive: this.chatSoundActive,
			messageSoundActive: this.messageSoundActive,
			chatMessage: this.chatMessage,
		};
		this.updateNotificationsSettings(chatOptions);
	}

	async updateNotificationsSettings(chatOptions) {
		try {
			await updateChatNotifications({
				chatOptionsJSON: JSON.stringify(chatOptions)
			});
			this.dispatchEvent(
				new ShowToastEvent({
					title: 'Success',
					message: 'Chat Notifications updated!',
					variant: 'success'
				})
			);
		} catch (error) {
			this.dispatchEvent(
				new ShowToastEvent({
					title: 'Error updating Chat Notifications',
					message: error.body.message,
					variant: 'error'
				})
			);
		}
	}
}