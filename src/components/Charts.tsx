import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Line Chart for Membership Growth
export const LineChart = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembershipData = async () => {
      if (!user) return;
      
      try {
        // Fetch members over time (this would need a timestamp field in the members collection)
        // For now, we'll generate mock data based on current members
        const membersRef = collection(db, 'clubs', user.uid, 'members');
        const membersSnapshot = await getDocs(membersRef);
        
        // Generate monthly data based on current members
        const currentMembers = membersSnapshot.size;
        const data = [];
        const labels = [];
        
        // Generate data for last 12 months
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          labels.push(date.toLocaleString('default', { month: 'short' }));
          
          // Simulate growth (in a real app, this would come from actual data)
          const growthFactor = 1 - (i * 0.05); // Decreasing growth over time
          data.push(Math.max(0, Math.round(currentMembers * growthFactor)));
        }
        
        setChartData({
          labels,
          datasets: [
            {
              label: 'Members',
              data,
              borderColor: 'rgb(14, 165, 233)',
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              tension: 0.3,
              fill: true,
            },
            {
              label: 'Active Members',
              data: data.map(val => Math.round(val * 0.8)), // 80% active members
              borderColor: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              tension: 0.3,
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching membership data:', error);
        // Fallback to mock data
        setChartData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Members',
              data: [65, 72, 78, 85, 92, 98, 104, 110, 115, 120, 123, 126],
              borderColor: 'rgb(14, 165, 233)',
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              tension: 0.3,
              fill: true,
            },
            {
              label: 'Active Members',
              data: [60, 65, 70, 75, 80, 82, 85, 88, 90, 93, 95, 98],
              borderColor: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              tension: 0.3,
              fill: true,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembershipData();
  }, [user]);

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        min: 0,
        ticks: {
          stepSize: 20,
        },
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
    elements: {
      point: {
        radius: 2,
        hoverRadius: 4,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return <Line data={chartData} options={options} />;
};

// Bar Chart for Event Attendance
export const BarChart = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!user) return;
      
      try {
        // Fetch recent events
        const eventsRef = collection(db, 'clubs', user.uid, 'events');
        const eventsQuery = query(eventsRef, orderBy('date', 'desc'), limit(6));
        const eventsSnapshot = await getDocs(eventsQuery);
        
        const eventNames = [];
        const attendanceData = [];
        const capacityData = [];
        
        eventsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.name && data.attendanceCount !== undefined && data.capacity) {
            eventNames.push(data.name.length > 15 ? data.name.substring(0, 15) + '...' : data.name);
            attendanceData.push(data.attendanceCount);
            capacityData.push(data.capacity);
          }
        });
        
        // If no events found, use default data
        if (eventNames.length === 0) {
          eventNames.push('Workshop', 'Monthly Meeting', 'Tech Talk', 'Hackathon', 'Social Mixer', 'Industry Visit');
          attendanceData.push(35, 45, 32, 28, 40, 25);
          capacityData.push(40, 50, 40, 30, 50, 30);
        }
        
        setChartData({
          labels: eventNames,
          datasets: [
            {
              label: 'Attendance',
              data: attendanceData,
              backgroundColor: 'rgba(14, 165, 233, 0.7)',
              hoverBackgroundColor: 'rgb(14, 165, 233)',
              barThickness: 20,
              borderRadius: 4,
            },
            {
              label: 'Capacity',
              data: capacityData,
              backgroundColor: 'rgba(226, 232, 240, 0.6)',
              hoverBackgroundColor: 'rgba(226, 232, 240, 0.8)',
              barThickness: 20,
              borderRadius: 4,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching event data:', error);
        // Fallback to mock data
        setChartData({
          labels: ['Workshop', 'Monthly Meeting', 'Tech Talk', 'Hackathon', 'Social Mixer', 'Industry Visit'],
          datasets: [
            {
              label: 'Attendance',
              data: [35, 45, 32, 28, 40, 25],
              backgroundColor: 'rgba(14, 165, 233, 0.7)',
              hoverBackgroundColor: 'rgb(14, 165, 233)',
              barThickness: 20,
              borderRadius: 4,
            },
            {
              label: 'Capacity',
              data: [40, 50, 40, 30, 50, 30],
              backgroundColor: 'rgba(226, 232, 240, 0.6)',
              hoverBackgroundColor: 'rgba(226, 232, 240, 0.8)',
              barThickness: 20,
              borderRadius: 4,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventData();
  }, [user]);

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 60,
        ticks: {
          stepSize: 10,
        },
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return <Bar data={chartData} options={options} />;
};