import { useState, useEffect } from 'react'

interface Sample {
  id: string
  name: string
  category: string
  bpm: number
  key: string
  duration: string
  waveform: number[]
  dateAdded: string
}

interface User {
  email: string
  isAdmin: boolean
  isSubscribed: boolean
  name: string
}

const ADMIN_EMAIL = 'admin@samplevault.com'
const ADMIN_PASSWORD = 'admin123'

const initialSamples: Sample[] = [
  { id: '1', name: 'Midnight Bass Drop', category: 'Bass', bpm: 140, key: 'F', duration: '0:04', waveform: [0.3, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 0.4, 0.8, 0.3, 0.6, 0.9, 0.5, 0.7, 0.4, 0.8], dateAdded: '2024-01-15' },
  { id: '2', name: 'Analog Kick 808', category: 'Drums', bpm: 128, key: '-', duration: '0:02', waveform: [1, 0.8, 0.5, 0.3, 0.2, 0.1, 0.05, 0.02, 0.3, 0.5, 0.4, 0.2, 0.1, 0.05, 0.02, 0.01], dateAdded: '2024-01-14' },
  { id: '3', name: 'Ethereal Pad Cm', category: 'Synth', bpm: 90, key: 'Cm', duration: '0:08', waveform: [0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.85, 0.8, 0.75, 0.7, 0.6, 0.5, 0.4, 0.3], dateAdded: '2024-01-13' },
  { id: '4', name: 'Crispy Hi-Hat Loop', category: 'Drums', bpm: 140, key: '-', duration: '0:04', waveform: [0.9, 0.2, 0.8, 0.1, 0.9, 0.3, 0.7, 0.2, 0.9, 0.1, 0.8, 0.2, 0.9, 0.3, 0.7, 0.1], dateAdded: '2024-01-12' },
  { id: '5', name: 'Vocal Chop Destiny', category: 'Vocals', bpm: 124, key: 'Am', duration: '0:03', waveform: [0.1, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.3, 0.8, 0.5, 0.9, 0.6, 0.4, 0.7, 0.3, 0.5], dateAdded: '2024-01-11' },
  { id: '6', name: 'Future Bass Chord', category: 'Synth', bpm: 150, key: 'G', duration: '0:02', waveform: [0.6, 0.8, 0.9, 1, 0.9, 0.8, 0.7, 0.6, 0.7, 0.8, 0.9, 0.85, 0.7, 0.5, 0.4, 0.3], dateAdded: '2024-01-10' },
  { id: '7', name: 'Lo-Fi Texture', category: 'FX', bpm: 85, key: '-', duration: '0:06', waveform: [0.3, 0.4, 0.35, 0.45, 0.4, 0.5, 0.45, 0.4, 0.35, 0.45, 0.5, 0.4, 0.35, 0.4, 0.45, 0.4], dateAdded: '2024-01-09' },
  { id: '8', name: 'Trap Snare Roll', category: 'Drums', bpm: 145, key: '-', duration: '0:02', waveform: [0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.92, 0.95, 0.97, 0.98, 0.99, 1, 0.8, 0.5, 0.3, 0.1], dateAdded: '2024-01-08' },
]

