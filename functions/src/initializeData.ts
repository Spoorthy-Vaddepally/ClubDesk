// Import Firebase Admin SDK
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

// Initialize Firebase Admin
const app = initializeApp({
  credential: applicationDefault()
});

const db = getFirestore(app);
const auth = getAuth(app);

// Define types for our data
interface BaseData {
  id?: string; // Make id optional
  [key: string]: any;
}

interface ClubData extends BaseData {
  name: string;
  email: string;
  role: string;
  clubName: string;
  domain: string;
  motto: string;
  description: string;
  establishedYear: string;
  followersCount: number;
  contact: string;
  clubPhone: string;
  clubEmail: string;
  website: string;
  instagram: string;
  linkedin: string;
  logoURL: string;
  bannerURL: string;
}

interface StudentData extends BaseData {
  name: string;
  email: string;
  role: string;
  department: string;
  year: string;
  collegeId: string;
  phone: string;
  bio: string;
  interests: string[];
  skills: string[];
  avatar: string;
}

// Example clubs data
const exampleClubs: ClubData[] = [
  {
    id: "exampleclub1",
    name: "Tech Innovators Club",
    email: "tech@example.com",
    role: "club_head",
    clubName: "Tech Innovators Club",
    domain: "Technology",
    motto: "Innovate, Create, Inspire",
    description: "A club focused on technology innovation, coding workshops, and hackathons.",
    establishedYear: "2020",
    followersCount: 150,
    contact: "techclub@university.edu",
    clubPhone: "+1234567890",
    clubEmail: "techclub@university.edu",
    website: "https://techinnovators.university.edu",
    instagram: "@techinnovators",
    linkedin: "Tech Innovators Club",
    logoURL: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop",
    bannerURL: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=300&fit=crop",
  },
  {
    id: "exampleclub2",
    name: "Art & Culture Society",
    email: "art@example.com",
    role: "club_head",
    clubName: "Art & Culture Society",
    domain: "Cultural",
    motto: "Express, Explore, Experience",
    description: "Promoting arts, culture, and creativity through various events and workshops.",
    establishedYear: "2018",
    followersCount: 120,
    contact: "art@university.edu",
    clubPhone: "+1234567891",
    clubEmail: "art@university.edu",
    website: "https://artculture.university.edu",
    instagram: "@artandculture",
    linkedin: "Art & Culture Society",
    logoURL: "https://images.unsplash.com/photo-1577372066484-3652cd74d215?w=200&h=200&fit=crop",
    bannerURL: "https://images.unsplash.com/photo-1577372066484-3652cd74d215?w=800&h=300&fit=crop",
  },
  {
    id: "exampleclub3",
    name: "Sports Excellence Club",
    email: "sports@example.com",
    role: "club_head",
    clubName: "Sports Excellence Club",
    domain: "Sports",
    motto: "Train, Compete, Excel",
    description: "Dedicated to promoting sports and physical fitness among students.",
    establishedYear: "2019",
    followersCount: 200,
    contact: "sports@university.edu",
    clubPhone: "+1234567892",
    clubEmail: "sports@university.edu",
    website: "https://sportsexcellence.university.edu",
    instagram: "@sportsexcellence",
    linkedin: "Sports Excellence Club",
    logoURL: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=200&h=200&fit=crop",
    bannerURL: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&h=300&fit=crop",
  }
];

