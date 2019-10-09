import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getChatNotifications from '@salesforce/apex/NotificationsSetup.getChatNotifications';
import updateChatNotifications from '@salesforce/apex/NotificationsSetup.updateChatNotifications';

export default class NotificationsSetup extends LightningElement {
	@track chatRequestActive = false;
	@track newMessageActive = false;
	@track messageSoundActive = false;
	@track chatMessage  = '';
	@track customSoundURL = '';

	@track valueChatRequest = '0';
	@track valueNewMessage = '0';
	@track valueMessageSound = '0';

	// @track uploaderMessage = '';
	// @track uploaderError = false;
	// encodedFileContent = '';
	// @track showLoadingSpinner = false;
	// @track disableUploaderBtn = false;

	alreadyHaveNotificationsSettings = false;
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
			console.log(JSON.stringify(data));
			this.chatRequestActive = data.chatRequestActive;
			this.newMessageActive = data.newMessageActive;
			this.messageSoundActive = data.messageSoundActive;
			this.chatMessage = data.chatMessage;
			this.customSoundURL = data.customSoundURL;

			this.valueChatRequest = this.chatRequestActive ? '1' : '0';
			this.valueNewMessage = this.newMessageActive ? '1' : '0';
			this.valueMessageSound = this.messageSoundActive ? '1' : '0';
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
			{ label: 'On', value: '1' },
			{ label: 'Off (Use Default experience)', value: '0' },
		];
	}

	get optionsMessageSound() {
		return [
			{ label: 'On', value: '1' },
			{ label: 'Off', value: '0' },
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
		if (!this.newMessageActive) {
			this.messageSoundActive = false;
		}
	}

	handleChangeNewMessageSound(event) {
		this.messageSoundActive = event.detail.value === '1';
	}

	handleChangeCustomSoundUrl(event) {
		this.customSoundURL = event.detail.value;
	}

	handleSave() {
		const chatOptions = {
			chatRequestActive: this.chatRequestActive,
			newMessageActive: this.newMessageActive,
			messageSoundActive: this.messageSoundActive,
			chatMessage: this.chatMessage,
			customSoundURL: this.customSoundURL,
		};
		this.updateNotificationsSettings(chatOptions)
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

	// get acceptedFormats() {
	// 	return ['.mp3', '.wav'];
	// }
	//
	// handleFilesChange(event) {
	// 	const filesUploaded = event.target.files;
	// 	if (filesUploaded.length > 0) {
	// 		const file = filesUploaded[0];
	// 		const fileName = file.name;
	// 		const allowedFormat = /(\.mp3|\.wav)$/i;
	// 		if (!allowedFormat.exec(fileName)) {
	// 			this.uploaderMessage = 'The uploaded file must be on mp3 or wav format!';
	// 			this.uploaderError = true;
	// 			this.fileName = '';
	// 		} else {
	// 			this.fileName = fileName;
	// 			this.readFile(file);
	// 		}
	// 	}
	// }
	//
	// readFile(file) {
	// 	this.disableUploaderBtn = true;
	// 	this.showLoadingSpinner = true;
	// 	// create a FileReader object
	// 	let fileReader = new FileReader();
	// 	// set onload function of FileReader object
	// 	fileReader.onloadend = (() => {
	// 		const fileContents = fileReader.result;
	// 		this.encodedFileContent = window.btoa(fileContents);
	// 		setTimeout(() => {
	// 			// TODO: Save the fileContents as an Attachment to the org here
	// 			this.showLoadingSpinner = false;
	// 			this.disableUploaderBtn = false;
	// 		}, 2000);
	// 	});
	// 	fileReader.readAsBinaryString(file);
	// }
}