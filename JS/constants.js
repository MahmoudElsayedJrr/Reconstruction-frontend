const API_URL = "http://localhost:3000/";

// http://81.10.47.76:4000/
// http://192.168.0.38:3000/

const permissions = {
  admin: [
    "activityName",
    "executingCompany",
    "fundingType",
    "fundingSource",
    "projectCategory",
    "consultant",
    "governorate",
    "activityDescription",
    "supervisorEngineer",
    "supervisorPhone",
    "estimatedValue",
    "contractualValue",
    "completionDate",
    "receptionDate",
    "status",
    "progress",
    "executivePosition",
    "projectLocationLink",
    "mediaFiles",
    "disbursedAmount",
    "roaddetails",
    "petroleumCompany",
    "bitumenQuantity",
    "mc",
    "rc",
    "remainingQuantitiesTons",
    "notes",
    "publishDate",
    "technicalDecisionDate",
    "financialDecisionDate",
    "assignmentOrderDate",
    "siteHandoverDate",
    "contractualDocuments",
    "extensionDate",
    "suspensionDate",
    "resumptionDate",
    "decisionName",
    "decisionType",
    "decisionUnit",
    "decisionQuantity",
    "decisionPrice",
    "contractDate",
    "contractPrice",
    "extractDate",
    "extractValue",
    "extractPDFs",
    "fiscalYear",
  ],

  manager: [
    "activityName",
    "executingCompany",
    "governorate",
    "projectCategory",
    "fundingType",
    "fundingSource",
    "supervisorEngineer",
    "supervisorPhone",
    "consultant",
    "activityDescription",
    "estimatedValue",
    "contractualValue",
    "completionDate",
    "receptionDate",
    "fiscalYear",
  ],

  executive: [
    "status",
    "progress",
    "executivePosition",
    "projectLocationLink",
    "mediaFiles",
  ],

  financial: ["disbursedAmount", "extractDate", "extractValue", "extractPDFs"],

  projectManager: [
    "roaddetails",
    "petroleumCompany",
    "bitumenQuantity",
    "mc",
    "rc",
    "remainingQuantitiesTons",
    "notes",
    "extensionDate",
    "suspensionDate",
    "resumptionDate",
    "decisionName",
    "decisionType",
    "decisionUnit",
    "decisionQuantity",
    "decisionPrice",
    "contractDate",
    "contractPrice",
  ],

  contractual: [
    "publishDate",
    "technicalDecisionDate",
    "financialDecisionDate",
    "assignmentOrderDate",
    "siteHandoverDate",
    "contractualDocuments",
  ],

  employee: [],
};

function formatMoneyAdvanced(num, currency = "ج.م") {
  if (num === 0) return `٠ ${currency}`;

  const isNegative = num < 0;
  let absoluteNum = Math.abs(num);

  const units = [
    { value: 1e6, label: "تريليون" },
    { value: 1e3, label: "مليار" },
    { value: 1, label: "مليون" },
  ];

  for (const unit of units) {
    if (absoluteNum >= unit.value) {
      const result = absoluteNum / unit.value;

      let formatted = result.toLocaleString("en-us", {
        maximumFractionDigits: 3,
        minimumFractionDigits: 0,
      });

      return `${formatted} ${unit.label} ${currency}${isNegative ? "-" : ""}`;
    }
  }

  let normalValue = (absoluteNum * 1e6).toLocaleString("ar-EG");
  return `${normalValue} ${currency}${isNegative ? "-" : ""}`;
}
