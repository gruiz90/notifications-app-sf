/**
 * Created by gruiz on 2019-09-25.
 */
@isTest
private class NotificationsSetupTest {

	private static testMethod void notificationsSetupTest() {
		Test.startTest();

		NotificationsSetup.ChatOptions chatOptions = NotificationsSetup.getChatNotifications();
		System.assert(!chatOptions.chatRequestActive && chatOptions.chatMessage == 'You have a new conversation request'
				&& String.isEmpty(chatOptions.customSoundURL));

		chatOptions.chatRequestActive = true;
		chatOptions.newMessageActive = true;
		chatOptions.chatMessage = 'New Chat Request';
		chatOptions.customSoundURL = 'https://test.com/sound.mp3';
		NotificationsSetup.updateChatNotifications(JSON.serialize(chatOptions));

		chatOptions = NotificationsSetup.getChatNotifications();
		System.assert(chatOptions.chatRequestActive && chatOptions.chatMessage == 'New Chat Request'
				&& chatOptions.customSoundURL == 'https://test.com/sound.mp3');

		Test.stopTest();
	}

}