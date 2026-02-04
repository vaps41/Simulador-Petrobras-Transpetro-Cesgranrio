import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  query 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken,
  User 
} from 'firebase/auth';
import { 
  Gavel, 
  Mail, 
  Lock, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  Globe, 
  Calendar, 
  Box, 
  Search, 
  Grid, 
  List, 
  Check, 
  Loader2, 
  Car, 
  Home, 
  Layers, 
  ArrowRight, 
  Circle,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown
} from 'lucide-react';

// --- CONFIGURAÇÃO MANUAL (BIDU HUNTER) ---
// Adicionada para garantir conexão com o projeto correto
const MANUAL_CONFIG = {
  apiKey: "AIzaSyCOkKprocDDwAIAv0Uo55sLbGbddGdClnk",
  authDomain: "bidu-hunter.firebaseapp.com",
  projectId: "bidu-hunter",
  storageBucket: "bidu-hunter.firebasestorage.app",
  messagingSenderId: "214165308336",
  appId: "1:214165308336:web:2b4cec8fee60f52bb74c75",
  measurementId: "G-F86N3D0C0V"
};

// --- CONFIGURAÇÃO E TIPOS ---

const COLORS = {
  gold: '#D4AF37',
  goldHover: '#b5952f',
  bg: '#f3f4f6',
  cardBg: '#ffffff',
  textMain: '#1f2937',
  headerBg: '#111827'
};

// --- COMPONENTES ---

const LoginModal = ({ 
  isOpen, 
  onLogin 
}) => {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) onLogin(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md p-8 text-center bg-gradient-to-br from-[#1a1a1a] to-[#222] border border-[#D4AF37] rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.1)]">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-600 to-yellow-300 rounded-full shadow-xl border-4 border-[#121212] text-black">
            <Gavel size={32} strokeWidth={2.5} />
          </div>
        </div>
        
        <h2 className="mt-8 mb-2 text-2xl font-bold text-white">
          BIDU <span className="text-[#D4AF37]">HUNTER</span>
        </h2>
        <p className="mb-8 text-sm text-gray-400">
          Identifique-se para acessar o radar de leilões.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative text-left">
            <label className="ml-1 text-xs font-bold uppercase text-[#D4AF37]">
              Seu E-mail de Acesso
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-4 top-3.5 text-gray-500" size={16} />
              <input 
                type="email" 
                required 
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 pl-10 pr-4 text-white bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-3 text-sm font-bold tracking-wider text-black uppercase transition-transform rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#F2C94C] hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[0_4px_12px_rgba(212,175,55,0.4)]"
          >
            Entrar no Sistema
          </button>
        </form>
        
        <p className="mt-6 text-xs text-gray-600 flex items-center justify-center gap-1">
          <Lock size={10} /> Suas preferências serão salvas neste dispositivo.
        </p>
      </div>
    </div>
  );
};

