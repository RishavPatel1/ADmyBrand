import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Target, Moon, Sun, Download, Filter, Search, 
  ChevronLeft, ChevronRight, MoreVertical, ArrowUpRight, ArrowDownRight,
  Calendar, Globe, Zap, Bell, Settings, RefreshCw, Eye, MousePointer,
  Activity, BarChart3, BarChart2, TrendingDown
} from 'lucide-react';

// Reusable Components
const MetricCard = ({ metric, index, darkMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`
        ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-gray-200/50'}
        backdrop-blur-xl border rounded-2xl p-6 
        hover:shadow-2xl hover:shadow-blue-500/10
        transition-all duration-500 hover:scale-[1.02] 
        animate-fade-in group cursor-pointer
        ${darkMode ? 'hover:bg-gray-800/80' : 'hover:bg-white/90'}
      `}
      style={{ animationDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`
          p-3 rounded-xl transition-all duration-300
          ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}
          ${isHovered ? 'scale-110 rotate-3' : ''}
        `}>
          <metric.icon className={`w-6 h-6 ${metric.color} transition-all duration-300`} />
        </div>
        <div className="flex items-center space-x-1">
          {metric.change.startsWith('+') ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {metric.change}
          </span>
        </div>
      </div>
      <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
        {metric.title}
      </h3>
      <div className="flex items-baseline space-x-2">
        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {metric.value}
        </p>
        <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          vs last period
        </span>
      </div>
      
      <div className={`mt-4 h-1 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <div 
          className={`h-full bg-gradient-to-r ${metric.gradient} transition-all duration-1000 ease-out`}
          style={{ width: isHovered ? '100%' : '70%' }}
        />
      </div>
    </div>
  );
};

const ChartCard = ({ title, children, darkMode, icon: Icon, subtitle }) => (
  <div className={`
    ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-gray-200/50'}
    backdrop-blur-xl border rounded-2xl p-6 
    hover:shadow-2xl hover:shadow-blue-500/10
    transition-all duration-500
    ${darkMode ? 'hover:bg-gray-800/80' : 'hover:bg-white/90'}
  `}>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <Icon className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <button className={`p-2 rounded-lg transition-all duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
    {children}
  </div>
);

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [tableFilter, setTableFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('line');

  // Enhanced mock data generation
  const generateMockData = () => {
    const dates = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates.map((date, index) => ({
      date,
      revenue: Math.floor(Math.random() * 50000) + 20000 + (index * 500),
      users: Math.floor(Math.random() * 2000) + 500 + (index * 20),
      conversions: Math.floor(Math.random() * 500) + 100 + (index * 5),
      sessions: Math.floor(Math.random() * 5000) + 1000 + (index * 50),
      bounceRate: Math.random() * 30 + 20,
      avgSessionDuration: Math.random() * 300 + 120,
    }));
  };

  const [chartData] = useState(generateMockData());

  const pieData = [
    { name: 'Organic Search', value: 35, color: '#3B82F6', trend: '+12%' },
    { name: 'Paid Ads', value: 25, color: '#10B981', trend: '+8%' },
    { name: 'Social Media', value: 20, color: '#F59E0B', trend: '+15%' },
    { name: 'Direct', value: 15, color: '#EF4444', trend: '-2%' },
    { name: 'Referral', value: 5, color: '#8B5CF6', trend: '+25%' },
  ];

  const tableData = [
    { 
      id: 1, 
      campaign: 'Summer Sale 2024', 
      impressions: 45230, 
      clicks: 2340, 
      ctr: '5.17%', 
      cost: '$1,245', 
      conversions: 89,
      status: 'Active',
      performance: 'Excellent'
    },
    { 
      id: 2, 
      campaign: 'Brand Awareness Q3', 
      impressions: 67890, 
      clicks: 1890, 
      ctr: '2.78%', 
      cost: '$2,100', 
      conversions: 34,
      status: 'Active',
      performance: 'Good'
    },
    { 
      id: 3, 
      campaign: 'Product Launch', 
      impressions: 23450, 
      clicks: 3210, 
      ctr: '13.69%', 
      cost: '$890', 
      conversions: 156,
      status: 'Active',
      performance: 'Excellent'
    },
    { 
      id: 4, 
      campaign: 'Holiday Promo', 
      impressions: 89120, 
      clicks: 4560, 
      ctr: '5.12%', 
      cost: '$3,400', 
      conversions: 203,
      status: 'Paused',
      performance: 'Good'
    },
    { 
      id: 5, 
      campaign: 'Retargeting Campaign', 
      impressions: 12340, 
      clicks: 890, 
      ctr: '7.21%', 
      cost: '$567', 
      conversions: 67,
      status: 'Active',
      performance: 'Average'
    },
    { 
      id: 6, 
      campaign: 'Email Newsletter', 
      impressions: 34560, 
      clicks: 2100, 
      ctr: '6.08%', 
      cost: '$234', 
      conversions: 98,
      status: 'Active',
      performance: 'Good'
    },
    { 
      id: 7, 
      campaign: 'Social Media Boost', 
      impressions: 56780, 
      clicks: 3450, 
      ctr: '6.08%', 
      cost: '$1,890', 
      conversions: 145,
      status: 'Active',
      performance: 'Good'
    },
    { 
      id: 8, 
      campaign: 'Video Marketing', 
      impressions: 78900, 
      clicks: 4320, 
      ctr: '5.47%', 
      cost: '$2,650', 
      conversions: 189,
      status: 'Active',
      performance: 'Excellent'
    },
  ];

  // Calculate metrics with memoization for performance
  const metrics = useMemo(() => {
    const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
    const totalUsers = chartData.reduce((sum, item) => sum + item.users, 0);
    const totalConversions = chartData.reduce((sum, item) => sum + item.conversions, 0);
    const growthRate = ((chartData[chartData.length - 1]?.revenue - chartData[0]?.revenue) / chartData[0]?.revenue * 100) || 0;

    return [
      { 
        title: 'Total Revenue', 
        value: `$${(totalRevenue / 1000).toFixed(1)}K`, 
        change: '+12.5%', 
        icon: DollarSign, 
        color: 'text-green-500',
        gradient: 'from-green-400 to-green-600'
      },
      { 
        title: 'Active Users', 
        value: `${(totalUsers / 1000).toFixed(1)}K`, 
        change: '+8.2%', 
        icon: Users, 
        color: 'text-blue-500',
        gradient: 'from-blue-400 to-blue-600'
      },
      { 
        title: 'Conversions', 
        value: totalConversions.toLocaleString(), 
        change: '+15.3%', 
        icon: Target, 
        color: 'text-purple-500',
        gradient: 'from-purple-400 to-purple-600'
      },
      { 
        title: 'Growth Rate', 
        value: `${growthRate.toFixed(1)}%`, 
        change: '+2.1%', 
        icon: TrendingUp, 
        color: 'text-orange-500',
        gradient: 'from-orange-400 to-orange-600'
      },
    ];
  }, [chartData]);

  // Enhanced filtering and sorting
  const processedTableData = useMemo(() => {
    let filtered = tableData.filter(item =>
      item.campaign.toLowerCase().includes(tableFilter.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (sortConfig.direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      });
    }

    return filtered;
  }, [tableFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(processedTableData.length / itemsPerPage);
  const paginatedData = processedTableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const themeClasses = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
    : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900';

  const cardClasses = darkMode 
    ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-xl' 
    : 'bg-white/80 border-gray-200/50 backdrop-blur-xl';

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getPerformanceColor = (performance) => {
    switch(performance) {
      case 'Excellent': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Average': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Loading ADmyBRAND Insights...
          </h2>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${cardClasses} border rounded-xl p-4 shadow-2xl`}>
          <p className="font-medium mb-2">{new Date(label).toLocaleDateString()}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${themeClasses}`}>
      {/* Animated background patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Enhanced Header */}
      <header className={`${cardClasses} border-b sticky top-0 z-50`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">AD</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                ADmyBRAND Insights
              </h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentTime.toLocaleString()} • Live Dashboard
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className={`px-4 py-2 rounded-xl border ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-600 text-white' 
                    : 'bg-white/80 border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-xl`}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button className={`p-2 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-700/50 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <Bell className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' 
                    : 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative">
        {/* Enhanced Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard 
              key={metric.title} 
              metric={metric} 
              index={index} 
              darkMode={darkMode} 
            />
          ))}
        </div>

        {/* Chart Controls */}
        <div className="mb-6">
          <div className={`${cardClasses} border rounded-2xl p-4`}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Analytics Overview</h2>
              <div className="flex items-center space-x-2">
                {[
                  { key: 'line', icon: TrendingUp, label: 'Line' },
                  { key: 'area', icon: Activity, label: 'Area' },
                  { key: 'bar', icon: BarChart3, label: 'Bar' }
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveChart(key)}
                    className={`p-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                      activeChart === key
                        ? 'bg-blue-500 text-white shadow-lg'
                        : darkMode 
                          ? 'bg-gray-700/50 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Dynamic Revenue Chart */}
          <ChartCard 
            title="Revenue Analytics" 
            subtitle="Track your revenue performance over time"
            darkMode={darkMode} 
            icon={activeChart === 'line' ? TrendingUp : activeChart === 'area' ? Activity : BarChart3}
          >
            <ResponsiveContainer width="100%" height={350}>
              {activeChart === 'line' && (
                <LineChart data={chartData.slice(-14)}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="date" 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              )}
              
              {activeChart === 'area' && (
                <AreaChart data={chartData.slice(-14)}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="date" 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    fill="url(#areaGradient)"
                  />
                </AreaChart>
              )}
              
              {activeChart === 'bar' && (
                <BarChart data={chartData.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="date" 
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                  />
                  <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="revenue" 
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </ChartCard>

          {/* Enhanced Traffic Sources */}
          <ChartCard 
            title="Traffic Sources" 
            subtitle="Breakdown of your traffic channels"
            darkMode={darkMode} 
            icon={BarChart2}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={130}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 gap-3 mt-6">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-opacity-50 hover:bg-opacity-75 transition-all duration-200" 
                     style={{ backgroundColor: `${item.color}15` }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{item.value}%</span>
                    <span className={`ml-2 text-sm ${item.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {item.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Enhanced Data Table */}
        <div className={`${cardClasses} border rounded-2xl p-6`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-xl font-semibold">Campaign Performance</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Track and analyze all your marketing campaigns in one place
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={tableFilter}
                  onChange={(e) => setTableFilter(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white/80 border-gray-300 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-xl transition-all duration-200`}
                />
              </div>
              <div className="flex items-center space-x-2">
                <button className={`p-2 rounded-xl transition-all duration-200 ${darkMode ? 'bg-gray-700/50 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  <Filter className="w-4 h-4" />
                </button>
                <button className={`p-2 rounded-xl transition-all duration-200 ${darkMode ? 'bg-gray-700/50 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  {[
                    { key: 'campaign', label: 'Campaign' },
                    { key: 'impressions', label: 'Impressions' },
                    { key: 'clicks', label: 'Clicks' },
                    { key: 'ctr', label: 'CTR' },
                    { key: 'cost', label: 'Cost' },
                    { key: 'conversions', label: 'Conversions' },
                    { key: 'status', label: 'Status' }
                  ].map(({ key, label }) => (
                    <th 
                      key={key}
                      className={`text-left py-4 px-4 font-semibold cursor-pointer transition-all duration-200 ${
                        darkMode 
                          ? 'text-gray-300 hover:bg-gray-700/50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      } ${sortConfig.key === key ? 'text-blue-500' : ''}`}
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{label}</span>
                        {sortConfig.key === key && (
                          <span className="text-blue-500">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr 
                    key={row.id}
                    className={`border-b transition-all duration-300 hover:scale-[1.01] ${
                      darkMode 
                        ? 'border-gray-700/50 hover:bg-gray-700/30' 
                        : 'border-gray-100 hover:bg-gray-50/50'
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${row.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                        <span className="font-medium">{row.campaign}</span>
                      </div>
                    </td>
                    <td className={`py-4 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {row.impressions.toLocaleString()}
                    </td>
                    <td className={`py-4 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {row.clicks.toLocaleString()}
                    </td>
                    <td className={`py-4 px-4 font-medium ${getPerformanceColor(row.performance)}`}>
                      {row.ctr}
                    </td>
                    <td className={`py-4 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {row.cost}
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        {row.conversions}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, processedTableData.length)}</span> of{' '}
              <span className="font-medium">{processedTableData.length}</span> results
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  currentPage === 1 
                    ? 'opacity-50 cursor-not-allowed' 
                    : darkMode 
                      ? 'bg-gray-700/50 hover:bg-gray-600 hover:scale-105' 
                      : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-700/50'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  currentPage === totalPages 
                    ? 'opacity-50 cursor-not-allowed' 
                    : darkMode 
                      ? 'bg-gray-700/50 hover:bg-gray-600 hover:scale-105' 
                      : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${cardClasses} border rounded-2xl p-6 text-center`}>
            <Eye className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h4 className="text-2xl font-bold">2.4M</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Page Views</p>
            <div className="mt-2 flex items-center justify-center space-x-1">
              <ArrowUpRight className="w-3 h-3 text-green-500" />
              <span className="text-green-500 text-xs">+18% this month</span>
            </div>
          </div>
          
          <div className={`${cardClasses} border rounded-2xl p-6 text-center`}>
            <MousePointer className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h4 className="text-2xl font-bold">3.7%</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average CTR</p>
            <div className="mt-2 flex items-center justify-center space-x-1">
              <ArrowUpRight className="w-3 h-3 text-green-500" />
              <span className="text-green-500 text-xs">+0.3% this week</span>
            </div>
          </div>
          
          <div className={`${cardClasses} border rounded-2xl p-6 text-center`}>
            <Zap className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <h4 className="text-2xl font-bold">4.2s</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Load Time</p>
            <div className="mt-2 flex items-center justify-center space-x-1">
              <TrendingDown className="w-3 h-3 text-green-500" />
              <span className="text-green-500 text-xs">-0.8s improved</span>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .backdrop-blur-xl {
          backdrop-filter: blur(16px);
        }
        
        .glass-morphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;