// Example students data
const exampleStudents: StudentData[] = [
  {
    id: "student1",
    name: "Alex Johnson",
    email: "alex@student.edu",
    role: "student",
    department: "Computer Science",
    year: "3rd Year",
    collegeId: "CS2023001",
    phone: "+1234500001",
    bio: "Passionate about technology and innovation. Love participating in hackathons.",
    interests: ["Coding", "AI", "Web Development"],
    skills: ["JavaScript", "Python", "React"],
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
  },
  {
    id: "student2",
    name: "Maria Garcia",
    email: "maria@student.edu",
    role: "student",
    department: "Fine Arts",
    year: "2nd Year",
    collegeId: "FA2023002",
    phone: "+1234500002",
    bio: "Artist and designer with a passion for creative expression.",
    interests: ["Painting", "Digital Art", "Photography"],
    skills: ["Adobe Photoshop", "Illustrator", "Drawing"],
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop"
  },
  {
    id: "student3",
    name: "James Wilson",
    email: "james@student.edu",
    role: "student",
    department: "Physical Education",
    year: "4th Year",
    collegeId: "PE2023003",
    phone: "+1234500003",
    bio: "Sports enthusiast and team captain. Always ready for new challenges.",
    interests: ["Basketball", "Swimming", "Fitness"],
    skills: ["Team Leadership", "Coaching", "Athletics"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
  }
];

// Function to initialize sample data
export const initializeSampleData = async () => {
  try {
    console.log("Initializing sample data...");
    
    // Clear existing clubs
    console.log("Clearing existing clubs...");
    const clubsSnapshot = await db.collection("clubs").get();
    const clubDeletePromises = [];
    for (const doc of clubsSnapshot.docs) {
      clubDeletePromises.push(doc.ref.delete());
    }
    await Promise.all(clubDeletePromises);
    
    // Clear existing users
    console.log("Clearing existing users...");
    const usersSnapshot = await db.collection("users").get();
    const userDeletePromises = [];
    for (const doc of usersSnapshot.docs) {
      userDeletePromises.push(doc.ref.delete());
    }
    await Promise.all(userDeletePromises);
    
    // Create example clubs
    console.log("Creating example clubs...");
    const clubCreatePromises = [];
    for (const club of exampleClubs) {
      const clubId = club.id;
      if (clubId) {
        delete club.id; // Remove id from data as it's used as document ID
        clubCreatePromises.push(db.collection("clubs").doc(clubId).set(club));
        console.log(`Created club: ${club.clubName}`);
      }
    }
    await Promise.all(clubCreatePromises);
    
    // Create example students
    console.log("Creating example students...");
    const studentCreatePromises = [];
    for (const student of exampleStudents) {
      const studentId = student.id;
      if (studentId) {
        delete student.id; // Remove id from data as it's used as document ID
        studentCreatePromises.push(db.collection("users").doc(studentId).set(student));
        console.log(`Created student: ${student.name}`);
      }
    }
    await Promise.all(studentCreatePromises);
    
    console.log("Sample data initialization completed!");
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
};

// Function to clear all data
export const clearAllData = async () => {
  try {
    console.log("Clearing all data...");
    
    // Clear clubs
    const clubsSnapshot = await db.collection("clubs").get();
    const clubDeletePromises = [];
    for (const doc of clubsSnapshot.docs) {
      clubDeletePromises.push(doc.ref.delete());
    }
    await Promise.all(clubDeletePromises);
    
    // Clear users
    const usersSnapshot = await db.collection("users").get();
    const userDeletePromises = [];
    for (const doc of usersSnapshot.docs) {
      userDeletePromises.push(doc.ref.delete());
    }
    await Promise.all(userDeletePromises);
    
    // Clear events
    const eventsSnapshot = await db.collection("events").get();
    const eventDeletePromises = [];
    for (const doc of eventsSnapshot.docs) {
      eventDeletePromises.push(doc.ref.delete());
    }
    await Promise.all(eventDeletePromises);
    
    // Delete all authentication users
    console.log("Deleting all authentication users...");
    const users = await auth.listUsers();
    const uids = users.users.map(user => user.uid);
    
    // Delete users in batches of 1000 (Firebase limit)
    for (let i = 0; i < uids.length; i += 1000) {
      const batch = uids.slice(i, i + 1000);
      await auth.deleteUsers(batch);
    }
    
    console.log("All data and users cleared!");
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};