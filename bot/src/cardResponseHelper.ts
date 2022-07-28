import { MessageFactory, InputHints, Attachment, MessagingExtensionActionResponse, Activity, AdaptiveCardInvokeResponse, StatusCodes } from 'botbuilder';

export class CardResponseHelper {
    static toTaskModuleResponse(cardAttachment: Attachment): MessagingExtensionActionResponse {
        const response: MessagingExtensionActionResponse = {
            task: {
              type: 'continue',
              value: {
                card: cardAttachment,
                height: 450,
                title: `Task Module Example`,
                width: 500
              }
            }
          };
        return response;
    }

    static toMessagingExtensionBotMessagePreviewResponse(cardAttachment: Attachment): MessagingExtensionActionResponse {
        return {
            composeExtension: {              
                type: 'botMessagePreview',
                activityPreview: MessageFactory.attachment(cardAttachment, null, null, InputHints.ExpectingInput) as Activity
            }
        };
    }

    static toAdaptiveCardInvokeResponse(cardJason: any): AdaptiveCardInvokeResponse {
      return {
        statusCode: StatusCodes.OK,
        type: "application/vnd.microsoft.card.adaptive",
        value: cardJason
    };
    }
}