const categories = ['All', 'Bass', 'Drums', 'Synth', 'Vocals', 'FX']

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [samples, setSamples] = useState<Sample[]>(initialSamples)
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'library' | 'admin' | 'subscribe'>('landing')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' })
  const [uploadForm, setUploadForm] = useState({ name: '', category: 'Bass', bpm: 120, key: 'C' })
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('sampleVaultUser')
    if (stored) {
      setUser(JSON.parse(stored))
      setView('library')
    }
  }, [])

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleLogin = () => {
    if (loginForm.email === ADMIN_EMAIL && loginForm.password === ADMIN_PASSWORD) {
      const adminUser = { email: ADMIN_EMAIL, isAdmin: true, isSubscribed: true, name: 'Admin' }
      setUser(adminUser)
      localStorage.setItem('sampleVaultUser', JSON.stringify(adminUser))
      setView('library')
      showNotification('Welcome back, Admin!')
    } else if (loginForm.email && loginForm.password) {
      const storedUsers = JSON.parse(localStorage.getItem('sampleVaultUsers') || '[]')
      const foundUser = storedUsers.find((u: User) => u.email === loginForm.email)
      if (foundUser) {
        setUser(foundUser)
        localStorage.setItem('sampleVaultUser', JSON.stringify(foundUser))
        setView('library')
        showNotification(`Welcome back, ${foundUser.name}!`)
      } else {
        showNotification('Invalid credentials')
      }
    }
  }

  const handleRegister = () => {
    if (registerForm.name && registerForm.email && registerForm.password) {
      const newUser = { 
        email: registerForm.email, 
        isAdmin: false, 
        isSubscribed: false, 
        name: registerForm.name 
      }
      const storedUsers = JSON.parse(localStorage.getItem('sampleVaultUsers') || '[]')
      storedUsers.push(newUser)
      localStorage.setItem('sampleVaultUsers', JSON.stringify(storedUsers))
      setUser(newUser)
      localStorage.setItem('sampleVaultUser', JSON.stringify(newUser))
      setView('subscribe')
      showNotification('Account created! Subscribe to access samples.')
    }
  }

  const handleSubscribe = () => {
    if (user) {
      const subscribedUser = { ...user, isSubscribed: true }
      setUser(subscribedUser)
      localStorage.setItem('sampleVaultUser', JSON.stringify(subscribedUser))
      const storedUsers = JSON.parse(localStorage.getItem('sampleVaultUsers') || '[]')
      const updatedUsers = storedUsers.map((u: User) => u.email === user.email ? subscribedUser : u)
      localStorage.setItem('sampleVaultUsers', JSON.stringify(updatedUsers))
      setView('library')
      showNotification('Subscription activated! Enjoy unlimited access.')
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('sampleVaultUser')
    setView('landing')
    setLoginForm({ email: '', password: '' })
  }

  const handleUpload = () => {
    if (uploadForm.name && uploadForm.category) {
      const newSample: Sample = {
        id: Date.now().toString(),
        name: uploadForm.name,
        category: uploadForm.category,
        bpm: uploadForm.bpm,
        key: uploadForm.key,
        duration: '0:0' + Math.floor(Math.random() * 8 + 2),
        waveform: Array.from({ length: 16 }, () => Math.random() * 0.8 + 0.2),
        dateAdded: new Date().toISOString().split('T')[0]
      }
      setSamples([newSample, ...samples])
      setUploadForm({ name: '', category: 'Bass', bpm: 120, key: 'C' })
      showNotification('Sample uploaded successfully!')
    }
  }

  const filteredSamples = samples.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id)
  }

  const Waveform = ({ data, isPlaying }: { data: number[], isPlaying: boolean }) => (
    <div className="flex items-center gap-[2px] h-8">
      {data.map((height, i) => (
        <div
          key={i}
          className={`w-1 bg-[#39FF14] rounded-full transition-all duration-150 ${isPlaying ? 'waveform-bar' : ''}`}
          style={{ 
            height: `${height * 100}%`,
            opacity: isPlaying ? 1 : 0.6,
            animationDelay: isPlaying ? `${i * 0.05}s` : '0s'
          }}
        />
      ))}
    </div>
  )

  const LedIndicator = ({ active }: { active?: boolean }) => (
    <div className={`w-2 h-2 rounded-full ${active ? 'led-indicator' : 'bg-[#2a2a2e]'}`} />
  )

  const Footer = () => (
    <footer className="mt-auto pt-8 pb-4 text-center">
      <p className="text-[#4a4a4e] text-xs font-mono">
        Requested by <span className="text-[#5a5a5e]">@JustJayJusy</span> · Built by <span className="text-[#5a5a5e]">@clonkbot</span>
      </p>
    </footer>
  )

  // Landing Page
  if (view === 'landing') {
    return (
      <div className="min-h-screen flex flex-col grid-pattern">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#141416] rounded-lg border border-[#2a2a2e] flex items-center justify-center">
              <span className="text-xl">🎹</span>
            </div>
            <span className="font-mono text-[#39FF14] text-lg tracking-wider">SAMPLE VAULT</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setView('login')}
              className="hardware-button px-5 py-2 text-gray-300 font-medium rounded-lg hover:text-white transition-colors"
            >
              Log In
            </button>
            <button 
              onClick={() => setView('register')}
              className="bg-[#39FF14] text-black px-5 py-2 font-semibold rounded-lg hover:bg-[#4dff28] transition-colors glow-green"
            >
              Get Started
            </button>
          </div>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
          <div className="slide-up max-w-4xl text-center">
            <div className="flex justify-center gap-2 mb-8">
              {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.3, 0.7, 0.9, 0.5, 0.8].map((h, i) => (
                <div 
                  key={i}
                  className="w-2 bg-[#39FF14] rounded-full waveform-bar"
                  style={{ height: `${h * 60}px`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Premium Samples.<br/>
              <span className="text-[#39FF14] text-glow">Unlimited Access.</span>
            </h1>
            
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
              Exclusive, handcrafted audio samples for producers who demand quality. 
              One subscription. Infinite creativity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                onClick={() => setView('register')}
                className="bg-[#39FF14] text-black px-8 py-4 font-bold text-lg rounded-xl hover:bg-[#4dff28] transition-all glow-green"
              >
                Start Free Trial
              </button>
              <button 
                onClick={() => setView('login')}
                className="hardware-button px-8 py-4 text-gray-300 font-semibold text-lg rounded-xl hover:text-white transition-colors"
              >
                Browse Library
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#39FF14] font-mono">{samples.length}+</div>
                <div className="text-gray-500 text-sm">Samples</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF6B35] font-mono">HQ</div>
                <div className="text-gray-500 text-sm">WAV Files</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00FFF7] font-mono">∞</div>
                <div className="text-gray-500 text-sm">Downloads</div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Login Page
  if (view === 'login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 grid-pattern">
        <div className="slide-up w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#141416] rounded-lg border border-[#2a2a2e] flex items-center justify-center">
              <span className="text-2xl">🎹</span>
            </div>
            <span className="font-mono text-[#39FF14] text-xl tracking-wider">SAMPLE VAULT</span>
          </div>
          
          <div className="sample-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-mono">EMAIL</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full bg-[#0a0a0b] border border-[#2a2a2e] rounded-lg px-4 py-3 text-white placeholder-gray-600"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-mono">PASSWORD</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full bg-[#0a0a0b] border border-[#2a2a2e] rounded-lg px-4 py-3 text-white placeholder-gray-600"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                onClick={handleLogin}
                className="w-full bg-[#39FF14] text-black py-4 font-bold rounded-xl hover:bg-[#4dff28] transition-all glow-green mt-6"
              >
                Log In
              </button>
            </div>
            
            <p className="text-gray-500 text-center mt-6">
              Don't have an account?{' '}
              <button onClick={() => setView('register')} className="text-[#39FF14] hover:underline">
                Sign up
              </button>
            </p>
          </div>
          
          <button 
            onClick={() => setView('landing')} 
            className="mt-6 text-gray-500 hover:text-gray-300 transition-colors mx-auto block"
          >
            ← Back to home
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  // Register Page
  if (view === 'register') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 grid-pattern">
        <div className="slide-up w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#141416] rounded-lg border border-[#2a2a2e] flex items-center justify-center">
              <span className="text-2xl">🎹</span>
            </div>
            <span className="font-mono text-[#39FF14] text-xl tracking-wider">SAMPLE VAULT</span>
          </div>
          
          <div className="sample-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-mono">NAME</label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                  className="w-full bg-[#0a0a0b] border border-[#2a2a2e] rounded-lg px-4 py-3 text-white placeholder-gray-600"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-mono">EMAIL</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className="w-full bg-[#0a0a0b] border border-[#2a2a2e] rounded-lg px-4 py-3 text-white placeholder-gray-600"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-mono">PASSWORD</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  className="w-full bg-[#0a0a0b] border border-[#2a2a2e] rounded-lg px-4 py-3 text-white placeholder-gray-600"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                onClick={handleRegister}
                className="w-full bg-[#39FF14] text-black py-4 font-bold rounded-xl hover:bg-[#4dff28] transition-all glow-green mt-6"
              >
                Create Account
              </button>
            </div>
            
            <p className="text-gray-500 text-center mt-6">
              Already have an account?{' '}
              <button onClick={() => setView('login')} className="text-[#39FF14] hover:underline">
                Log in
              </button>
            </p>
          </div>
          
          <button 
            onClick={() => setView('landing')} 
            className="mt-6 text-gray-500 hover:text-gray-300 transition-colors mx-auto block"
          >
            ← Back to home
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  // Subscribe Page
  if (view === 'subscribe') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 grid-pattern">
        <div className="slide-up w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
            <p className="text-gray-400">Unlock unlimited access to all samples</p>
          </div>
          
          <div className="sample-card rounded-2xl p-8 border-[#39FF14] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#39FF14] text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Pro Subscription</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-[#39FF14]">$9.99</span>
                <span className="text-gray-500">/month</span>
              </div>
            </div>
            
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited sample downloads',
                'New samples added weekly',
                'High-quality WAV files',
                'Commercial use license',
                'Early access to new packs'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 bg-[#39FF14]/20 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#39FF14]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              onClick={handleSubscribe}
              className="w-full bg-[#39FF14] text-black py-4 font-bold rounded-xl hover:bg-[#4dff28] transition-all glow-green"
            >
              Subscribe Now
            </button>
            
            <p className="text-gray-500 text-sm text-center mt-4">
              Cancel anytime. No commitment.
            </p>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="mt-6 text-gray-500 hover:text-gray-300 transition-colors mx-auto block"
          >
            ← Back to home
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  // Admin Upload Page
  if (view === 'admin' && user?.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2e] bg-[#0a0a0b]/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#141416] rounded-lg border border-[#2a2a2e] flex items-center justify-center">
              <span className="text-xl">🎹</span>
            </div>
            <span className="font-mono text-[#39FF14] text-lg tracking-wider">SAMPLE VAULT</span>
            <span className="bg-[#FF6B35]/20 text-[#FF6B35] text-xs font-mono px-2 py-1 rounded">ADMIN</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setView('library')} className="text-gray-400 hover:text-white transition-colors">
              Library
            </button>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
              Logout
            </button>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
          <div className="slide-up">
            <h1 className="text-3xl font-bold text-white mb-8">Upload New Sample</h1>
            
            <div className="sample-card rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2 font-mono">SAMPLE NAME</label>
                  <input
                    type="text"
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm({...uploadForm, name: e.target.value})}
                    className="w-full bg-[#0a0a0b] border border-[#2a2a2e] rounded-lg px-4 py-3 text-white placeholder-gray-600"
                    placeholder="Enter sample name"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-mono">CATEGORY</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                    className="w-full bg-[#0a0a0b] border border-[#2a2a2e] rounded-lg px-4 py-3 text-white"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-mono">BPM</label>
                  <input
                    type="number"
                    value={uploadForm.bpm}
                    onChange={(e) => setUploadForm({...uploadForm, bpm: parseInt(e.target.value)})}
                    className="w-full bg-[#0a0a0b] border border-[#2a2a2e] rounded-lg px-4 py-3 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-mono">KEY</label>
                  <select
                    value={uploadForm.key}
                    onChange={(e) => setUploadForm({...uploadForm, key: e.target.value})}
                    className="w-full bg-[#0a0a0b] border border-[#2a2a2e] rounded-lg px-4 py-3 text-white"
                  >
                    {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Am', 'Bm', 'Cm', 'Dm', 'Em', 'Fm', 'Gm', '-'].map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2 font-mono">AUDIO FILE</label>
                  <div className="border-2 border-dashed border-[#2a2a2e] rounded-xl p-8 text-center hover:border-[#39FF14] transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-[#141416] rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#39FF14]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-gray-400">Drag & drop your WAV file here</p>
                    <p className="text-gray-600 text-sm mt-1">or click to browse</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleUpload}
                className="w-full bg-[#39FF14] text-black py-4 font-bold rounded-xl hover:bg-[#4dff28] transition-all glow-green mt-8"
              >
                Upload Sample
              </button>
            </div>
            
            <div className="mt-12">
              <h2 className="text-xl font-bold text-white mb-4">Recent Uploads</h2>
              <div className="space-y-3">
                {samples.slice(0, 5).map((sample, i) => (
                  <div key={sample.id} className={`sample-card rounded-xl p-4 flex items-center gap-4 slide-up stagger-${i + 1}`}>
                    <LedIndicator active />
                    <span className="text-white flex-1">{sample.name}</span>
                    <span className="text-gray-500 text-sm font-mono">{sample.category}</span>
                    <span className="text-gray-500 text-sm">{sample.dateAdded}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Library Page
  if (view === 'library' && user) {
    const canAccessSamples = user.isSubscribed || user.isAdmin

    return (
      <div className="min-h-screen flex flex-col">
        {notification && (
          <div className="fixed top-4 right-4 bg-[#39FF14] text-black px-6 py-3 rounded-lg font-semibold z-50 slide-up shadow-lg">
            {notification}
          </div>
        )}
        
        <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2e] bg-[#0a0a0b]/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#141416] rounded-lg border border-[#2a2a2e] flex items-center justify-center">
              <span className="text-xl">🎹</span>
            </div>
            <span className="font-mono text-[#39FF14] text-lg tracking-wider hidden sm:block">SAMPLE VAULT</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {user.isAdmin && (
              <button 
                onClick={() => setView('admin')}
                className="hardware-button px-3 sm:px-4 py-2 text-[#FF6B35] font-medium rounded-lg text-sm"
              >
                Upload
              </button>
            )}
            {!canAccessSamples && (
              <button 
                onClick={() => setView('subscribe')}
                className="bg-[#39FF14] text-black px-3 sm:px-4 py-2 font-semibold rounded-lg text-sm"
              >
                Subscribe
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#141416] rounded-full border border-[#2a2a2e] flex items-center justify-center">
                <span className="text-sm">{user.name[0].toUpperCase()}</span>
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors text-sm">
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 slide-up">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Sample Library</h1>
              <p className="text-gray-400">
                {canAccessSamples 
                  ? `${samples.length} premium samples ready to download`
                  : 'Subscribe to unlock all samples'
                }
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 slide-up stagger-1">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#141416] border border-[#2a2a2e] rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500"
                  placeholder="Search samples..."
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#39FF14] text-black'
                        : 'hardware-button text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Grid */}
            {!canAccessSamples && (
              <div className="sample-card rounded-2xl p-8 text-center mb-8 slide-up stagger-2">
                <div className="w-20 h-20 bg-[#141416] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#39FF14]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Unlock Full Access</h3>
                <p className="text-gray-400 mb-4">Subscribe to download samples and access the full library</p>
                <button
                  onClick={() => setView('subscribe')}
                  className="bg-[#39FF14] text-black px-6 py-3 font-bold rounded-xl hover:bg-[#4dff28] transition-all glow-green"
                >
                  Subscribe Now - $9.99/mo
                </button>
              </div>
            )}

            <div className="grid gap-4">
              {filteredSamples.map((sample, i) => (
                <div 
                  key={sample.id} 
                  className={`sample-card rounded-xl p-4 sm:p-5 slide-up ${i < 6 ? `stagger-${i + 1}` : ''} ${!canAccessSamples ? 'opacity-60' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Play Button */}
                    <button
                      onClick={() => canAccessSamples && togglePlay(sample.id)}
                      disabled={!canAccessSamples}
                      className={`play-button w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        playingId === sample.id 
                          ? 'bg-[#39FF14] text-black' 
                          : 'bg-[#1e1e22] text-[#39FF14] border border-[#2a2a2e]'
                      } ${!canAccessSamples ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      {playingId === sample.id ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>

                    {/* Sample Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{sample.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[#39FF14] text-xs font-mono bg-[#39FF14]/10 px-2 py-0.5 rounded">
                          {sample.category}
                        </span>
                        <span className="text-gray-500 text-sm font-mono">{sample.bpm} BPM</span>
                        <span className="text-gray-500 text-sm font-mono">{sample.key}</span>
                      </div>
                    </div>

                    {/* Waveform */}
                    <div className="hidden md:block flex-1 max-w-xs">
                      <Waveform data={sample.waveform} isPlaying={playingId === sample.id} />
                    </div>

                    {/* Duration & Download */}
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 font-mono text-sm">{sample.duration}</span>
                      {canAccessSamples ? (
                        <button className="hardware-button p-2 rounded-lg text-[#39FF14] hover:text-white transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      ) : (
                        <div className="p-2 text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredSamples.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500">No samples found matching your search.</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return null
}