const AuctionCard = ({ data, viewMode }) => {
  const isHappening = data.isLive || data.pregao === "HOJE";
  
  const CategoryIcon = useMemo(() => {
    switch(data.categoria) {
      case 'Veículos': return Car;
      case 'Imóveis': return Home;
      case 'Judicial': return Gavel;
      default: return Box;
    }
  }, [data.categoria]);

  const estadosTags = useMemo(() => {
    const list = data.estados || [];
    return {
      visible: list.slice(0, 2),
      remaining: list.length > 2 ? list.length - 2 : 0
    };
  }, [data.estados]);

  const isSobConsulta = data.pregao === "Sob Consulta";
  const dateDisplayClass = isHappening ? 'text-red-600 font-bold' : (isSobConsulta ? 'text-blue-600 font-medium' : 'text-gray-800');
  const DateIcon = isSobConsulta ? Clock : Calendar;

  if (viewMode === 'list') {
    return (
      <div className="group relative flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:border-[#D4AF37] hover:shadow-md transition-all duration-300 p-3 md:p-4 gap-4 animate-in fade-in slide-in-from-bottom-2">
         {isHappening && (
          <div className="md:hidden absolute top-0 left-0 w-full bg-red-600 text-white text-[9px] font-bold text-center py-0.5 uppercase tracking-wide rounded-t-lg">
            <div className="flex items-center justify-center gap-1">
              <Circle size={6} fill="white" className="animate-pulse" /> Ao Vivo
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-3 min-w-[60px] pt-4 md:pt-0">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg text-[#D4AF37] shadow-sm">
            <CategoryIcon size={18} />
          </div>
          {isHappening && (
            <div className="hidden md:flex text-red-600 text-[10px] font-bold uppercase items-center gap-1 whitespace-nowrap">
               <Circle size={6} fill="currentColor" className="animate-pulse" /> Ao Vivo
            </div>
          )}
        </div>

        <div className="flex-grow w-full md:w-auto text-center md:text-left">
          <h3 className="text-sm font-bold text-gray-800 truncate" title={data.title}>
            {data.title}
          </h3>
          <p className="text-[10px] text-gray-500 font-medium truncate mb-2 md:mb-0">
            {data.url ? data.url.replace('https://www.', '').replace('https://', '').split('/')[0] : ''}
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto justify-center md:justify-start">
          <div className="bg-gray-50 px-3 py-1.5 rounded border border-gray-100 min-w-[80px]">
            <span className="block text-[9px] text-gray-400 uppercase font-bold">Data</span>
            <div className={`text-xs flex items-center gap-1 ${dateDisplayClass}`}>
              <DateIcon size={10} /> {String(data.pregao || '')}
            </div>
          </div>
          <div className="bg-gray-50 px-3 py-1.5 rounded border border-gray-100 min-w-[80px]">
            <span className="block text-[9px] text-gray-400 uppercase font-bold">Lotes</span>
            <div className="text-xs text-gray-800 flex items-center gap-1">
              <Layers size={10} className="text-[#D4AF37]" /> {String(data.lotes || '')}
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto min-w-[140px]">
           <a 
            href={data.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full gap-2 py-2 text-xs font-bold text-white uppercase transition-colors bg-gray-800 rounded hover:bg-[#D4AF37]"
          >
            Visitar <ArrowRight size={10} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:border-[#D4AF37] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 overflow-hidden animate-in fade-in zoom-in-95">
      {isHappening && (
        <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-[9px] font-bold text-center py-0.5 z-10 uppercase tracking-wide">
          <div className="flex items-center justify-center gap-1">
            <Circle size={6} fill="white" className="animate-pulse" /> Ao Vivo
          </div>
        </div>
      )}

      <div className="p-4 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-50 border border-gray-200 rounded text-[#D4AF37] shadow-sm shrink-0">
            <CategoryIcon size={16} />
          </div>
          <div className="flex flex-wrap gap-1">
            {estadosTags.visible.map(uf => (
              <span key={uf} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 uppercase">
                {uf}
              </span>
            ))}
            {estadosTags.remaining > 0 && (
              <span className="text-[9px] text-gray-400 ml-1">+{estadosTags.remaining}</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-2 flex-grow">
        <h3 className="mb-0.5 text-sm font-bold text-gray-800 truncate" title={data.title}>
          {data.title}
        </h3>
        <p className="mb-3 text-[10px] font-medium text-gray-500 truncate">
          {data.url ? data.url.replace('https://www.', '').replace('https://', '').split('/')[0] : ''}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-gray-50 p-1.5 rounded border border-gray-100">
            <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-wide">Data</span>
            <div className={`text-xs flex items-center gap-1 ${dateDisplayClass}`}>
              <DateIcon size={10} /> {String(data.pregao || '')}
            </div>
          </div>
          <div className="bg-gray-50 p-1.5 rounded border border-gray-100">
            <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-wide">Lotes</span>
            <div className="text-xs text-gray-800 flex items-center gap-1">
              <Layers size={10} className="text-[#D4AF37]" /> {String(data.lotes || '')}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 mt-auto bg-white border-t border-gray-100">
        <a 
          href={data.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full gap-2 py-1.5 text-xs font-bold text-white uppercase transition-colors bg-gray-800 rounded hover:bg-[#D4AF37]"
        >
          Visitar <ArrowRight size={10} />
        </a>
      </div>
    </div>
  );
};

const StatsBoard = ({ 
  allSites, 
  filteredSites, 
  lastUpdate 
}) => {
  const stats = useMemo(() => {
    const total = allSites.length;
    const hoje = filteredSites.filter(s => s.isLive || s.pregao === "HOJE").length;
    const lotes = filteredSites.reduce((acc, s) => acc + (s.lotes || 0), 0);
    const encontrados = filteredSites.length;

    return { total, hoje, lotes, encontrados };
  }, [allSites, filteredSites]);

  return (
    <div className="grid grid-cols-2 gap-3 mb-8 md:grid-cols-4 md:gap-4">
      <div className="relative p-4 overflow-hidden transition bg-white border border-gray-200 shadow-sm rounded-xl group hover:shadow-md">
        <div className="absolute transition opacity-10 right-2 top-2 group-hover:opacity-20">
          <Globe size={40} className="text-gray-800" />
        </div>
        <h3 className="text-[10px] uppercase font-bold tracking-wide text-gray-500">Monitorados</h3>
        <p className="mt-1 text-2xl font-bold text-gray-800">{stats.total || '-'}</p>
        <p className="mt-1 text-[10px] text-green-600 flex items-center gap-1 font-semibold">
          <CheckCircle size={10} /> {lastUpdate}
        </p>
      </div>

      <div className="relative p-4 overflow-hidden transition bg-white border border-gray-200 shadow-sm rounded-xl group hover:shadow-md">
        <div className="absolute transition opacity-10 right-2 top-2 group-hover:opacity-20">
          <Calendar size={40} className="text-blue-600" />
        </div>
        <h3 className="text-[10px] uppercase font-bold tracking-wide text-gray-500">Leilões Hoje</h3>
        <p className="mt-1 text-2xl font-bold text-gray-800">{stats.hoje}</p>
        <p className="mt-1 text-[10px] font-semibold text-blue-600">Nesta seleção</p>
      </div>

      <div className="relative p-4 overflow-hidden transition bg-white border border-gray-200 shadow-sm rounded-xl group hover:shadow-md">
        <div className="absolute transition opacity-10 right-2 top-2 group-hover:opacity-20">
          <Box size={40} className="text-green-600" />
        </div>
        <h3 className="text-[10px] uppercase font-bold tracking-wide text-gray-500">Lotes Encontrados</h3>
        <p className="mt-1 text-2xl font-bold text-gray-800">{stats.lotes}</p>
        <p className="mt-1 text-[10px] font-medium text-gray-500">
           {stats.encontrados} sites listados
        </p>
      </div>

      <div className="relative flex flex-col justify-center p-4 overflow-hidden bg-white border-l-4 border-gray-200 shadow-sm rounded-xl border-l-[#D4AF37]">
        <h3 className="mb-2 text-[10px] uppercase font-bold tracking-wide text-gray-800">Modo Caçador</h3>
        <p className="mt-1 mb-3 text-xs text-gray-400">
           {stats.total > 0 ? 'Monitoramento ativo' : 'Inicializando...'}
        </p>
        <div className="w-full h-1.5 mb-1 overflow-hidden bg-gray-100 rounded-full">
          <div className={`h-1.5 rounded-full bg-[#D4AF37] ${stats.total > 0 ? 'w-full' : 'w-[5%] animate-pulse'}`}></div>
        </div>
        <p className="text-xs text-right text-[#D4AF37] font-bold">Online</p>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---

export default function App() {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  
  // Garantir que appId seja string
  const [appId, setAppId] = useState('default-app-id');

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [allSites, setAllSites] = useState([]);
  const [lastDbUpdate, setLastDbUpdate] = useState("Verificando...");
  
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    state: 'todos',
    category: 'todos',
    dateMode: 'todos'
  });
  const [savedFilter, setSavedFilter] = useState(false);

  // PAGINAÇÃO CLIENT-SIDE
  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // --- EFEITOS (Side Effects) ---

  useEffect(() => {
    const initFirebase = async () => {
      try {
        let firebaseConfig = MANUAL_CONFIG; // Força o uso da config manual
        
        // Verifica se há env vars (produção) que devem ter prioridade
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FIREBASE_CONFIG) {
            try {
                firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
            } catch (e) {
                console.warn("Erro parsing VITE_FIREBASE_CONFIG", e);
            }
        }

        const app = initializeApp(firebaseConfig);
        const authInstance = getAuth(app);
        const dbInstance = getFirestore(app);
        
        setAuth(authInstance);
        setDb(dbInstance);

        // Auth
        await signInAnonymously(authInstance);

        const unsubscribeAuth = onAuthStateChanged(authInstance, (currentUser) => {
          if (currentUser) {
             const savedEmail = localStorage.getItem('bidu_last_user');
             if (savedEmail) {
                const mockUser = { ...currentUser, email: savedEmail };
                setUser(mockUser);
                loadUserPrefs(savedEmail);
             } else {
                setUser(currentUser);
                setShowLoginModal(true);
             }
          } else {
            setUser(null);
          }
        });
        
        return () => unsubscribeAuth();

      } catch (err) {
        console.error("Erro geral init:", err);
        loadSimulatedData();
        setLoading(false);
      }
    };

    initFirebase();
  }, []);

  useEffect(() => {
    if (!user || !db) return;

    // Conexão direta com a coleção 'leiloes' do projeto Bidu Hunter
    try {
        const collectionPath = collection(db, 'leiloes');
        const q = query(collectionPath);
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const sites = [];
          querySnapshot.forEach((doc) => {
            sites.push(doc.data());
          });
          
          if (sites.length > 0) {
            processAndSetSites(sites);
          } else {
            console.log("Coleção vazia, carregando dados simulados.");
            loadSimulatedData();
          }
          setLoading(false);
        }, (error) => {
          console.error("Erro Firestore (onSnapshot):", error);
          loadSimulatedData(); 
          setLoading(false);
        });

        return () => unsubscribe();
    } catch (e) {
        console.error("Erro ao criar referência da coleção:", e);
        loadSimulatedData();
        setLoading(false);
    }
  }, [user, db]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  // --- LÓGICA DE NEGÓCIO ---

  const loadSimulatedData = () => {
    const mockData = [
      { title: "COPART", url: "https://www.copart.com.br", estados: ["SP", "MG", "PR"], categoria: "Veículos", pregao: "HOJE", lotes: 450, isLive: true, rawDate: new Date().toISOString() },
      { title: "FREITAS LEILOEIRO", url: "https://www.freitasleiloeiro.com.br", estados: ["SP"], categoria: "Veículos", pregao: "25/12", lotes: 120, isLive: false, rawDate: new Date(Date.now() + 86400000).toISOString() },
      { title: "SUPERBID", url: "https://www.superbid.net", estados: ["SP", "RJ", "MG", "Nacional"], categoria: "Veículos", pregao: "26/12", lotes: 80, isLive: false, rawDate: new Date(Date.now() + 172800000).toISOString() },
      { title: "MGL LEILÕES", url: "https://www.mgl.com.br", estados: ["MG"], categoria: "Judicial", pregao: "HOJE", lotes: 30, isLive: true, rawDate: new Date().toISOString() },
      { title: "BR BID", url: "https://www.brbid.com", estados: ["RJ"], categoria: "Veículos", pregao: "28/12", lotes: 200, isLive: false, rawDate: new Date(Date.now() + 345600000).toISOString() },
      { title: "SODRÉ SANTORO", url: "https://www.sodresantoro.com.br", estados: ["SP"], categoria: "Veículos", pregao: "HOJE", lotes: 600, isLive: true, rawDate: new Date().toISOString() },
      { title: "SITE EXEMPLO CONSULTA", url: "https://www.exemplo.com.br", estados: ["AC", "RO"], categoria: "Imóveis", pregao: "Sob Consulta", lotes: 5, isLive: false, rawDate: "", status: "online" }
    ];
    // Dados duplicados para testar scroll
    const expandedMock = [...mockData, ...mockData, ...mockData];
    processAndSetSites(expandedMock);
  };

  const processAndSetSites = (sites) => {
    const sorted = sites.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      if (a.pregao === "Sob Consulta" && b.pregao !== "Sob Consulta") return 1;
      if (a.pregao !== "Sob Consulta" && b.pregao === "Sob Consulta") return -1;
      
      const dateA = new Date(a.rawDate || 0).getTime();
      const dateB = new Date(b.rawDate || 0).getTime();
      return dateA - dateB;
    });

    setAllSites(sorted);

    if (sites.length > 0) {
      const dates = sites.map(s => s.last_updated ? new Date(s.last_updated).getTime() : 0);
      const maxDate = new Date(Math.max(...dates));
      if (maxDate.getTime() > 0) {
         setLastDbUpdate(`Atualizado: ${maxDate.toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`);
      } else {
         setLastDbUpdate('Dados Simulados');
      }
    }
  };

  const filteredSites = useMemo(() => {
    const term = filters.search.toLowerCase();
    const today = new Date();
    today.setHours(0,0,0,0);

    return allSites.filter(site => {
      const titleMatch = (site.title || "").toLowerCase().includes(term);
      const siteStates = site.estados || [];
      const matchesState = filters.state === 'todos' || siteStates.includes(filters.state);
      const matchesCategory = filters.category === 'todos' || site.categoria === filters.category;

      let matchesDate = true;
      let siteDate = new Date();
      if (site.rawDate) siteDate = new Date(site.rawDate);
      siteDate.setHours(0, 0, 0, 0);

      if (filters.dateMode === 'hoje') {
        matchesDate = site.isLive || site.pregao === "HOJE" || (siteDate.getTime() === today.getTime());
      } else if (filters.dateMode === 'semanas') {
        matchesDate = !site.isLive && site.pregao !== "HOJE" && site.pregao !== "Sob Consulta" && (siteDate.getTime() > today.getTime());
      } else if (filters.dateMode === 'consulta') {
        matchesDate = site.pregao === "Sob Consulta";
      }

      return titleMatch && matchesState && matchesCategory && matchesDate;
    });
  }, [allSites, filters]);

  const displayedSites = useMemo(() => {
    return filteredSites.slice(0, visibleCount);
  }, [filteredSites, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

  const handleLogin = (email) => {
    localStorage.setItem('bidu_last_user', email);
    if (user) {
        const updatedUser = { ...user, email: email };
        setUser(updatedUser);
    }
    setShowLoginModal(false);
    loadUserPrefs(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('bidu_last_user');
    if (user) {
        const anonUser = { ...user };
        delete anonUser.email; 
        setUser(anonUser);
    }
    setShowLoginModal(true);
  };

  const loadUserPrefs = (email) => {
    try {
      const prefsStr = localStorage.getItem('bidu_prefs_' + email);
      if (prefsStr) {
        const prefs = JSON.parse(prefsStr);
        setFilters(prev => ({
          ...prev,
          state: prefs.state || 'todos',
          category: prefs.category || 'todos',
          dateMode: prefs.date || 'todos'
        }));
        setSavedFilter(true);
        setTimeout(() => setSavedFilter(false), 3000);
      }
    } catch (e) { console.error("Erro ao carregar prefs", e); }
  };

  const saveUserPrefs = () => {
    if (!user?.email) return;
    const prefs = {
      state: filters.state,
      category: filters.category,
      date: filters.dateMode
    };
    localStorage.setItem('bidu_prefs_' + user.email, JSON.stringify(prefs));
    setSavedFilter(true);
    setTimeout(() => setSavedFilter(false), 3000);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      return newFilters;
    });
  };

  // --- RENDERIZAÇÃO ---

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f4f6] font-sans antialiased">
      
      <LoginModal isOpen={showLoginModal} onLogin={handleLogin} />

      <nav className="sticky top-0 z-40 border-b bg-black/90 border-gray-800 backdrop-blur-md">
        <div className="container flex items-center justify-between px-4 py-3 mx-auto">
          <div className="flex items-center gap-3">
             {/* LOGO NO NAV (FALLBACK + SVG) */}
             <div className="flex items-center justify-center w-10 h-10 border-2 rounded-full shadow-lg bg-gradient-to-br border-white/10 text-black overflow-hidden relative">
               <img 
                 src="./LogoBiduLeilaoSemFundo.png" 
                 alt="Bidu"
                  className="w-full h-full object-contain p-0.5"
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   e.currentTarget.nextSibling.style.display = 'block';
                 }}
               />
             </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider text-white">
                BIDU <span className="text-[#D4AF37]">HUNTER</span>
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                Plataforma de Monitoramento
              </span>
            </div>
          </div>

          <div className="hidden text-sm font-medium md:flex items-center gap-6">
            {user && user.email && (
              <div className="flex items-center gap-3 px-4 py-1.5 bg-gray-800/50 rounded-full border border-gray-700 animate-in slide-in-from-right-4">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D4AF37] text-black">
                  <UserIcon size={14} />
                </div>
                <span className="text-xs text-gray-300 truncate max-w-[150px]">
                  {user.email}
                </span>
                <button 
                  onClick={handleLogout} 
                  className="ml-2 text-gray-500 hover:text-red-400 transition-colors"
                  title="Sair"
                >
                  <LogOut size={14} />
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full border border-gray-700">
              <div className="flex items-center gap-2 text-[10px] font-bold text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.5)]"></div>
                SISTEMA ONLINE
              </div>
            </div>
          </div>

          <button className="text-white md:hidden text-2xl">
            <Menu />
          </button>
        </div>
      </nav>

      <main className={`flex-grow container mx-auto px-3 md:px-4 py-6 transition-all duration-500 ${showLoginModal ? 'blur-sm' : ''}`}>
        
        <StatsBoard 
          allSites={allSites} 
          filteredSites={filteredSites} 
          lastUpdate={lastDbUpdate} 
        />

        <div className="sticky top-[72px] z-30 mb-6 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center md:gap-4">
            
            <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto">
              <div className="relative col-span-2 md:w-64">
                <Search className="absolute text-gray-400 left-3 top-2.5" size={14} />
                <input 
                  type="text" 
                  placeholder="BUSCAR..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-xs font-medium uppercase placeholder-gray-400 border border-gray-300 rounded outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              <div className="relative">
                <select 
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="w-full h-9 px-2 py-2 text-xs font-bold text-gray-600 uppercase border border-gray-300 rounded outline-none cursor-pointer focus:border-[#D4AF37]"
                >
                  <option value="todos">Estado: Todos</option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                  <option value="Nacional">Nacional</option>
                </select>
              </div>

              <div className="relative">
                <select 
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full h-9 px-2 py-2 text-xs font-bold text-gray-600 uppercase border border-gray-300 rounded outline-none cursor-pointer focus:border-[#D4AF37]"
                >
                  <option value="todos">Categ: Todas</option>
                  <option value="Veículos">Veículos</option>
                  <option value="Imóveis">Imóveis</option>
                  <option value="Judicial">Judicial</option>
                  <option value="Bens Diversos">Outros</option>
                </select>
              </div>

              <div className="relative col-span-2 md:w-auto">
                 <select 
                  value={filters.dateMode}
                  onChange={(e) => handleFilterChange('dateMode', e.target.value)}
                  className="w-full h-9 px-2 py-2 text-xs font-bold text-gray-600 uppercase border border-gray-300 rounded outline-none cursor-pointer focus:border-[#D4AF37]"
                >
                  <option value="todos">📅 Qualquer Data</option>
                  <option value="hoje">🔴 Acontece Hoje</option>
                  <option value="semanas">📅 Próximas Semanas</option>
                  <option value="consulta">🕒 Sob Consulta</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 md:pt-0 md:border-t-0 md:justify-end gap-3">
              <button 
                onClick={saveUserPrefs}
                className="text-[10px] font-bold text-gray-500 hover:text-[#D4AF37] flex items-center gap-1 uppercase transition-colors"
                title="Salvar Filtro Atual"
              >
                <Filter size={12} /> Salvar Filtro
              </button>

              <div className="flex gap-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center justify-center w-9 h-9 rounded transition-all ${viewMode === 'grid' ? 'bg-[#D4AF37] text-white shadow-sm' : 'border border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                >
                  <Grid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`flex items-center justify-center w-9 h-9 rounded transition-all ${viewMode === 'list' ? 'bg-[#D4AF37] text-white shadow-sm' : 'border border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {savedFilter && (
            <div className="absolute top-[-10px] right-2 bg-green-100 text-green-700 text-[9px] px-2 py-0.5 rounded-full border border-green-200 font-bold uppercase tracking-wide shadow-sm flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
              <Check size={8} /> Filtro Salvo
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <Loader2 size={40} className="text-gray-300 animate-spin mb-4" />
             <p className="text-xs tracking-widest text-gray-400 uppercase">Sincronizando dados...</p>
          </div>
        ) : (
          <>
            {filteredSites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
                <AlertCircle size={40} className="mb-3 text-gray-300" />
                <p className="text-xs tracking-widest uppercase">Nada encontrado com estes filtros</p>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4 pb-4" 
                  : "flex flex-col gap-3 pb-4"
                }>
                  {displayedSites.map((site, index) => (
                    <AuctionCard key={`${site.url}-${index}`} data={site} viewMode={viewMode} />
                  ))}
                </div>

                {visibleCount < filteredSites.length && (
                  <div className="flex justify-center py-6">
                    <button 
                      onClick={handleLoadMore}
                      className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 text-gray-600 rounded-full text-xs font-bold uppercase shadow-sm hover:bg-gray-50 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                    >
                      Carregar Mais <ChevronDown size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

      </main>

      <footer className="py-8 mt-8 bg-black border-t border-gray-800">
        <div className="container px-4 mx-auto text-center">
          <p className="text-sm text-gray-500">© 2024 Bidu Leilões.</p>
        </div>
      </footer>
    </div>
  );
}