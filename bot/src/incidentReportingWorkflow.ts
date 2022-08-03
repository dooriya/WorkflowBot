import { Activity, CardFactory, MessageFactory, TeamsChannelAccount, TeamsInfo, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
} from "./sdk/interface"
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import createIncidentCard from "./adaptiveCards/createIncident.json";
import reviewIncidentCard from "./adaptiveCards/reviewIncident.json";
import assignedToCard from "./adaptiveCards/assignedTo.json";
import approvedCard from "./adaptiveCards/approvedIncident.json";
import rejectedCard from "./adaptiveCards/rejectedIncident.json";
import { AssignToMember, CreateIncidentData, IncidentDetails } from "./cardModels";
import { ActionHandlerRegistry } from "./sdk/actionHandlerRegistry";
import { teamsBot } from "./internal/initialize";
import { Member } from "./sdk/notification";

/**
 * The `IncidentReportingWorkflow` registers a pattern with the `TeamsFxBotCommandHandler` and responds
 * with an Adaptive Card if the user types the `triggerPatterns`.
 */
export class IncidentReportingWorkflow implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "createIncident";
  actionHandlerRegistry: ActionHandlerRegistry = new ActionHandlerRegistry();

  // hard-code team id here to fetch the members in a personal scope
  private readonly teamId = "19:kj7hexHcaJzXJpfLJoF13fXf3h02RurYyeW3RyCMrRA1@thread.tacv2";

  constructor() {
    this.actionHandlerRegistry
      .registerHandler("createIncident", this.processCreateIncident.bind(this))
      .registerHandler("approved", this.processApproved.bind(this))
      .registerHandler("rejected", this.processRejected.bind(this))
  }

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity> | void> {
    console.log(`Bot received message: ${message.text}`);

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
    return MessageFactory.attachment(CardFactory.adaptiveCard(createIncidentCardJson));
  }

  // @WorkflowStep("createIncident")
  async processCreateIncident(context: TurnContext): Promise<any> {
    const action = context.activity.value.action;
    const assignedToUser = (await TeamsInfo.getTeamMember(context, this.teamId, action.data.assignedToUserId));
    action.data.assignedToName = assignedToUser.name;
    const incidentDetails: IncidentDetails = {
      incidentId: Math.random().toString(),
      incidentTitle: action.data.incidentTitle,
      createdByUserId: action.data.createdByUserId,
      createdByName: action.data.createdByName,
      assignedToUserId: action.data.assignedToUserId,
      assignedToName: action.data.assignedToName
    };
    
    // send notification to assignee
    const assignedToCardJson = AdaptiveCards.declare(assignedToCard).render(incidentDetails);
    const assignee = await this.getNotificationMember(context, incidentDetails.assignedToUserId);
    if (assignee !== undefined) {
      await assignee.sendAdaptiveCard(assignedToCardJson);
    }

    // reply to initiator
    const reviewCardJson = AdaptiveCards.declare(reviewIncidentCard).render(incidentDetails);
    return reviewCardJson;
  }

  // @WorkflowStep("approved")
  async processApproved(context: TurnContext): Promise<any> {
    const action = context.activity.value.action;
    const incidentDetails = action.data;
    const approvedCardJson = AdaptiveCards.declare(approvedCard).render(action.data);

    // send notification to initiator
    const initiator = await this.getNotificationMember(context, incidentDetails.createdByUserId);
    if (initiator !== undefined) {
      await initiator.sendAdaptiveCard(approvedCardJson);
    }

    // Update the card for assignee
    return approvedCardJson;
  }

  // @WorkflowStep("rejected")
  async processRejected(context: TurnContext): Promise<any> {
    const action = context.activity.value.action;
    const incidentDetails = action.data;
    const rejectedCardJson = AdaptiveCards.declare(rejectedCard).render(action.data);

    // send notification to initiator
    const initiator = await this.getNotificationMember(context, incidentDetails.createdByUserId);
    if (initiator !== undefined) {
      await initiator.sendAdaptiveCard(rejectedCardJson);
    }

    // Update the card for assignee
    return rejectedCardJson;
  }

  private async getAssignees(context: TurnContext): Promise<AssignToMember[]> {
    let continuationToken: string | undefined;
    const allMembers: TeamsChannelAccount[] = [];

    do {     
      const pagedMembers = await TeamsInfo.getPagedTeamMembers(context, this.teamId, undefined, continuationToken);
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

  private async getNotificationMember(context: TurnContext, userId: string): Promise<Member> {
    for (const target of await teamsBot.notification.installations()) {
      if (target.type === "Channel") {
        const members = await target.members();
        for (const member of members) {
          if (member.account.id === userId) {
            return member;
          }
        }
      }
    }

    return undefined;
  }
}

export const incidentReportingCommand = new IncidentReportingWorkflow();