export interface User {
  name: string
  avatar: string
  points: number
}

export interface Comment {
  user: string
  text: string
  timestamp: string
}

export interface Report {
  id: string
  created_at: string
  user: User
  is_anonymous: boolean
  location: {
    lat: number
    lng: number
    address: string
  }
  photo_url: string
  after_photo_url?: string
  description: string
  tags: string[]
  category: string
  upvotes: number
  status: "reported" | "in_progress" | "cleaned"
  comments: Comment[]
  assigned_to?: string
}

export const mockUsers: User[] = [
  { name: "EcoWarrior22", avatar: "/bear.jpg", points: 1250 },
  { name: "GreenGuardian", avatar: "/fish.jpg?height=40&width=40&text=👩‍🔬", points: 980 },
  { name: "CleanupCrew", avatar: "/girl.jpg?height=40&width=40&text=👷‍♀️", points: 875 },
  { name: "EarthDefender", avatar: "/gumball.jpg?height=40&width=40&text=🌱", points: 720 },
  { name: "WasteWatcher", avatar: "/somebody.jpg?height=40&width=40&text=👨‍💼", points: 650 },
]

export const mockReports: Report[] = [
  {
    id: "uuid-1",
    created_at: "2025-08-02T18:45:00Z",
    user: mockUsers[0],
    is_anonymous: false,
    location: { lat: 9.9312, lng: 76.2673, address: "Palarivattom, Kochi" },
    photo_url: "/palarivattom.jpg",
    description:
      "Huge pile of plastic bags dumped near the service road. This has been here for weeks and is attracting stray animals.",
    tags: ["#Kochi", "#Palarivattom", "#PlasticWaste"],
    category: "Plastic Waste",
    upvotes: 127,
    status: "reported",
    comments: [
      { user: "CitizenJane", text: "This is a health hazard! Tagging @KochiMunicipalCorp", timestamp: "2 hours ago" },
      { user: "LocalResident", text: "I walk past this every day. Really needs attention!", timestamp: "1 hour ago" },
    ],
  },
  {
    id: "uuid-2",
    created_at: "2025-08-02T16:30:00Z",
    user: mockUsers[1],
    is_anonymous: false,
    location: { lat: 9.9252, lng: 76.2599, address: "Marine Drive, Kochi" },
    photo_url: "/marine_drive.jpg",
    after_photo_url: "/images/cigarette-butts-after.png",
    description: "Cigarette butts scattered all over the waterfront. Cleaned up during morning jog!",
    tags: ["#MarineDrive", "#Cigarettes", "#Cleaned"],
    category: "Cigarette Butts",
    upvotes: 89,
    status: "cleaned",
    comments: [
      { user: "MorningJogger", text: "Great work! The area looks so much better now", timestamp: "30 minutes ago" },
    ],
  },
  {
    id: "uuid-3",
    created_at: "2025-08-02T14:15:00Z",
    user: { name: "Anonymous", avatar: "/placeholder.svg?height=40&width=40&text=❓", points: 0 },
    is_anonymous: true,
    location: { lat: 9.9816, lng: 76.2999, address: "Kakkanad, Kochi" },
    photo_url: "/kakkanad.jpg",
    description: "Construction waste dumped illegally in residential area. Blocking drainage system.",
    tags: ["#Kakkanad", "#Construction", "#Drainage"],
    category: "Construction Waste",
    upvotes: 156,
    status: "in_progress",
    comments: [
      { user: "ConcernedCitizen", text: "This is causing waterlogging during rains", timestamp: "4 hours ago" },
      { user: "KakkanadMLA", text: "We're looking into this. Thanks for reporting!", timestamp: "2 hours ago" },
    ],
  },
  {
    id: "uuid-4",
    created_at: "2025-08-02T12:00:00Z",
    user: mockUsers[2],
    is_anonymous: false,
    location: { lat: 9.9711, lng: 76.2946, address: "Infopark, Kochi" },
    photo_url: "/infopark.jpg",
    description: "Food waste from nearby restaurants dumped behind office complex. Strong odor and flies.",
    tags: ["#Infopark", "#FoodWaste", "#Restaurant"],
    category: "Organic Waste",
    upvotes: 73,
    status: "reported",
    comments: [
      { user: "OfficeWorker", text: "This smell is unbearable during lunch breaks", timestamp: "6 hours ago" },
    ],
  },
  {
    id: "uuid-5",
    created_at: "2025-08-02T10:30:00Z",
    user: mockUsers[3],
    is_anonymous: false,
    location: { lat: 9.9398, lng: 76.2602, address: "Panampilly Nagar, Kochi" },
    photo_url: "/panampally_nagar.jpg",
    description: "Old electronics and batteries dumped in park area. Potential environmental hazard.",
    tags: ["#PanampillyNagar", "#EWaste", "#Park"],
    category: "Electronic Waste",
    upvotes: 94,
    status: "reported",
    comments: [
      { user: "TechExpert", text: "E-waste needs special disposal. This is dangerous!", timestamp: "8 hours ago" },
    ],
  },
  {
    id: "uuid-6",
    created_at: "2025-08-02T09:15:00Z",
    user: mockUsers[4],
    is_anonymous: false,
    location: { lat: 9.9445, lng: 76.2711, address: "Edappally, Kochi" },
    photo_url: "/edapally.jpg",
    after_photo_url: "/images/plastic-bottles-after.png",
    description: "Overflowing waste bin with plastic bottles and cans scattered around bus stop.",
    tags: ["#Edappally", "#BusStop", "#Recycling"],
    category: "Plastic Waste",
    upvotes: 45,
    status: "cleaned",
    comments: [
      { user: "BusCommuter", text: "Finally! This was such an eyesore", timestamp: "1 hour ago" },
      {
        user: "LocalCouncilor",
        text: "New bins have been installed. Thanks for reporting!",
        timestamp: "45 minutes ago",
      },
    ],
  },
  {
    id: "uuid-7",
    created_at: "2025-08-02T08:00:00Z",
    user: mockUsers[1],
    is_anonymous: false,
    location: { lat: 9.9588, lng: 76.2904, address: "Vytilla, Kochi" },
    photo_url: "/vytilla.jpg",
    description: "Plastic waste floating in the backwater canal near Vytilla junction. Affecting marine life.",
    tags: ["#Vytilla", "#Backwaters", "#MarineLife"],
    category: "Plastic Waste",
    upvotes: 203,
    status: "in_progress",
    comments: [
      { user: "EnvironmentActivist", text: "This is killing our backwater ecosystem!", timestamp: "5 hours ago" },
      { user: "FishermanUnion", text: "We see dead fish because of this pollution", timestamp: "3 hours ago" },
      { user: "CoastalGuard", text: "Cleanup drive scheduled for this weekend", timestamp: "1 hour ago" },
    ],
  },
]

export const categories = [
  "Plastic Waste",
  "Organic Waste",
  "Electronic Waste",
  "Construction Waste",
  "Cigarette Butts",
  "Glass & Metal",
  "Hazardous Waste",
  "Other",
]
