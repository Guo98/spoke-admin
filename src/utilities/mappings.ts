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
};

export { imageMapping, orgMapping };
