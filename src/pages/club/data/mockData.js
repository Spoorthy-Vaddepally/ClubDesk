// Mock data for club management dashboard

export const mockClubData = {
  clubInfo: {
    name: "Innovation Tech Club",
    established: "2022-01-15",
    mission: "To foster innovation and technology skills among students",
    totalMembers: 85,
    activeMembers: 72,
    fundingBalance: 12500,
    logo: "https://images.pexels.com/photos/957061/milky-way-starry-sky-night-sky-star-957061.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  
  members: [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@example.com",
      joinDate: "2022-01-20",
      role: "President",
      status: "active",
      attendance: 95,
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: "2",
      name: "Jamie Smith",
      email: "jamie@example.com",
      joinDate: "2022-01-25",
      role: "Vice President",
      status: "active",
      attendance: 92,
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: "3",
      name: "Taylor Wilson",
      email: "taylor@example.com",
      joinDate: "2022-02-01",
      role: "Secretary",
      status: "active",
      attendance: 88,
      avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: "4",
      name: "Morgan Lee",
      email: "morgan@example.com",
      joinDate: "2022-02-10",
      role: "Treasurer",
      status: "active",
      attendance: 90,
      avatar: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: "5",
      name: "Casey Brown",
      email: "casey@example.com",
      joinDate: "2022-02-15",
      role: "Member",
      status: "inactive",
      attendance: 45,
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: "6",
      name: "Jordan Miller",
      email: "jordan@example.com",
      joinDate: "2022-03-01",
      role: "Member",
      status: "active",
      attendance: 78,
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: "7",
      name: "Riley Davis",
      email: "riley@example.com",
      joinDate: "2022-03-10",
      role: "Member",
      status: "pending",
      attendance: 0,
      avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ],
  
  events: [
    {
      id: "1",
      title: "Tech Talk: AI Innovations",
      description: "A presentation on the latest AI technologies and their applications.",
      date: "2023-11-15",
      location: "Main Campus, Room 302",
      attendees: 65,
      maxCapacity: 80,
      status: "completed",
      organizer: "Alex Johnson",
      budget: 500,
      imageUrl: "https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=500"
    },
    {
      id: "2",
      title: "Coding Workshop",
      description: "Hands-on workshop for beginners to learn coding fundamentals.",
      date: "2023-12-05",
      location: "Tech Lab, Building B",
      attendees: 40,
      maxCapacity: 50,
      status: "completed",
      organizer: "Jamie Smith",
      budget: 750,
      imageUrl: "https://images.pexels.com/photos/1181373/pexels-photo-1181373.jpeg?auto=compress&cs=tinysrgb&w=500"
    },
    {
      id: "3",
      title: "Hackathon 2024",
      description: "24-hour hackathon to develop innovative solutions to real-world problems.",
      date: "2024-02-20",
      location: "Innovation Hub",
      attendees: 48,
      maxCapacity: 60,
      status: "completed",
      organizer: "Morgan Lee",
      budget: 2000,
      imageUrl: "https://images.pexels.com/photos/7095/people-coffee-notes-tea.jpg?auto=compress&cs=tinysrgb&w=500"
    },
    {
      id: "4",
      title: "Virtual Reality Demo Day",
      description: "Showcase of VR projects developed by club members.",
      date: "2024-03-15",
      location: "Digital Media Center",
      attendees: 55,
      maxCapacity: 70,
      status: "completed",
      organizer: "Taylor Wilson",
      budget: 1200,
      imageUrl: "https://images.pexels.com/photos/8115555/pexels-photo-8115555.jpeg?auto=compress&cs=tinysrgb&w=500"
    },
    {
      id: "5",
      title: "Annual Tech Conference",
      description: "Full-day conference with guest speakers from the tech industry.",
      date: "2024-05-10",
      location: "University Conference Center",
      attendees: 0,
      maxCapacity: 200,
      status: "upcoming",
      organizer: "Alex Johnson",
      budget: 5000,
      imageUrl: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=500"
    }
  ],
  
  membershipDrives: [
    {
      id: "1",
      name: "Fall Recruitment Drive",
      startDate: "2023-09-01",
      endDate: "2023-09-30",
      target: 30,
      achieved: 28,
      status: "completed",
      conversionRate: 70,
      leads: 40
    },
    {
      id: "2",
      name: "Spring Outreach Campaign",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      target: 25,
      achieved: 22,
      status: "completed",
      conversionRate: 55,
      leads: 40
    },
    {
      id: "3",
      name: "Tech Fair Recruitment",
      startDate: "2024-03-10",
      endDate: "2024-03-12",
      target: 15,
      achieved: 18,
      status: "completed",
      conversionRate: 90,
      leads: 20
    },
    {
      id: "4",
      name: "Summer Enrollment Push",
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      target: 20,
      achieved: 0,
      status: "planned",
      conversionRate: 0,
      leads: 0
    }
  ],
  
  awards: [
    {
      id: "1",
      name: "Outstanding Leadership Award",
      description: "Awarded for exceptional leadership in club activities.",
      recipientId: "1",
      recipientName: "Alex Johnson",
      date: "2023-12-15",
      category: "Leadership",
      imageUrl: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: "2",
      name: "Innovation Excellence",
      description: "Recognizing the most innovative project of the year.",
      recipientId: "3",
      recipientName: "Taylor Wilson",
      date: "2023-12-15",
      category: "Innovation",
      imageUrl: "https://images.pexels.com/photos/7063781/pexels-photo-7063781.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: "3",
      name: "Perfect Attendance",
      description: "For attending all club events and meetings throughout the year.",
      recipientId: "2",
      recipientName: "Jamie Smith",
      date: "2023-12-15",
      category: "Participation",
      imageUrl: "https://images.pexels.com/photos/7432538/pexels-photo-7432538.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: "4",
      name: "Best New Member",
      description: "Awarded to the most engaged and promising new member.",
      recipientId: "6",
      recipientName: "Jordan Miller",
      date: "2023-12-15",
      category: "Achievement",
      imageUrl: "https://images.pexels.com/photos/7147720/pexels-photo-7147720.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ],
  
  recentActivities: [
    {
      id: "1",
      type: "event_created",
      description: "Created 'Annual Tech Conference' event",
      date: "2024-03-15T10:30:00",
      user: "Alex Johnson"
    },
    {
      id: "2",
      type: "member_added",
      description: "Added new member: Riley Davis",
      date: "2024-03-10T14:45:00",
      user: "Jamie Smith"
    },
    {
      id: "3",
      type: "award_given",
      description: "Awarded 'Innovation Excellence' to Taylor Wilson",
      date: "2023-12-15T16:20:00",
      user: "Alex Johnson"
    },
    {
      id: "4",
      type: "drive_started",
      description: "Started 'Tech Fair Recruitment' drive",
      date: "2024-03-10T09:15:00",
      user: "Morgan Lee"
    },
    {
      id: "5",
      type: "payment_received",
      description: "Received $500 sponsorship from TechCorp",
      date: "2024-03-05T11:30:00",
      user: "Morgan Lee"
    }
  ],
  
  monthlyStats: [
    {
      month: "Sep 2023",
      members: 60,
      events: 2,
      attendance: 85,
      revenue: 1200
    },
    {
      month: "Oct 2023",
      members: 68,
      events: 3,
      attendance: 78,
      revenue: 1500
    },
    {
      month: "Nov 2023",
      members: 72,
      events: 2,
      attendance: 82,
      revenue: 1300
    },
    {
      month: "Dec 2023",
      members: 75,
      events: 1,
      attendance: 65,
      revenue: 800
    },
    {
      month: "Jan 2024",
      members: 78,
      events: 2,
      attendance: 75,
      revenue: 1400
    },
    {
      month: "Feb 2024",
      members: 82,
      events: 3,
      attendance: 88,
      revenue: 2200
    },
    {
      month: "Mar 2024",
      members: 85,
      events: 2,
      attendance: 92,
      revenue: 1800
    }
  ]
};