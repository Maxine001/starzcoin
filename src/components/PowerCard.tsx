
import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from './StatCard';

// Generate sample data for the chart
const generateChartData = () => {
  const data = [];
  let value = 100;
  
  for (let i = 0; i < 24; i++) {
    // Add some randomness to the data
    const change = Math.random() * 10 - 5;
    value = Math.max(80, Math.min(140, value + change));
    
    data.push({
      time: `${i}:00`,
      value: parseFloat(value.toFixed(1))
    });
  }
  
  return data;
};

const PowerCard = () => {
  const [chartData, setChartData] = useState(generateChartData());
  const [currentPower, setCurrentPower] = useState(105.8);
  const [powerLimit, setPowerLimit] = useState(150);
  
  // Update current power every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const newPower = parseFloat((100 + Math.random() * 20).toFixed(1));
      setCurrentPower(newPower);
      
      // Update the last chart data point
      setChartData(prev => {
        const newData = [...prev];
        newData[newData.length - 1].value = newPower;
        return newData;
      });
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <StatCard 
      title="Mining Power" 
      icon={<Zap size={18} />}
      className="700px"
      contentClassName="flex flex-col"
    >
      <div className="flex items-baseline justify-between mb-1">
        <div className="text-2xl font-medium tracking-tight">
          {currentPower}
          <span className="text-sm ml-1 font-normal text-zinc-500 dark:text-zinc-400">MH/s</span>
        </div>
        
        <div className="flex items-center text-xs">
          <span className={`font-medium ${currentPower > 100 ? 'text-emerald-500' : 'text-red-500'}`}>
            {currentPower > 100 ? '+' : ''}{(currentPower - 100).toFixed(1)}%
          </span>
          <span className="text-zinc-500 dark:text-zinc-400 ml-1">vs avg</span>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -32, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#637eff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#637eff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis 
              domain={[70, 150]} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              width={30}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontSize: '12px',
              }}
              labelStyle={{ marginBottom: '4px', fontWeight: 500 }}
              formatter={(value) => [`${value} MH/s`, 'Power']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#4a5cf8" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPower)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500 dark:text-zinc-400">Power Limit: {powerLimit} MH/s</span>
          <span className="font-medium">{((currentPower / powerLimit) * 100).toFixed(0)}% Usage</span>
        </div>
        
        <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${(currentPower / powerLimit) * 100}%`,
              background: currentPower / powerLimit > 0.8 
                ? 'linear-gradient(90deg, #f97316, #ef4444)' 
                : 'linear-gradient(90deg, #4ade80, #2dd4bf)'
            }}
          ></div>
        </div>
      </div>
    </StatCard>
  );
};

export default PowerCard;
