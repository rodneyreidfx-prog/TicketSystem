export type Zone = 
  | "Men's Locker Room"
  | "Women's Locker Room"
  | 'Yoga Room (GGX)'
  | 'Cycle Studio'
  | 'Turf Room'
  | 'Pool'
  | 'Sauna'
  | 'Free Weights'
  | 'Machines'
  | 'Cardio'
  | 'Other';

export type IssueType = 
  | 'Needs Cleaning' 
  | 'Spill' 
  | 'Empty Supplies' 
  | 'Out of Order' 
  | 'Clogged / Maintenance'
  | 'Restock or Empty'
  | 'Not Functioning / Working'
  | 'Other';

export type Urgency = 'No Rush' | 'Needs Attention' | 'Urgent';

export interface TicketPayload {
  zone: Zone | '';
  subArea: string;
  issueType: IssueType | '';
  urgency: Urgency;
  notes: string;
  supplyDetails: string[];
  photoBase64: string | null;
}

