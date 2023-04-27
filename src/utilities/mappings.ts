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
};

const roleMapping: any = {
  "flyr-eu": "FLYR EU",
  "flyr-poland": "FLYR Poland",
  "flyr-usa": "FLYR USA",
  "pribas-eu": "Pribas EU",
};

const deviceLocationMappings: any = {
  USA: "Georgia, USA",
  POL: "Poland",
  NLD: "Netherlands",
  DEU: "Netherlands",
};

const locationMappings: any = {
  "Georgia, USA": "the USA",
  Poland: "Poland",
  Netherlands: "the EU",
};

const countryMappings: any = {
  "United States": ["us", "usa", "united states", "united states of america"],
  Singapore: ["singapore", "sg", "sgp"],
  Brazil: ["brazil", "br", "bra"],
};

export {
  imageMapping,
  orgMapping,
  roleMapping,
  deviceLocationMappings,
  locationMappings,
  countryMappings,
};
