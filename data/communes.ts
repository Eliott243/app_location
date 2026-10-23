export interface Commune {
  name: string;
  lat: number;
  lng: number;
}

export const communes: Commune[] = [
  { name: "Gombe",        lat: -4.3005, lng: 15.3095 },
  { name: "Ngaliema",     lat: -4.3200, lng: 15.2700 },
  { name: "Limete",       lat: -4.3400, lng: 15.3700 },
  { name: "Lemba",        lat: -4.3750, lng: 15.3600 },
  { name: "Kintambo",     lat: -4.3250, lng: 15.2900 },
  { name: "Bandalungwa",  lat: -4.3350, lng: 15.3050 },
  { name: "Kalamu",       lat: -4.3450, lng: 15.3200 },
  { name: "Lingwala",     lat: -4.3100, lng: 15.3000 },
  { name: "Barumbu",      lat: -4.3150, lng: 15.3150 },
  { name: "Masina",       lat: -4.3550, lng: 15.4200 },
  { name: "Ndjili",       lat: -4.3850, lng: 15.4000 },
  { name: "Mont-Ngafula", lat: -4.4300, lng: 15.2800 },
  { name: "Binza",        lat: -4.3500, lng: 15.2600 },
];

export const communeNames = communes.map((c) => c.name);
