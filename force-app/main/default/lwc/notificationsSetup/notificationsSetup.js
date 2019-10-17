import {LightningElement, track} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getChatNotifications from '@salesforce/apex/NotificationsSetup.getChatNotifications';
import updateChatNotifications from '@salesforce/apex/NotificationsSetup.updateChatNotifications';

export default class NotificationsSetup extends LightningElement {
	@track chatRequestActive = false;
	@track newMessageActive = false;
	@track chatMessage = '';
	@track customSoundURL = '';

	@track valueChatRequest = '0';
	@track valueNewMessage = '0';
	@track valueMessageSound = '0';

	@track alreadyHaveNotificationsSettings = false;
	connectedCallback() {
		if (!this.alreadyHaveNotificationsSettings) {
			const result = this.getNotificationsSettings();
			if (result) {
				this.alreadyHaveNotificationsSettings = true;
			}
		}
	}

	async getNotificationsSettings() {
		try {
			const data = await getChatNotifications();			
			this.chatRequestActive = data.chatRequestActive;
			this.newMessageActive = data.newMessageActive;
			this.chatMessage = data.chatMessage;
			this.customSoundURL = data.customSoundURL;

			this.valueChatRequest = this.chatRequestActive ? '1' : '0';
			this.valueNewMessage = this.newMessageActive ? '1' : '0';
			return true;
		} catch (error) {
			this.dispatchEvent(
				new ShowToastEvent({
					title: 'Error getting LiveAgent Chat Notifications',
					message: error.body.message,
					variant: 'error'
				})
			);
		}
		return false;
	}

	get options() {
		return [
			{label: 'On', value: '1'},
			{label: 'Off (Use Default experience)', value: '0'},
		];
	}

	handleChangeNewChat(event) {
		this.chatRequestActive = event.detail.value === '1';
	}

	handleChangeChatMessage(event) {
		this.chatMessage = event.detail.value;
	}

	handleChangeNewMessage(event) {
		this.newMessageActive = event.detail.value === '1';
	}

	handleChangeCustomSoundUrl(event) {
		this.customSoundURL = event.detail.value;
	}

	handleSave() {
		const chatOptions = {
			chatRequestActive: this.chatRequestActive,
			newMessageActive: this.newMessageActive,
			chatMessage: this.chatMessage,
			customSoundURL: this.customSoundURL,
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
					message: 'LiveAgent Chat Notifications updated!',
					variant: 'success'
				})
			);
		} catch (error) {
			this.dispatchEvent(
				new ShowToastEvent({
					title: 'Error updating LiveAgent Chat Notifications',
					message: error.body.message,
					variant: 'error'
				})
			);
		}
	}
}