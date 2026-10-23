/** Curated Unsplash interiors / exteriors for mock listings (800×600). */
export function photo(id: string): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&h=600&q=80`;
}

export const photos = {
  // Living / salon
  livingWarm: "photo-1502672260266-1c1ef2d93688",
  livingModern: "photo-1560448204-e02f11c3d0e2",
  livingBright: "photo-1522708323590-d24dbb6b0267",
  livingLoft: "photo-1493809842364-78817add7ffb",
  livingLuxury: "photo-1600210492486-724fe5c67fb0",
  livingSofa: "photo-1586023492125-27b2c045efd7",
  livingOpen: "photo-1600607687644-c7171b42498f",
  livingCity: "photo-1600585154340-be6161a56a0c",

  // Bedroom / chambre
  bedroomSoft: "photo-1616594039964-ae9021a400a0",
  bedroomModern: "photo-1595526114035-0d45ed16cfbf",
  bedroomLight: "photo-1505693416388-ac5ce068fe85",
  bedroomHotel: "photo-1540518614846-7eded433c457",
  bedroomCozy: "photo-1631049307264-da0ec9d70304",
  bedroomMinimal: "photo-1618221195710-dd6b41faaea6",

  // Kitchen / cuisine
  kitchenWhite: "photo-1556912173-46c336c7fd55",
  kitchenWood: "photo-1556909114-f6e7ad7d3136",
  kitchenModern: "photo-1600489000022-c2086d79f9d4",
  kitchenIsland: "photo-1600566753190-17f0baa2a6c3",

  // Bathroom
  bathMarble: "photo-1552321554-5fefe8c9ef14",
  bathModern: "photo-1620626011761-996317b8d101",
  bathSpa: "photo-1600566753086-00f18fb6b3ea",

  // Studio
  studioLoft: "photo-1536376072261-38c75010e6c9",
  studioBed: "photo-1522771739844-6a9f6d5f14af",

  // House / villa exterior
  villaModern: "photo-1613490493576-7fde63acd811",
  villaPool: "photo-1600607687939-ce8a6c25118c",
  houseGarden: "photo-1600585154526-990dced4db0d",
  houseSuburban: "photo-1564013799919-ab600027ffc6",
  houseNight: "photo-1600596542815-ffad4c1539a9",
  houseFacade: "photo-1570129477492-45c003edd2be",
  houseFamily: "photo-1605276374104-dee2a0ed3cd6",

  // Building
  buildingApt: "photo-1545324418-cc1a3fa10c00",
  buildingTower: "photo-1486406146926-c627a92ad1ab",

  // Land / terrain
  landField: "photo-1500382017468-9049fed747ef",
  landPlot: "photo-1628624747186-a941c476b7ef",

  // Vehicles
  suvWhite: "photo-1519641471654-76ce0107ad1b",
  suvInterior: "photo-1503376780353-7e6692767b70",
  mercedesSuv: "photo-1618843479313-40f8afb4b4d8",
  suvDark: "photo-1511919884226-fd3cad34687c",
  crossoverBlue: "photo-1606664515524-ed2f786a0bd6",
  pickup: "photo-1533473359331-0135ef1b58bf",
} as const;
