import React, { useState, useEffect } from 'react'
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network, 
  Activity,
  Server,
  Globe,
  Menu,
  X,
  RefreshCw,
  AlertTriangle,
  Monitor,
  Terminal,
  Wifi,
  WifiOff
} from 'lucide-react'

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [systemData, setSystemData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [backendConnected, setBackendConnected] = useState(false)

  const API_BASE_URL = 'http://127.0.0.1:8000/api'

  const fetchSystemData = async () => {
    try {
      setLoading(true)
      console.log('Fetching from:', `${API_BASE_URL}/system`)
      
      const response = await fetch(`${API_BASE_URL}/system`, { 
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      
      if (data && data.cpu) {
        setSystemData(data)
        setBackendConnected(true)
        setError(null)
      } else {
        console.error('Invalid data structure:', data)
        throw new Error('Invalid data from backend')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setBackendConnected(false)
      setError(`Backend error: ${err.message}`)
      setSystemData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSystemData()
    const interval = setInterval(fetchSystemData, 3000)
    return () => clearInterval(interval)
  }, [])

  const StatCard = ({ title, value, suffix, icon, color = "blue" }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {typeof value === 'number' ? value.toFixed(1) : value}
            {suffix && <span className="text-sm font-normal text-gray-500 ml-1">{suffix}</span>}
          </p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {React.cloneElement(icon, { className: `w-6 h-6 text-${color}-600` })}
        </div>
      </div>
    </div>
  )

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity },
    { id: 'processes', name: 'Processes', icon: Terminal },
    { id: 'network', name: 'Network', icon: Globe },
    { id: 'system', name: 'System Info', icon: Server },
  ]

  if (loading && !systemData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading system data...</p>
        </div>
      </div>
    )
  }

  if (!systemData && !backendConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <WifiOff className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Backend Not Connected</h2>
          <p className="text-gray-600 mb-4">
            {error || 'Please start the Flask backend server to view system data.'}
          </p>
          <div className="bg-gray-100 p-4 rounded-lg text-left mb-4">
            <p className="text-sm font-mono text-gray-800">
              cd backend<br/>
              python app.py
            </p>
          </div>
          <button 
            onClick={fetchSystemData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Retry Connection
          </button>
          <p className="text-xs text-gray-500 mt-4">Check browser console (F12) for details</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full'} bg-gray-900 text-white transition-all duration-300 fixed md:relative z-30 h-full flex flex-col`}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Monitor className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold">SysInsight</h1>
              <p className="text-xs text-gray-400">v1.0.0</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 hover:bg-gray-800 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            {backendConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400">Backend Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400">Backend Offline</span>
              </>
            )}
          </div>
          <div className="text-xs text-gray-400">
            <p>Host: {systemData?.system?.hostname}</p>
            <p>Platform: {systemData?.system?.platform}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigation.find(nav => nav.id === activeTab)?.name || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                backendConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {backendConnected ? (
                  <Wifi className="w-4 h-4" />
                ) : (
                  <WifiOff className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {backendConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button 
                onClick={fetchSystemData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && systemData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="CPU Usage" 
                  value={systemData.cpu.percent} 
                  suffix="%" 
                  icon={<Cpu />} 
                  color="blue"
                />
                <StatCard 
                  title="Memory Usage" 
                  value={systemData.memory.percent} 
                  suffix="%" 
                  icon={<MemoryStick />} 
                  color="green"
                />
                <StatCard 
                  title="Disk Usage" 
                  value={systemData.disk.percent} 
                  suffix="%" 
                  icon={<HardDrive />} 
                  color="purple"
                />
                <StatCard 
                  title="Processes" 
                  value={systemData.processes.length} 
                  icon={<Terminal />} 
                  color="orange"
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">CPU Information</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Model</p>
                    <p className="font-medium">{systemData.cpu.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cores</p>
                    <p className="font-medium">{systemData.cpu.cores} ({systemData.cpu.logical_cores} logical)</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Frequency</p>
                    <p className="font-medium">{systemData.cpu.frequency ? `${systemData.cpu.frequency} GHz` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Vendor</p>
                    <p className="font-medium">{systemData.cpu.vendor}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Memory Details</h2>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Used</span>
                        <span className="font-medium">{systemData.memory.used} GB / {systemData.memory.total} GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all" 
                          style={{ width: `${systemData.memory.percent}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Available: {systemData.memory.available} GB
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Disk Usage</h2>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Used</span>
                        <span className="font-medium">{systemData.disk.used} GB / {systemData.disk.total} GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all" 
                          style={{ width: `${systemData.disk.percent}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Free: {systemData.disk.free} GB
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'processes' && systemData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Running Processes (Top 10 by CPU)</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {systemData.processes.map((process) => (
                      <tr key={process.pid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{process.pid}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{process.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{process.cpu_percent.toFixed(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{process.memory_percent.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'network' && systemData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Network Connections</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remote Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {systemData.network.map((conn, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{conn.local_address}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{conn.remote_address}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {conn.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{conn.pid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'system' && systemData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Hostname</p>
                    <p className="font-medium">{systemData.system.hostname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Platform</p>
                    <p className="font-medium">{systemData.system.platform} {systemData.system.platform_release}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">OS Version</p>
                    <p className="font-medium">{systemData.system.platform_version}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Boot Time</p>
                    <p className="font-medium">{new Date(systemData.system.boot_time).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Uptime</p>
                    <p className="font-medium">{Math.floor(systemData.system.uptime / 3600)} hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hardware Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">CPU Model</p>
                    <p className="font-medium">{systemData.cpu.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CPU Cores</p>
                    <p className="font-medium">{systemData.cpu.cores} physical, {systemData.cpu.logical_cores} logical</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Memory</p>
                    <p className="font-medium">{systemData.memory.total} GB</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Disk</p>
                    <p className="font-medium">{systemData.disk.total} GB</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard