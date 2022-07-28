import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { AdaptiveCardInvokeResponse, AdaptiveCardInvokeValue, Attachment, CardFactory, InvokeResponse, MessageFactory, MessagingExtensionAction, MessagingExtensionActionResponse, StatusCodes, TeamsActivityHandler, TeamsChannelAccount, TeamsInfo, TurnContext } from "botbuilder";
import { AssignToMember, CreateIncidentData, IncidentDetails } from "./cardModels";
import createIncidentCard from "./adaptiveCards/createIncident.json";
import reviewIncidentCard from "./adaptiveCards/reviewIncident.json";
import assignedToCard from "./adaptiveCards/assignedTo.json";
import approvedCard from "./adaptiveCards/approvedIncident.json";
import rejectedCard from "./adaptiveCards/rejectedIncident.json";
import { CardResponseHelper } from "./cardResponseHelper";

export class BotActivityHandler extends TeamsActivityHandler {
    async handleTeamsMessagingExtensionFetchTask(
        context: TurnContext,
        action: MessagingExtensionAction
    ): Promise<MessagingExtensionActionResponse> {
        if (action.commandId === "initWorkflow") {
            // generate response card
            const createIncidentCardJson = await this.processInitialWorkflow(context);
            return CardResponseHelper.toTaskModuleResponse(CardFactory.adaptiveCard(createIncidentCardJson));
        }

        return null;
    }

    public async handleTeamsMessagingExtensionSubmitAction(
        context: TurnContext,
        action: any
    ): Promise<MessagingExtensionActionResponse> {
        let adaptiveCard: any;
        let cardAttachment: Attachment
        switch (action.commandId) {
            case "initWorkflow":
                adaptiveCard = await this.processCreateIncident(context, action.data);
                cardAttachment = CardFactory.adaptiveCard(adaptiveCard);

                return CardResponseHelper.toMessagingExtensionBotMessagePreviewResponse(cardAttachment)
            default:
                throw new Error("NotImplemented");
        }
    }

    protected async handleTeamsMessagingExtensionBotMessagePreviewSend(
        context: TurnContext,
        action: MessagingExtensionAction
    ): Promise<MessagingExtensionActionResponse> {
        // This is a send so we are done and we will create the adaptive card editor.
        if (action.commandId === 'initWorkflow') {
            // The data has been returned to the bot in the action structure.
            var activityPreview = action.botActivityPreview[0];
            const cardAttachment = activityPreview.attachments[0];
            const responseActivity = {
                type: 'message',
                attachments: [cardAttachment],
                channelData: {
                    onBehalfOf: [
                        {
                            itemId: 0,
                            mentionType: 'person',
                            mri: context.activity.from.id,
                            displayName: context.activity.from.name
                        }]
                }
            };

            // THIS WILL WORK IF THE BOT IS INSTALLED. (SendActivityAsync will throw if the bot is not installed.)
            await context.sendActivity(responseActivity);
        }

        return null;
    }

    protected async handleTeamsMessagingExtensionBotMessagePreviewEdit(
        context: TurnContext,
        action: MessagingExtensionAction
    ): Promise<MessagingExtensionActionResponse> {
        if (action.commandId === 'initWorkflow') {
            // The data has been returned to the bot in the action structure.
            var activityPreview = action.botActivityPreview[0];
            const cardContent = activityPreview.attachments[0].content;
            const data = cardContent.refresh.action.data;

            const assignees: AssignToMember[] = await this.getAssignees(context);
            const submitData = {
                incidentId: data.incidentId,
                incidentTitle: data.incidentTitle,
                createdByName: data.createdByName,
                createdByUserId: data.createdByUserId,
                assignedToName: data.assignedToName,
                assignedToUserId: data.assignedToUserId,
                assignees: assignees
            };

            const editorCard = AdaptiveCards.declare(createIncidentCard).render(submitData);
            const editorCardAttachment = CardFactory.adaptiveCard(editorCard);
            return CardResponseHelper.toTaskModuleResponse(editorCardAttachment);
        }

        return null;
    }

