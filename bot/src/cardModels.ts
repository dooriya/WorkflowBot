/**
 * Adaptive Card data model. Properties can be referenced in an adaptive card via the `${var}`
 * Adaptive Card syntax.
 */


// This is used to render the choiceSet for assignTo users
export interface AssignToMember {
  title: string,
  value: string
}

// Dynamic data for createIncident card
export interface CreateIncidentData {
  incidentTitle?: string;
  createdByName: string;
  createdByUserId: string;
  assignees: AssignToMember[];
}

export interface IncidentDetails {
  incidentId: string;
  incidentTitle: string;
  createdByName: string;
  createdByUserId: string;
  assignedToUserId: string;
  assignedToName: string;
}
