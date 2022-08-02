import { Activity, CardFactory, MessageFactory, TeamsChannelAccount, TeamsInfo, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "./sdk/interface"
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import initialCreateCard from "./adaptiveCards/initialCreate.json";
import createIncidentCard from "./adaptiveCards/createIncident.json";
import reviewIncidentCard from "./adaptiveCards/reviewIncident.json";
import assignedToCard from "./adaptiveCards/assignedTo.json";
import approvedCard from "./adaptiveCards/approvedIncident.json";
import rejectedCard from "./adaptiveCards/rejectedIncident.json";
import { AssignToMember, CreateIncidentData, IncidentDetails } from "./cardModels";
import { ActionRegistry } from "./sdk/actionRegistry";
import { CardActionHandler } from "./sdk/actionHandler";

/**
 * The `IncidentReportingWorkflow` registers a pattern with the `TeamsFxBotCommandHandler` and responds
 * with an Adaptive Card if the user types the `triggerPatterns`.
 */

export class IncidentReportingWorkflow implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "createIncident";
  actionHandlers: CardActionHandler[] = [];
  
  //actionHandlerRegistry: ActionRegistry = new ActionRegistry();
  
  // build the actions (steps) to fulfil the workflow
  constructor() {
    this.actionHandlers.push(new CardActionHandler("initialRefresh", this.processInitialRefresh.bind(this)));
    this.actionHandlers.push(new CardActionHandler("reviewRefresh", this.processReviewRefresh.bind(this)));
    this.actionHandlers.push(new CardActionHandler("createIncident", this.processCreateIncident.bind(this)));
    this.actionHandlers.push(new CardActionHandler("approved", this.processApproved.bind(this)));
    this.actionHandlers.push(new CardActionHandler("rejected", this.processRejected.bind(this)));
  }

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);

    var createdByUser = await TeamsInfo.getMember(context, context.activity.from.id);
    const initialCardJson = AdaptiveCards.declare(initialCreateCard).render({
      createdByName: createdByUser.name,
      createdByUserId: createdByUser.id
    });

    return MessageFactory.attachment(CardFactory.adaptiveCard(initialCardJson));
  }

  // @WorkflowStep("initialRefresh")
  async processInitialRefresh(context: TurnContext): Promise<any> {
    // prepare card data
    const assignees: AssignToMember[] = await this.getAssignees(context);
    var createdUser = await TeamsInfo.getMember(context, context.activity.from.id);
    const createIncidentData: CreateIncidentData = {
      createdByName: context.activity.from.name,
      createdByUserId: createdUser.id,
      assignees: assignees
    };

    // generate response card
    const createIncidentCardJson = AdaptiveCards.declare(createIncidentCard).render(createIncidentData);
    return createIncidentCardJson;
  }

  // @WorkflowStep("createIncident")
  async processCreateIncident(context: TurnContext): Promise<any> {
    const action = context.activity.value.action;
    const assignedToUser = (await TeamsInfo.getMember(context, action.data.assignedToUserId));
    action.data.assignedToName = assignedToUser.name;
    const incidentDetails: IncidentDetails = {
      incidentId: Math.random().toString(),
      incidentTitle: action.data.incidentTitle,
      createdByUserId: action.data.createdByUserId,
      createdByName: action.data.createdByName,
      assignedToUserId: action.data.assignedToUserId,
      assignedToName: action.data.assignedToName
    };
    const reviewCardJson = AdaptiveCards.declare(reviewIncidentCard).render(incidentDetails);

    // Update the card for assignee
    const replyActivity = MessageFactory.attachment(CardFactory.adaptiveCard(reviewCardJson));
    replyActivity.id = context.activity.replyToId;;
    await context.updateActivity(replyActivity);

    // Update the card for creator
    return reviewCardJson;
  }

  // @WorkflowStep("reviewRefresh")
  async processReviewRefresh(context: TurnContext): Promise<any> {
    const action = context.activity.value.action;
    const assignedToCardJson = AdaptiveCards.declare(assignedToCard).render(action.data);
    return assignedToCardJson;
  }

  // @WorkflowStep("approved")
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

  // @WorkflowStep("rejected")
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

  async getAssignees(context: TurnContext): Promise<AssignToMember[]> {
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

export const incidentReportingCommand = new IncidentReportingWorkflow();