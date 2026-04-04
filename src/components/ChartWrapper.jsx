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
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#64748B', font: { family: 'Inter' } }
    },
    tooltip: {
      backgroundColor: '#FFFFFF',
      titleColor: '#0F172A',
      bodyColor: '#64748B',
      borderColor: '#E2E8F0',
      borderWidth: 1,
      padding: 12,
    }
  },
  scales: {
    x: {
      grid: { color: '#F1F5F9' },
      ticks: { color: '#64748B', font: { family: 'Inter' } }
    },
    y: {
      grid: { color: '#F1F5F9' },
      ticks: { color: '#64748B', font: { family: 'Inter' } }
    }
  }
};

export const LineChart = ({ data, title }) => (
  <div className="w-full h-[300px]">
    <h3 className="text-sm font-medium text-text-secondary mb-md">{title}</h3>
    <div className="h-[250px]">
      <Line options={commonOptions} data={data} />
    </div>
  </div>
);

export const BarChart = ({ data, title }) => (
  <div className="w-full h-[300px]">
    <h3 className="text-sm font-medium text-text-secondary mb-md">{title}</h3>
    <div className="h-[250px]">
      <Bar options={commonOptions} data={data} />
    </div>
  </div>
);
