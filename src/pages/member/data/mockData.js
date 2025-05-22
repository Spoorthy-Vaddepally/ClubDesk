export const mockStudentData = {
  studentInfo: {
    id: 'student-001',
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    profileImage: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=800',
    university: 'University of Technology',
    department: 'Computer Science',
    year: 3,
    interests: ['Programming', 'AI', 'Music', 'Photography', 'Sports']
  },
  
  trendingClubs: [
    {
      id: 'club-001',
      name: 'Tech Innovators',
      description: 'A club for technology enthusiasts and future innovators',
      coverImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      logo: 'https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=800',
      memberCount: 245,
      category: 'Technology',
      tags: ['coding', 'innovation', 'artificial intelligence'],
      followersCount: 385,
      isFollowing: true
    },
    {
      id: 'club-002',
      name: 'Creative Arts Society',
      description: 'Express yourself through various art forms',
      coverImage: 'https://images.pexels.com/photos/6474475/pexels-photo-6474475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      logo: 'https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg?auto=compress&cs=tinysrgb&w=800',
      memberCount: 189,
      category: 'Arts',
      tags: ['painting', 'drawing', 'sculpture'],
      followersCount: 210,
      isFollowing: false
    },
    {
      id: 'club-003',
      name: 'Debate Club',
      description: 'Sharpen your public speaking and argumentation skills',
      coverImage: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      logo: 'https://images.pexels.com/photos/5882487/pexels-photo-5882487.jpeg?auto=compress&cs=tinysrgb&w=800',
      memberCount: 120,
      category: 'Academic',
      tags: ['public speaking', 'debate', 'critical thinking'],
      followersCount: 156,
      isFollowing: false
    },
    {
      id: 'club-004',
      name: 'Sports Federation',
      description: 'Join various sports teams and participate in competitions',
      coverImage: 'https://images.pexels.com/photos/3755440/pexels-photo-3755440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      logo: 'https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=800',
      memberCount: 315,
      category: 'Sports',
      tags: ['football', 'basketball', 'volleyball', 'fitness'],
      followersCount: 428,
      isFollowing: true
    },
  ],
  
  followedClubs: [
    {
      id: 'club-001',
      name: 'Tech Innovators',
      description: 'A club for technology enthusiasts and future innovators',
      coverImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      logo: 'https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=800',
      memberCount: 245,
      category: 'Technology',
      tags: ['coding', 'innovation', 'artificial intelligence'],
      followersCount: 385,
      isFollowing: true
    },
    {
      id: 'club-004',
      name: 'Sports Federation',
      description: 'Join various sports teams and participate in competitions',
      coverImage: 'https://images.pexels.com/photos/3755440/pexels-photo-3755440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      logo: 'https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=800',
      memberCount: 315,
      category: 'Sports',
      tags: ['football', 'basketball', 'volleyball', 'fitness'],
      followersCount: 428,
      isFollowing: true
    }
  ],
  
  upcomingEvents: [
    {
      id: 'event-001',
      title: 'Hackathon 2025',
      description: 'A 48-hour coding challenge to build innovative solutions',
      clubId: 'club-001',
      clubName: 'Tech Innovators',
      clubLogo: 'https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=800',
      startDate: '2025-03-15T09:00:00',
      endDate: '2025-03-17T09:00:00',
      location: 'Tech Building, Room 301',
      image: 'https://images.pexels.com/photos/7102/notes-macbook-study-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      attendees: 85,
      isAttending: true,
      status: 'upcoming'
    },
    {
      id: 'event-002',
      title: 'Art Exhibition',
      description: 'Showcasing student artwork from various mediums',
      clubId: 'club-002',
      clubName: 'Creative Arts Society',
      clubLogo: 'https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg?auto=compress&cs=tinysrgb&w=800',
      startDate: '2025-04-05T14:00:00',
      endDate: '2025-04-08T20:00:00',
      location: 'University Gallery',
      image: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      attendees: 124,
      isAttending: false,
      status: 'upcoming'
    },
    {
      id: 'event-003',
      title: 'University Championships',
      description: 'Annual inter-university sports competition',
      clubId: 'club-004',
      clubName: 'Sports Federation',
      clubLogo: 'https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=800',
      startDate: '2025-05-10T08:00:00',
      endDate: '2025-05-12T18:00:00',
      location: 'University Stadium',
      image: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      attendees: 312,
      isAttending: true,
      status: 'upcoming'
    }
  ],
  
  pastEvents: [
    {
      id: 'event-004',
      title: 'Tech Workshop: AI Fundamentals',
      description: 'Introduction to artificial intelligence concepts and applications',
      clubId: 'club-001',
      clubName: 'Tech Innovators',
      clubLogo: 'https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=800',
      startDate: '2025-01-20T13:00:00',
      endDate: '2025-01-20T16:00:00',
      location: 'Innovation Lab',
      image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      attendees: 57,
      isAttending: true,
      status: 'past',
      certificateAvailable: true
    },
    {
      id: 'event-005',
      title: 'Debate Tournament',
      description: 'Inter-university debate competition on current global issues',
      clubId: 'club-003',
      clubName: 'Debate Club',
      clubLogo: 'https://images.pexels.com/photos/5882487/pexels-photo-5882487.jpeg?auto=compress&cs=tinysrgb&w=800',
      startDate: '2024-12-08T10:00:00',
      endDate: '2024-12-09T17:00:00',
      location: 'Conference Hall',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      attendees: 98,
      isAttending: true,
      status: 'past',
      certificateAvailable: true
    }
  ],
  
  memberships: [
    {
      id: 'membership-001',
      clubId: 'club-001',
      clubName: 'Tech Innovators',
      clubLogo: 'https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=800',
      joinDate: '2024-09-15',
      expiryDate: '2025-09-15',
      status: 'active',
      membershipType: 'Annual',
      membershipFee: 25
    },
    {
      id: 'membership-002',
      clubId: 'club-004',
      clubName: 'Sports Federation',
      clubLogo: 'https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=800',
      joinDate: '2024-10-05',
      expiryDate: '2025-04-05',
      status: 'active',
      membershipType: 'Semester',
      membershipFee: 15
    },
    {
      id: 'membership-003',
      clubId: 'club-003',
      clubName: 'Debate Club',
      clubLogo: 'https://images.pexels.com/photos/5882487/pexels-photo-5882487.jpeg?auto=compress&cs=tinysrgb&w=800',
      joinDate: '2024-08-20',
      expiryDate: '2024-12-20',
      status: 'expired',
      membershipType: 'Semester',
      membershipFee: 10
    }
  ],
  
  certificates: [
    {
      id: 'cert-001',
      eventId: 'event-004',
      eventName: 'Tech Workshop: AI Fundamentals',
      clubId: 'club-001',
      clubName: 'Tech Innovators',
      issueDate: '2025-01-21',
      imageUrl: 'https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=800',
      downloadUrl: '#'
    },
    {
      id: 'cert-002',
      eventId: 'event-005',
      eventName: 'Debate Tournament',
      clubId: 'club-003',
      clubName: 'Debate Club',
      issueDate: '2024-12-10',
      imageUrl: 'https://images.pexels.com/photos/5882487/pexels-photo-5882487.jpeg?auto=compress&cs=tinysrgb&w=800',
      downloadUrl: '#'
    }
  ],
  
  notifications: [
    {
      id: 'notif-001',
      title: 'Upcoming Event',
      message: 'Hackathon 2025 is happening in 3 days. Are you ready?',
      timestamp: '2025-03-12T14:23:00',
      read: false,
      type: 'event',
      link: '/event/event-001',
      image: 'https://images.pexels.com/photos/7102/notes-macbook-study-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'notif-002',
      title: 'Membership Expiring',
      message: 'Your membership with Sports Federation will expire in 15 days',
      timestamp: '2025-03-21T09:15:00',
      read: true,
      type: 'club',
      link: '/memberships'
    },
    {
      id: 'notif-003',
      title: 'Certificate Available',
      message: 'Your certificate for the Tech Workshop is now available',
      timestamp: '2025-01-21T11:30:00',
      read: false,
      type: 'certificate',
      link: '/certificates'
    },
    {
      id: 'notif-004',
      title: 'Payment Confirmation',
      message: 'Payment of $25 for Tech Innovators membership was successful',
      timestamp: '2024-09-15T16:45:00',
      read: true,
      type: 'payment'
    }
  ],
  
  allClubs: [
    {
      id: 'club-001',
      name: 'Tech Innovators',
      description: 'A club for technology enthusiasts and future innovators',
      coverImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      logo: 'https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=800',
      memberCount: 245,
      category: 'Technology',
      tags: ['coding', 'innovation', 'artificial intelligence'],
      followersCount: 385,
      isFollowing: true
    },
    {
      id: 'club-002',
      name: 'Creative Arts Society',
      description: 'Express yourself through various art forms',
      coverImage: 'https://images.pexels.com/photos/6474475/pexels-photo-6474475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      logo: 'https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg?auto=compress&cs=tinysrgb&w=800',
      memberCount: 189,
      category: 'Arts',
      tags: ['painting', 'drawing', 'sculpture'],
      followersCount: 210,
      isFollowing: false
    },
    {
      id: 'club-003',
      name: 'Debate Club',
      description: 'Sharpen your public speaking and argumentation skills',
      coverImage: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      logo: 'https://images.pexels.com/photos/5882487/pexels-photo-5882487.jpeg?auto=compress&cs=tinysrgb&w=800',
      memberCount: 120,
      category: 'Academic',
      tags: ['public speaking', 'debate', 'critical thinking'],
      followersCount: 156,
      isFollowing: false
    },
    {
      id: 'club-004',
      name: 'Sports Federation',
      description: 'Join various sports teams and participate in competitions',
      coverImage: 'https://images.pexels.com/photos/3755440/pexels-photo-3755440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      logo: 'https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=800',
      memberCount: 315,
      category: 'Sports',
      tags: ['football', 'basketball', 'volleyball', 'fitness'],
      followersCount: 428,
      isFollowing: true
    },
    {
      id: 'club-005',
      name: 'Entrepreneurship Society',
      description: 'Develop your business acumen and entrepreneurial mindset',
      coverImage: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      logo: 'https://images.pexels.com/photos/4386371/pexels-photo-4386371.jpeg?auto=compress&cs=tinysrgb&w=800',
      memberCount: 178,
      category: 'Business',
      tags: ['entrepreneurship', 'startups', 'innovation'],
      followersCount: 235,
      isFollowing: false
    },
    {
      id: 'club-006',
      name: 'Photography Club',
      description: 'Capture moments and improve your photography skills',
      coverImage: 'https://images.pexels.com/photos/1261731/pexels-photo-1261731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      logo: 'https://images.pexels.com/photos/1422220/pexels-photo-1422220.jpeg?auto=compress&cs=tinysrgb&w=800',
      memberCount: 95,
      category: 'Arts',
      tags: ['photography', 'editing', 'visual arts'],
      followersCount: 142,
      isFollowing: false
    },
    {
      id: 'club-007',
      name: 'Science Society',
      description: 'Explore scientific discoveries and conduct experiments',
      coverImage: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      logo: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800',
      memberCount: 165,
      category: 'Academic',
      tags: ['science', 'research', 'experiments'],
      followersCount: 190,
      isFollowing: false
    },
    {
      id: 'club-008',
      name: 'Music Ensemble',
      description: 'Perform in various musical genres and events',
      coverImage: 'https://images.pexels.com/photos/167491/pexels-photo-167491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      logo: 'https://images.pexels.com/photos/4087991/pexels-photo-4087991.jpeg?auto=compress&cs=tinysrgb&w=800',
      memberCount: 110,
      category: 'Arts',
      tags: ['music', 'performance', 'instruments'],
      followersCount: 186,
      isFollowing: false
    }
  ]
};