    protected async onAdaptiveCardInvoke(context: TurnContext, invokeValue: AdaptiveCardInvokeValue): Promise<AdaptiveCardInvokeResponse> {
        const action = context.activity.value.action;
        const verb = action.verb;
        let cardJson = undefined;

        if (verb) {
            switch (verb) {
                case "reviewRefresh":
                    cardJson = await this.processReviewRefresh(context);
                    break;
                case "approved":
                    cardJson = await this.processApproved(context);
                    break;
                case "rejected":
                    cardJson = await this.processRejected(context);
                    break;
            }
        }

        return CardResponseHelper.toAdaptiveCardInvokeResponse(cardJson);
    }

    async processInitialWorkflow(context: TurnContext): Promise<any> {
        // prepare card data
        const assignees: AssignToMember[] = await this.getAssignees(context);
        var createdUser = await TeamsInfo.getMember(context, context.activity.from.id);
        const createIncidentData: CreateIncidentData = {
            incidentTitle: "",
            createdByName: context.activity.from.name,
            createdByUserId: createdUser.id,
            assignees: assignees,
        };

        // generate response card
        const createIncidentCardJson = AdaptiveCards.declare(createIncidentCard).render(createIncidentData);
        return createIncidentCardJson;
    }

    async processCreateIncident(context: TurnContext, data: any): Promise<any> {
        //const data = context.activity.value.data
        const assignedToUser = (await TeamsInfo.getMember(context, data.assignedToUserId));
        data.assignedToName = assignedToUser.name;

        const incidentDetails: IncidentDetails = {
            incidentId: Math.random().toString(),
            incidentTitle: data.incidentTitle,
            createdByUserId: data.createdByUserId,
            createdByName: data.createdByName,
            assignedToUserId: data.assignedToUserId,
            assignedToName: data.assignedToName
        };

        const reviewCardJson = AdaptiveCards.declare(reviewIncidentCard).render(incidentDetails);
        return reviewCardJson;
    }

    async processReviewRefresh(context: TurnContext): Promise<any> {
        const action = context.activity.value.action;
        const assignedToCardJson = AdaptiveCards.declare(assignedToCard).render(action.data);
        return assignedToCardJson;
    }

    async processApproved(context: TurnContext): Promise<any> {
        const action = context.activity.value.action;
        const approvedCardJson = AdaptiveCards.declare(approvedCard).render(action.data);

        // Update the card for creator
        const approvedActivity = MessageFactory.attachment(CardFactory.adaptiveCard(approvedCardJson));
        approvedActivity.id = context.activity.replyToId;;
        await context.updateActivity(approvedActivity);

        // // Update the card for assignee (resolver)
        return approvedCardJson;
    }

    async processRejected(context: TurnContext): Promise<any> {
        const action = context.activity.value.action;
        const rejectedCardJson = AdaptiveCards.declare(rejectedCard).render(action.data);

        // Update the card for creator
        const rejectedActivity = MessageFactory.attachment(CardFactory.adaptiveCard(rejectedCardJson));
        rejectedActivity.id = context.activity.replyToId;;
        await context.updateActivity(rejectedActivity);

        // // Update the card for assignee (resolver)
        return rejectedCardJson;
    }

    private async getAssignees(context: TurnContext): Promise<AssignToMember[]> {
        const allMembers: TeamsChannelAccount[] = [];
        let continuationToken: string | undefined;
        do {
            const pagedMembers = await TeamsInfo.getPagedMembers(context, undefined, continuationToken);
            continuationToken = pagedMembers.continuationToken;
            allMembers.push(...pagedMembers.members);
        } while (continuationToken !== undefined);

        const assignees: AssignToMember[] = [];
        for (const member of allMembers) {
            if (member.aadObjectId !== context.activity.from.aadObjectId) {
                const memberInfo: AssignToMember = { value: member.id, title: member.name };
                assignees.push(memberInfo);
            }
        }

        return assignees;
    }
}