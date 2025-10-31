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
  const data = {
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
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        mode: 'index' as const,
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
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return <Line data={data} options={options} />;
};

// Bar Chart for Event Attendance
export const BarChart = () => {
  const data = {
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
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        mode: 'index' as const,
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

  return <Bar data={data} options={options} />;
};