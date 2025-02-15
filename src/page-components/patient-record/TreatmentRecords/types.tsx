export type treatmentRecord = {
  _id: any;
  patient_id: string;
  chart_id: string;
  chart_name: string;
  doctor_id: string;
  doctor_name: string;
  branch: string;
  branch_name: string;
  surface: string;
  quantity: string;
  procedure_id: string;
  procedure_name: string;
  tooth_no: string;
  amount: string;
  remarks: string;
  created_at: string;
  updated_at: string;
  status: string;
};

export type Invoice = {
  _id: string;
  patient_id: string;
  invoice_no: string;
  chart_id: string;
  doctor_id: string;
  branch_id: string;
  notes: string;
  total: number;
  vat: number;
  balance: number;
  discount: number;
  total_amount: number;
  procedure_name: string;
  updated_at: string;
  created_at: string;
  status: String;
  paid_amount: number;
};

export type payment = {
  _id: string;
  branch: string;
  procedure: string;
  mode_of_payment: string;
  payment_amount: number;
  remarks: string;
  credits: number;
};

export type SelectedTreatment = {
  amount: number;
  procedure_name: string;
  quantity: number;
  treatment_id: any;
};

export type SelectedBilling = {
  id: string;
  balance: number;
  procedure_name: string;
  paid_amount: number;
  charge: number;
};

export type SelectedPayment = {
  _id: string;
  payment_amount: number;
  procedure: string;
  branch: string;
};
