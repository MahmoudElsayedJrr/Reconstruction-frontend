const API_URL = "http://localhost:3000/";

//  "https://work-backend-production.up.railway.app/"
// http://localhost:3000/

const permissions = {
  admin: [
    // البيانات الأساسية - التخطيط والمتابعة
    "activityName",
    "executingCompany",
    "fundingType",
    "projectCategory",
    "consultant",
    "governorate",
    "activityDescription",
    "estimatedValue",
    "contractualValue",
    "completionDate",
    "receptionDate",

    // التنفيذية
    "status",
    "progress",
    "executivePosition",
    "projectLocationLink",
    "mediaFiles",

    // المالية
    "disbursedAmount",

    // المشروعات
    "petroleumCompany",
    "bitumenQuantity",
    "mc",
    "rc",
    "remainingQuantitiesTons",
    "notes",

    // التعاقدية
    "publishDate",
    "technicalDecisionDate",
    "financialDecisionDate",
    "assignmentOrderDate",
    "siteHandoverDate",
    "contractualDocuments",

    // تواريخ إضافية
    "extensionDate",
    "suspensionDate",
    "resumptionDate",

    // المودالات
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
  ],

  manager: [
    // التخطيط والمتابعة فقط
    "activityName",
    "executingCompany",
    "governorate",
    "projectCategory",
    "fundingType",
    "consultant",
    "activityDescription",
    "estimatedValue",
    "contractualValue",
    "completionDate",
    "receptionDate",
  ],

  executive: [
    // التنفيذية فقط
    "status",
    "progress",
    "executivePosition",
    "projectLocationLink",
    "mediaFiles",
  ],

  financial: ["disbursedAmount", "extractDate", "extractValue", "extractPDFs"],

  projectManager: [
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
    // التعاقدية فقط
    "publishDate",
    "technicalDecisionDate",
    "financialDecisionDate",
    "assignmentOrderDate",
    "siteHandoverDate",
    "contractualDocuments",
  ],

  employee: [],
};
