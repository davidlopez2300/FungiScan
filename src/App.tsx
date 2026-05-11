import { Sprout, Info, ShieldCheck, Github, ExternalLink, AlertTriangle, CheckCircle, Search, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef } from 'react';

// Types for Prediction Response
interface PredictionResult {
  prediccion: 'VENENOSO' | 'COMESTIBLE';
  confianza: number;
  nombre_comun: string;
  advertencia: string;
}

const MUSHROOMS = [
  { id: 1, name: 'Amanita phalloides', type: 'venenoso', icon: '🍄', description: 'Altamente tóxica, responsable de la mayoría de las intoxicaciones fatales.', danger: 'Crítico' },
  { id: 2, name: 'Boletus edulis', type: 'comestible', icon: '🟤', description: 'Excelente comestible, muy apreciado en la gastronomía internacional.', danger: 'Seguro' },
  { id: 3, name: 'Cantharellus cibarius', type: 'comestible', icon: '🟡', description: 'Conocido como rebozuelo, tiene un aroma afrutado y color amarillo vivo.', danger: 'Seguro' },
  { id: 4, name: 'Amanita muscaria', type: 'venenoso', icon: '🔴', description: 'Famoso hongo rojo con motas blancas, alucinógeno y tóxico.', danger: 'Alto' },
  { id: 5, name: 'Pleurotus ostreatus', type: 'comestible', icon: '🪸', description: 'Gírgola u hongo ostra, crece en troncos y es muy versátil.', danger: 'Seguro' },
  { id: 6, name: 'Cortinarius rubellus', type: 'venenoso', icon: '🟠', description: 'Contiene orellanina, toxina que ataca gravemente los riñones.', danger: 'Crítico' },
];

