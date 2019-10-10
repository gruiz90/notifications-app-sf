/**
 * Created by gruiz on 2019-09-25.
 */

public with sharing class NotificationsSetup {

	@AuraEnabled
	public static ChatOptions getChatNotifications() {
		Conversation_Notifications__c chatNotifications =
				Conversation_Notifications__c.getInstance(UserInfo.getProfileId());
		if (chatNotifications.Id != null) {
			return new ChatOptions(chatNotifications.Chat_Request_Active__c,
					chatNotifications.Chat_Message_Notification_Active__c,
					chatNotifications.Chat_Request_Message__c, chatNotifications.Custom_Sound_URL__c);
		} else {
				return new ChatOptions();
		}
	}

	@AuraEnabled
	public static void updateChatNotifications(String chatOptionsJSON) {
		ChatOptions chatOptions = (ChatOptions) JSON.deserialize(chatOptionsJSON, ChatOptions.class);
		Conversation_Notifications__c chatNotifications =
				Conversation_Notifications__c.getInstance(UserInfo.getProfileId());
		chatNotifications.Chat_Request_Active__c = chatOptions.chatRequestActive;
		chatNotifications.Chat_Message_Notification_Active__c = chatOptions.newMessageActive;
		chatNotifications.Chat_Request_Message__c = chatOptions.chatMessage;
		chatNotifications.Custom_Sound_URL__c = chatOptions.customSoundURL;
		upsert chatNotifications;
	}

	public class ChatOptions {
		@AuraEnabled public Boolean chatRequestActive { get; set; }
		@AuraEnabled public Boolean newMessageActive { get; set; }
		@AuraEnabled public String chatMessage { get; set; }
		@AuraEnabled public String customSoundURL { get; set; }

		public ChatOptions() {
			this.chatRequestActive = false;
			this.newMessageActive = false;
			this.chatMessage = 'You have a new conversation request';
			this.customSoundURL = '';
		}

		public ChatOptions(Boolean chatActive, Boolean messageActive,
				String chatMessage, String customSoundURL) {
			this.chatRequestActive = chatActive;
			this.newMessageActive = messageActive;
			this.chatMessage = chatMessage;
			this.customSoundURL = customSoundURL;
		}
	}

}