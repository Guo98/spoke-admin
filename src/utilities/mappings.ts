export interface ImageMapping {
  'Lenovo ThinkPad X1 14" (Gen 9)': string;
  'MacBook Pro 16", 32 GB, 512 SSD': string;
}

const imageMapping: ImageMapping = {
  'Lenovo ThinkPad X1 14" (Gen 9)':
    "https://spokeimages.blob.core.windows.net/image/lenovox1.jpeg",
  'MacBook Pro 16", 32 GB, 512 SSD':
    "https://spokeimages.blob.core.windows.net/image/macbook16.jpeg",
};

const orgMapping: any = {
  org_CxAEPTJ4kpVvkZ8G: "public",
  org_2cr6d5b5cEsEEtsR: "public",
  org_wKzXsiuvUtF28Nm4: "spokeops",
  org_Ms31qwXGU58tAR0T: "spokeops",
  org_xtUPkRs5hJYlIXSj: "FLYR",
  org_BMQjF5J2inNZ8PoQ: "FLYR",
  org_cTljsU08cE8ECjBp: "Bowery",
  org_ZQAwXjMDnevrYYIr: "NurseDash",
  org_gaFIEnwpsXXm8z0D: "Intersect Power",
  org_mwy5eCy2IyrXOY1E: "Hidden Road",
  org_qDm7WkSvmptg3jT1: "Hidden Road",
  org_sYEKDqL5lHPLnJ8e: "Automox",
  org_H63xrX3lAC7uphzb: "Alma",
  org_cf0BFkW7yuXi9lTo: "Flo Health",
  org_BmAU8UUBYjVbRMDD: "Flo Health",
  org_lgsM9ZWjP1GdrDoA: "Roivant",
  org_f0OJSheWDop7RPuc: "Sona",
};

const roleMapping: any = {
  "flyr-eu": "FLYR EU",
  "flyr-poland": "FLYR Poland",
  "flyr-usa": "FLYR USA",
  "pribas-eu": "Pribas EU",
};

const deviceLocationMappings: any = {
  USA: [
    "United States",
    "Georgia, USA",
    "Nevada, USA",
    "Las Vegas, USA",
    "USA",
    "US",
  ],
  POL: ["Poland", "Gdańsk, Poland"],
  PL: ["Poland", "Gdańsk, Poland"],
  NLD: ["Netherlands", "Maastricht, Netherlands"],
  NL: ["Netherlands", "Maastricht, Netherlands"],
  DEU: ["Netherlands", "Maastricht, Netherlands"],
  US: [
    "United States",
    "Georgia, USA",
    "Nevada, USA",
    "Las Vegas, USA",
    "USA",
    "US",
  ],
};

const locationMappings: any = {
  "Georgia, USA": "the USA",
  USA: "the USA",
  Poland: "Poland",
  Netherlands: "the EU",
  "Las Vegas, USA": "the USA",
  "Nevada, USA": "the USA",
};

const countryMappings: any = {
  "United States": ["us", "usa", "united states", "united states of america"],
  Singapore: ["singapore", "sg", "sgp"],
  Brazil: ["brazil", "br", "bra"],
  "United Kingdom": [
    "gb-eng",
    "gb-nir",
    "gb-sct",
    "gb-wls",
    "gb",
    "gbr",
    "united kingdom",
  ],
  Netherlands: ["nl", "nld", "netherlands"],
  Lithuania: ["lt", "ltu", "lithuania"],
};

const navMappings: any = {
  "Intersect Power": ["Orders", "Storefront"],
  "Flo Health": ["Orders", "Inventory", "Storefront", "Marketplace", "Invite"],
  public: [
    "Orders",
    "Inventory",
    "Storefront",
    "Marketplace",
    "Approvals",
    "Invite",
  ],
  "Hidden Road": [
    "Orders",
    "Inventory",
    "Storefront",
    "Marketplace",
    "Approvals",
  ],
  Bowery: ["Orders", "Inventory", "Storefront", "Marketplace", "Approvals"],
  NurseDash: ["Orders", "Inventory", "Storefront"],
  Alma: ["Orders", "Inventory", "Marketplace", "Approvals"],
  Automox: [
    "Orders",
    "Inventory",
    "Storefront",
    "Marketplace",
    "Approvals",
    "Invite",
  ],
  spokeops: [
    "Orders",
    "Inventory",
    "NewInventory",
    "Storefront",
    "Marketplace",
    "Approvals",
    "Invite",
    "Misc",
  ],
  FLYR: ["Orders", "Inventory", "Storefront"],
  Roivant: {
    admin: [
      "Orders",
      "Inventory",
      "Storefront",
      "Marketplace",
      "Approvals",
      "Invite",
    ],
    manager: ["Invite", "Storefront"],
  },
  Sona: ["Orders", "Inventory", "Marketplace", "Approvals"],
};

const clientsList = [
  "Alma",
  "Automox",
  "Bowery",
  "Flo Health",
  "FLYR",
  "Hidden Road",
  "Intersect Power",
  "NurseDash",
  "Roivant",
  "Sona",
  "public",
];

const clientRoles: any = {
  "Flo Health": [
    "Admin",
    "Flo Health Lithuania Employee",
    "Flo Health Netherlands Employee",
    "Flo Health UK Employee",
  ],
  FLYR: ["Admin", "FLYR EU", "FLYR Poland", "FLYR USA", "Pribas EU"],
  Automox: ["Admin", "Technical", "Non-technical", "Approved Buyers"],
  Roivant: ["Admin", "Hiring Manager", "New Hire (Windows)", "New Hire (Mac)"],
  public: ["Admin", "Technical", "Non-technical"],
};

const clientRolesCode: any = {
  Admin: "admin",
  "Flo Health Lithuania Employee": "flo-lt-emp",
  "Flo Health UK Employee": "flo-uk-emp",
  "Flo Health Netherlands Employee": "flo-nl-emp",
  "FLYR EU": "flyr-eu",
  "FLYR Poland": "flyr-poland",
  "FLYR USA": "flyr-usa",
  "Pribas EU": "pribas-eu",
  Technical: "technical",
  "Non-technical": "nontechnical",
  "Approved Buyers": "approvedbuyers",
  "New Hire (Windows)": "windows",
  "New Hire (Mac)": "mac",
  "Hiring Manager": "manager",
};

const connectionMappings: any = {
  Alma: ["Google", "Username Password"],
  Automox: ["Google", "Username Password"],
  Bowery: ["Google", "Username Password"],
  "Flo Health": ["Username Password"],
  FLYR: ["Google", "Username Password"],
  "Hidden Road": ["Google", "Username Password"],
  "Intersect Power": ["Username Password"],
  NurseDash: ["Google", "Username Password"],
  Roivant: ["Microsoft", "Google", "Username Password"],
  Sona: ["Google", "Username Password"],
  public: ["Google", "Microsoft", "Username Password"],
};

export {
  imageMapping,
  orgMapping,
  roleMapping,
  deviceLocationMappings,
  locationMappings,
  countryMappings,
  navMappings,
  clientsList,
  clientRoles,
  clientRolesCode,
  connectionMappings,
};
