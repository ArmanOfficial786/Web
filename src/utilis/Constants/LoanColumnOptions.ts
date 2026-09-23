export interface LoanColumnOption {
  key: string;
  label: string;
}

export const LOAN_COLUMN_OPTIONS: LoanColumnOption[] = [
  // Group 1
  { key: "memberId", label: "Member Id" },
  { key: "citizenShipIssFrom", label: "CitizenShip Iss From" },
  { key: "loanType", label: "Loan Type" },
  { key: "revODBal", label: "Rev OD Bal" },
  { key: "prinPaid", label: "Prin Paid" },
  { key: "currInterest", label: "Curr Interest" },
  { key: "instAmt", label: "Inst Amt" },
  { key: "status", label: "Status" },
  // Group 2
  { key: "memberName", label: "Member Name" },
  { key: "accountNo", label: "Account No" },
  { key: "intRate", label: "Int Rate" },
  { key: "issueType", label: "Issue Type" },
  { key: "intPayDate", label: "Int Pay Date" },
  { key: "currPenalty", label: "Curr Penalty" },
  { key: "priDefaulter", label: "Pri Defaulter" },
  { key: "analysisStatus", label: "Analysis Status" },
  // Group 3
  { key: "temAddress", label: "Tem Address" },
  { key: "type", label: "Type" },
  { key: "issueDate", label: "Issue Date" },
  { key: "sanAmount", label: "San Amount" },
  { key: "loanCategory", label: "Loan Category" },
  { key: "prevInterest", label: "Prev Interest" },
  { key: "intDefaulter", label: "Int Defaulter" },
  { key: "totalInterest", label: "Total Interest" },
  // Group 4
  { key: "mobileNo", label: "Mobile No" },
  { key: "period", label: "Period" },
  { key: "matDate", label: "Mat Date" },
  { key: "issueAmt", label: "Issue Amt" },
  { key: "pntPayDate", label: "Pnt Pay date" },
  { key: "prevPenalty", label: "Prev Penalty" },
  { key: "totDefaulter", label: "Tot Defaulter" },
  { key: "totalPenalty", label: "Total Penalty" },
  // Group 5
  { key: "contactNo", label: "Contact No" },
  { key: "instType", label: "Inst Type" },
  { key: "normalOD", label: "NormalOD" },
  { key: "intPaid", label: "Int Paid" },
  { key: "rePrincipal", label: "Re Principal" },
  { key: "totalDue", label: "Total Due" },
  { key: "instCon", label: "Inst Con" },
  // Group 6
  { key: "citizenshipNo", label: "Citizenship No" },
  { key: "loanCategory2", label: "Loan Category" },
  { key: "odSanAmt", label: "OD San Amt" },
  { key: "penPaid", label: "Pen paid" },
  { key: "defPrincipal", label: "Def Principal" },
  { key: "totRemaining", label: "Tot Remaining" },
  { key: "provisionAmt", label: "Provision Amt" },
];
