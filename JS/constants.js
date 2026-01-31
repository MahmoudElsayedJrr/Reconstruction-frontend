const API_URL = "http://81.10.47.76:4000/";

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
<<<<<<< HEAD

function formatMoneyAdvanced(num, currency = "ج.م") {
  num = num * 1000000;
  if (num === 0) return `0 ${currency}`;

  const isNegative = num < 0;
  num = Math.abs(num);

  const units = [
    { value: 1e12, singular: "تريليون ج.م", plural: "تريليون ج.م" },
    { value: 1e9, singular: "مليار ج.م", plural: "مليار ج.م" },
    { value: 1e6, singular: "مليون ج.م", plural: "مليون ج.م" },
    { value: 1e3, singular: "ألف ج.م", plural: "آلاف ج.م" },
    { value: 1, singular: "ج.م", plural: "ج.م" },
  ];

  for (const unit of units) {
    if (num >= unit.value) {
      const value = num / unit.value;

      let formatted;
      if (value % 1 === 0) {
        formatted = value.toLocaleString("ar-EG");
      } else {
        formatted = value
          .toFixed(2)
          .replace(/\.?0+$/, "")
          .replace(".", "٫");
      }

      const label = value > 10 ? unit.plural : unit.singular;

      return `${isNegative ? "-" : ""}${formatted} ${label}`;
    }
  }

  return `${num} ${currency}`;
}
=======
>>>>>>> e6d17170d9a2d7220538db812d28f6816ca2a184