export default function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'todos' | 'comestible' | 'venenoso'>('todos');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setApiError(null);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  };

  const analyzeMushroom = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setApiError(null);

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch('https://blitz-casing-catalog.ngrok-free.dev', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setApiError('No se pudo conectar con el servidor de análisis. Asegúrate de que la API esté corriendo en localhost:8000');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalyzer = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setApiError(null);
  };

  return (
    <div className="relative min-h-screen text-fungi-text">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 flex items-center px-6 md:px-12 justify-between">
        <div className="flex items-center gap-2 text-2xl font-serif glow-text-green font-bold">
          <span>🍄</span>
          <span className="hidden sm:inline">FungiScan</span>
        </div>
        <div className="hidden md:flex gap-8 items-center text-sm font-medium">
          <a href="#analyzer" className="hover:text-bio-green transition-colors">Analizador</a>
          <a href="#encyclopedia" className="hover:text-bio-green transition-colors">Enciclopedia</a>
          <a href="#model" className="hover:text-bio-green transition-colors">Modelo</a>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${apiError ? 'bg-red-500 animate-pulse' : 'bg-bio-green glow-green'}`}></div>
          <span className="text-[10px] uppercase tracking-widest opacity-70">
            {apiError ? 'API Offline' : 'API Online'}
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10"
        >
          <h1 className="text-5xl md:text-8xl font-serif mb-6 leading-tight">
            ¿Es seguro <span className="text-bio-green glow-text-green italic">este hongo?</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-80 max-w-2xl mb-12 font-light">
            Inteligencia artificial avanzada para identificar hongos del bosque en tiempo real.
          </p>
          <a 
            href="#analyzer"
            className="px-10 py-4 bg-bio-green text-forest-dark font-bold rounded-full text-lg glow-green hover:scale-105 transition-all flex items-center gap-2 group"
          >
            Analizar mi hongo 
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              →
            </motion.span>
          </a>
        </motion.div>
      </section>

      {/* Analyzer Section */}
      <section id="analyzer" className="min-h-screen py-32 px-4 md:px-12 flex flex-col items-center bg-forest-dark/50">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="w-full max-w-4xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif mb-4">Laboratorio de Micología</h2>
            <p className="opacity-60">Sube una foto clara del hongo para iniciar el análisis molecular.</p>
          </div>

          <div className="glass rounded-3xl p-8 md:p-12">
            <AnimatePresence mode="wait">
              {!previewUrl ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-bio-green/30 rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer hover:border-bio-green/60 transition-all bg-bio-green/5 group"
                >
                  <Sprout className="w-20 h-20 text-bio-green mb-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                  <p className="text-lg mb-2">Arrastra tu foto aquí</p>
                  <p className="text-sm opacity-50">o haz clic para seleccionar</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-8">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-72 h-72 object-cover rounded-3xl border-4 border-bio-green/20" 
                    />
                    {!isAnalyzing && !result && (
                      <button 
                        onClick={resetAnalyzer}
                        className="absolute -top-3 -right-3 p-2 bg-red-500 rounded-full hover:scale-110 transition-all shadow-xl"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {!isAnalyzing && !result && !apiError && (
                    <button 
                      onClick={analyzeMushroom}
                      className="px-12 py-3 bg-bio-green text-forest-dark font-bold rounded-xl hover:glow-green transition-all"
                    >
                      Iniciar Análisis
                    </button>
                  )}

                  {isAnalyzing && (
                    <div className="flex flex-col items-center gap-6">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-bio-green"
                      >
                        <Sprout className="w-16 h-16" />
                      </motion.div>
                      <p className="text-bio-green glow-text-green font-mono text-sm animate-pulse tracking-widest uppercase">
                        Procesando redes neuronales...
                      </p>
                    </div>
                  )}


                  {apiError && (
                    <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md">
                      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-400 mb-6">{apiError}</p>
                      <button 
                        onClick={analyzeMushroom}
                        className="px-8 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-all"
                      >
                        Reintentar
                      </button>
                    </div>
                  )}

                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`w-full max-w-md p-8 rounded-3xl text-center relative overflow-hidden ${
                        result.prediccion === 'VENENOSO' ? 'bg-red-500/10 border border-red-500/30' : 'bg-green-500/10 border border-green-500/30'
                      }`}
                    >
                      {/* Pulse Effect */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`absolute inset-0 z-0 ${result.prediccion === 'VENENOSO' ? 'bg-red-500' : 'bg-green-500'}`}
                      />
                      
                      <div className="relative z-10">
                        <div className={`mb-4 inline-block p-4 rounded-full ${result.prediccion === 'VENENOSO' ? 'bg-red-500/20 glow-red' : 'bg-green-500/20 glow-green'}`}>
                          {result.prediccion === 'VENENOSO' ? <AlertTriangle className="w-12 h-12 text-red-500" /> : <ShieldCheck className="w-12 h-12 text-green-500" />}
                        </div>
                        
                        <h3 className={`text-4xl font-bold mb-2 ${result.prediccion === 'VENENOSO' ? 'text-red-500' : 'text-green-500'}`}>
                          {result.prediccion === 'VENENOSO' ? '⚠️ VENENOSO' : '✅ COMESTIBLE'}
                        </h3>
                        <p className="text-xl italic mb-4 font-serif">{result.nombre_comun}</p>
                        
                        <div className="mb-6">
                            <div className="flex justify-between text-xs mb-1 opacity-60 uppercase tracking-widest">
                                <span>Confianza</span>
                                <span>{Math.round(result.confianza * 100)}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${result.confianza * 100}%` }}
                                    className={`h-full ${result.prediccion === 'VENENOSO' ? 'bg-red-500' : 'bg-green-500'}`}
                                />
                            </div>
                        </div>

                        <p className="text-sm border-t border-white/10 pt-4 opacity-80 leading-relaxed">
                          {result.advertencia}
                        </p>

                        <button 
                          onClick={resetAnalyzer}
                          className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm"
                        >
                          Analizar otra foto
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* Encyclopedia Section */}
      <section id="encyclopedia" className="min-h-screen py-32 px-4 md:px-12 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Enciclopedia Fúngica</h2>
              <p className="opacity-60 max-w-lg">Explora las especies más comunes del bosque y aprende a distinguirlas.</p>
            </div>
            <div className="flex gap-2 p-1 bg-white/5 rounded-full border border-white/10">
              {(['todos', 'comestible', 'venenoso'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition-all ${filter === t ? 'bg-bio-green text-forest-dark' : 'hover:bg-white/5'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MUSHROOMS.filter(m => filter === 'todos' || m.type === filter).map((m) => (
              <motion.div 
                layout
                key={m.id}
                className="glass p-6 rounded-3xl hover:bg-white/[0.08] transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform">{m.icon}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${m.type === 'venenoso' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {m.danger}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{m.name}</h3>
                <p className="text-sm opacity-60 leading-relaxed h-12 line-clamp-2">
                  {m.description}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                  <button className="text-bio-green text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver ficha <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Info Section */}
      <section id="model" className="py-32 px-4 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4">Arquitectura del Cerebro</h2>
            <p className="opacity-60">Implementación técnica y entrenamiento de la red neuronal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Precisión', val: '92%', icon: CheckCircle },
              { label: 'Dataset', val: '10k+', icon: Search },
              { label: 'Clases', val: 'Binario', icon: Info },
            ].map((stat, i) => (
              <div key={i} className="glass p-8 rounded-3xl text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-bio-green" />
                <p className="text-xs opacity-50 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="glass p-8 md:p-12 rounded-3xl border-l-4 border-l-bio-green">
            <h3 className="text-2xl mb-6 font-serif">Pipeline de Datos</h3>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-sm opacity-80">
              <span className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">Google Colab</span>
              <span className="text-bio-green">→</span>
              <span className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">EfficientNetB0</span>
              <span className="text-bio-green">→</span>
              <span className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">FastAPI</span>
              <span className="text-bio-green">→</span>
              <span className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">React Frontend</span>
            </div>
          </div>

          <div className="mt-12 p-8 bg-red-500/10 border border-red-500/30 rounded-3xl">
              <div className="flex gap-4">
                  <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
                  <div>
                      <h4 className="font-bold text-red-500 mb-2">DISCLAIMER LEGAL</h4>
                      <p className="text-sm leading-relaxed opacity-90">
                        Esta herramienta es solo un apoyo educativo basado en visión artificial. 
                        No reemplaza la consulta con un experto micólogo. Nunca consumas un hongo 
                        basándote únicamente en este resultado. La identificación errónea de hongos 
                        puede resultar en una intoxicación grave o la muerte.
                      </p>
                  </div>
              </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center bg-black/40">
        <div className="flex flex-col items-center gap-6">
          <div className="font-serif glow-text-green text-xl">🍄 FungiScan</div>
          <p className="opacity-40 text-sm">Creado con TensorFlow y amor por los hongos · 2024</p>
          <div className="flex gap-6 opacity-60 hover:opacity-100 transition-opacity">
            <a href="#" className="hover:text-bio-green"><Github className="w-5 h-5" /></a>
            <a href="#" className="hover:text-bio-green flex items-center gap-2 text-xs font-bold">API DOCS</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
