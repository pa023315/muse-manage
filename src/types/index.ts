export type ID = string;

export type Role = 'Owner' | 'Manager' | 'Member' | 'Contractor';
export type StatusInquiry = 'new' | 'declined' | 'quoted';
export type StatusQuote = 'draft' | 'sent' | 'viewed' | 'signed' | 'void';
export type StatusProject = 'active' | 'done' | 'archived';
export type StatusInvoice = 'unpaid' | 'partial' | 'paid' | 'void';

export interface Customer {
  id: ID;
  kind: 'company' | 'person';
  name: string;
  taxId?: string;
  contacts: { name: string; email: string; phone?: string }[];
  tags: string[];
  source?: string;
  note?: string;
  createdAt: string;
}

export interface Inquiry {
  id: ID;
  form_id?: string;
  name: string;
  organization_type?: 'individual' | 'studio' | 'company';
  character_type?: string;
  commission_items?: string[];
  usage_purpose?: string[];
  reference_description?: string;
  image_specifications?: string;
  special_requirements?: string;
  deadline_date?: string;
  publish_date?: string;
  design_notes?: string;
  budget?: string;
  budget_range?: string;
  status: StatusInquiry;
  source?: string;
  created_at: string;
  updated_at?: string;
}

export interface QuoteItem {
  skuId?: ID;
  desc: string;
  qty: number;
  unitPrice: number;
  discount?: number;
}

export interface PaymentPlan {
  title: string;
  percent: number;
}

export interface Quote {
  id: ID;
  no: string;
  customerId: ID;
  projectTitle: string;
  items: QuoteItem[];
  taxMode: 'tax_included' | 'tax_excluded';
  paymentPlan?: PaymentPlan[];
  status: StatusQuote;
  signUrl?: string;
  signedAt?: string;
  validUntil?: string;
  pdfUrl?: string;
  createdAt: string;
}

export interface Project {
  id: ID;
  no: string;
  customerId: ID;
  name: string;
  ownerId: ID;
  memberIds: ID[];
  startDate?: string;
  dueDate?: string;
  status: StatusProject;
  contractLink?: string;
  deliverableLinks?: string[];
  amounts: { quoted: number; invoiced: number; received: number };
}

export interface Invoice {
  id: ID;
  no: string;
  projectId: ID;
  quoteId?: ID;
  milestoneTitle?: string;
  amount: number;
  tax?: number;
  dueDate?: string;
  receivedAmount?: number;
  receivedDate?: string;
  status: StatusInvoice;
  payMethod?: string;
  note?: string;
}

export interface Expense {
  id: ID;
  no: string;
  vendorId: ID;
  projectId?: ID;
  category: string;
  amount: number;
  tax?: number;
  receiptLink?: string;
  paidAt?: string;
  note?: string;
}

export interface Vendor {
  id: ID;
  name: string;
  category?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  isFavorite?: boolean;
  contacts?: { name: string; email?: string; phone?: string }[];
  note?: string;
}

export interface InventoryProduct {
  id: ID;
  sku: string;
  name: string;
  specs?: Record<string, string>;
  price?: number;
  cost?: number;
  stockQty: number;
  serialsEnabled: boolean;
  serials?: string[];
}

export interface Event {
  id: ID;
  title: string;
  start: string;
  end?: string;
  location?: string;
  externalRegUrl?: string;
  reminders?: { emailAt?: string; dashboardAt?: string }[];
  calendarLinks?: { ics?: string; gcal?: string };
}

export interface User {
  id: ID;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  lastLogin?: string;
}

export interface AuditLog {
  id: ID;
  actorId: ID;
  entity: string;
  entityId: ID;
  action: string;
  before?: unknown;
  after?: unknown;
  at: string;
  ip?: string;
}

export interface DashboardKPI {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  unpaidRevenue: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}