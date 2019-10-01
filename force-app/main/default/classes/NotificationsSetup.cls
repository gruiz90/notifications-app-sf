/**
 * Created by gruiz on 2019-09-25.
 */

public with sharing class NotificationsSetup {

	@AuraEnabled(Cacheable=true)
	public static ChatOptions getChatNotifications() {
		Chat_Notifications__c chatNotifications = Chat_Notifications__c.getInstance();
		if (chatNotifications.Id != null) {
			return new ChatOptions(chatNotifications.Chat_Request_Active__c,
					chatNotifications.Chat_Message_Notification_Active__c, chatNotifications.Chat_Request_Sound_Active__c,
					chatNotifications.Chat_Message_Sound_Active__c, chatNotifications.Chat_Request_Message__c);
		} else {
			return new ChatOptions();
		}
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

	public class ChatOptions {
		@AuraEnabled Boolean chatActive { get; set; }
		@AuraEnabled Boolean messageActive { get; set; }
		@AuraEnabled Boolean chatSoundActive { get; set; }
		@AuraEnabled Boolean messageSoundActive { get; set; }
		@AuraEnabled String chatMessage { get; set; }

		public ChatOptions() {
			this.chatActive = false;
			this.messageActive = false;
			this.chatSoundActive = false;
			this.messageSoundActive = false;
			this.chatMessage = 'You have a new conversation request';
		}

		public ChatOptions(Boolean chatActive, Boolean messageActive, Boolean chatSoundActive,
				Boolean messageSoundActive, String chatMessage) {
			this.chatActive = chatActive;
			this.messageActive = messageActive;
			this.chatSoundActive = chatSoundActive;
			this.messageSoundActive = messageSoundActive;
			this.chatMessage = chatMessage;
		}
	}

}