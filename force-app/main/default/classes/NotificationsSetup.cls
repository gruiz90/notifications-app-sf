/**
 * Created by gruiz on 2019-09-25.
 */

public with sharing class NotificationsSetup {

	@AuraEnabled(Cacheable=true)
	public static Chat_Notifications__c getChatNotifications() {
		Chat_Notifications__c chatNotifications = Chat_Notifications__c.getInstance();
		if (chatNotifications.Id == null) {
			chatNotifications.Chat_Request_Active__c = false;
			chatNotifications.Chat_Message_Notification_Active__c = false;
			chatNotifications.Chat_Request_Sound_Active__c = false;
			chatNotifications.Chat_Message_Sound_Active__c = false;
			chatNotifications.Chat_Request_Message__c = 'You have a new conversation request';
		}
		return chatNotifications;
	}

	@AuraEnabled
	public static void updateChatNotifications(String chatOptionsJSON) {
		ChatOptions chatOptions = (ChatOptions) JSON.deserialize(chatOptionsJSON, ChatOptions.class);
		Chat_Notifications__c chatNotifications = Chat_Notifications__c.getInstance();
		chatNotifications.Chat_Request_Active__c = chatOptions.chatActive;
		chatNotifications.Chat_Message_Notification_Active__c = chatOptions.messageActive;
		chatNotifications.Chat_Request_Sound_Active__c = chatOptions.chatSoundActive;
		chatNotifications.Chat_Message_Sound_Active__c = chatOptions.messageSoundActive;
		chatNotifications.Chat_Request_Message__c = chatOptions.chatMessage;
		upsert chatNotifications;
	}

	class ChatOptions {
		Boolean chatActive;
		Boolean messageActive;
		Boolean chatSoundActive;
		Boolean messageSoundActive;
		String chatMessage;
	}

}