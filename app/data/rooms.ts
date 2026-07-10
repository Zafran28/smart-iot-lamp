export interface Room {
  id: string;
  name: string;
  ip: string;
  devices: string[];
}

export const rooms: Room[] = [
  {
    id: "ruang-tamu",
    name: "Ruang Tamu",
    ip: "192.168.1.22",
    devices: ["Lampu 1", "Lampu 2", "TV", "Kipas", "AC", "Stop Kontak"],
  },
  {
    id: "kamar",
    name: "Kamar",
    ip: "192.168.1.23",
    devices: ["Lampu", "Kipas", "AC", "Stop Kontak", "", ""],
  },
];