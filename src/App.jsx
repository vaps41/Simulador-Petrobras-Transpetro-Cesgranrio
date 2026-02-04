import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, XCircle, BookOpen, BarChart2, Award, 
  ChevronRight, RefreshCw, AlertCircle, Briefcase, Zap, 
  History, GraduationCap, PlayCircle, Trash2 
} from 'lucide-react';

// --- CONFIGURAÇÃO DE CARGOS E ÊNFASES ---
const ROLES = [
  { id: 'eng_petroleo', label: 'Engenharia de Petróleo' },
  { id: 'eng_eletrica', label: 'Engenharia Elétrica' },
  { id: 'tec_eletrica', label: 'Técnico de Manutenção - Elétrica' },
  { id: 'tec_seguranca', label: 'Técnico de Segurança do Trabalho' },
  { id: 'administracao', label: 'Administração' },
  { id: 'tec_operacao', label: 'Técnico de Operação (Júnior)' }
];

// --- BANCO DE QUESTÕES ---
const QUESTION_BANK = [
  // --- CONHECIMENTOS BÁSICOS (COMUNS A TODOS) ---
  {
    id: 1,
    subject: 'Língua Portuguesa',
    role: 'global',
    topic: 'Crase',
    question: 'De acordo com a norma-padrão da língua portuguesa, o sinal indicativo de crase deve ser empregado obrigatoriamente em:',
    options: [
      'O gerente referiu-se a todas as candidatas.',
      'A empresa começou a selecionar os currículos.',
      'O acesso a sala de reuniões estava bloqueado.',
      'Ficamos cara a cara com o diretor.',
      'O documento foi enviado a Vossa Senhoria.'
    ],
    correctIndex: 2,
    explanation: 'Em "O acesso à sala", ocorre a fusão da preposição "a" (regida por acesso) com o artigo "a".'
  },
  {
    id: 2,
    subject: 'Língua Portuguesa',
    role: 'global',
    topic: 'Concordância Verbal',
    question: 'A concordância verbal está plenamente respeitada na seguinte frase:',
    options: [
      'Fazem cinco anos que a empresa mudou de sede.',
      'Houveram muitos problemas durante a perfuração.',
      'Aluga-se apartamentos para os novos funcionários.',
      'Mais de um engenheiro analisaram o projeto.',
      'Tanto o gerente quanto o diretor aprovaram a medida.'
    ],
    correctIndex: 4,
    explanation: 'Sujeito composto ligado por "tanto... quanto" leva o verbo para o plural.'
  },
  {
    id: 3,
    subject: 'Matemática / Raciocínio Lógico',
    role: 'global',
    topic: 'Probabilidade',
    question: 'Em um lote de 100 peças, sabe-se que 10 são defeituosas. Retirando-se uma peça, qual a probabilidade de ela NÃO ser defeituosa?',
    options: ['10%', '50%', '80%', '90%', '95%'],
    correctIndex: 3,
    explanation: '90 peças boas em 100 totais = 90%.'
  },

  // --- CONHECIMENTOS ESPECÍFICOS: ENGENHARIA ELÉTRICA ---
  {
    id: 501,
    subject: 'Conhecimentos Específicos',
    role: 'eng_eletrica',
    topic: 'Circuitos Elétricos',
    question: 'Para obter a máxima transferência de potência de uma fonte para uma carga resistiva, a resistência da carga deve ser:',
    options: [
      'Nula (curto-circuito).',
      'Infinita (circuito aberto).',
      'Igual à resistência interna da fonte (Teorema da Máxima Transferência de Potência).',
      'A metade da resistência interna da fonte.',
      'O dobro da resistência interna da fonte.'
    ],
    correctIndex: 2,
    explanation: 'O Teorema da Máxima Transferência de Potência afirma que a potência máxima é transferida quando a resistência da carga é igual à resistência de Thévenin (interna) da fonte.'
  },
  {
    id: 502,
    subject: 'Conhecimentos Específicos',
    role: 'eng_eletrica',
    topic: 'Máquinas Elétricas (Motores de Indução)',
    question: 'O escorregamento (slip) de um motor de indução trifásico operando a vazio é aproximadamente:',
    options: [
      '1 (100%)',
      '0,5 (50%)',
      'Próximo de zero',
      'Negativo',
      'Infinito'
    ],
    correctIndex: 2,
    explanation: 'A vazio, a velocidade do rotor é muito próxima da velocidade síncrona, resultando em um escorregamento muito pequeno, próximo de zero.'
  },
  {
    id: 503,
    subject: 'Conhecimentos Específicos',
    role: 'eng_eletrica',
    topic: 'Sistemas de Potência',
    question: 'O Fator de Potência (FP) baixo em uma instalação industrial causa:',
    options: [
      'Redução da corrente nos condutores.',
      'Aumento da capacidade disponível dos transformadores.',
      'Aumento das perdas por efeito Joule e queda de tensão.',
      'Redução da conta de energia elétrica sem multas.',
      'Melhoria na regulação de tensão.'
    ],
    correctIndex: 2,
    explanation: 'Um FP baixo implica em uma corrente maior para a mesma potência ativa, aumentando as perdas (R*I²) e as quedas de tensão na rede.'
  },

  // --- CONHECIMENTOS ESPECÍFICOS: TÉCNICO DE MANUTENÇÃO ELÉTRICA ---
  {
    id: 601,
    subject: 'Conhecimentos Específicos',
    role: 'tec_eletrica',
    topic: 'Lei de Ohm',
    question: 'Um chuveiro elétrico tem resistência de 10 ohms e é ligado em uma tensão de 220V. Qual é a corrente elétrica que circula por ele?',
    options: [
      '10 A',
      '11 A',
      '20 A',
      '22 A',
      '2200 A'
    ],
    correctIndex: 3,
    explanation: 'Pela Lei de Ohm: I = V / R. Logo, I = 220 / 10 = 22 Amperes.'
  },
  {
    id: 602,
    subject: 'Conhecimentos Específicos',
    role: 'tec_eletrica',
    topic: 'Comandos Elétricos',
    question: 'Qual é a principal função do relé térmico (bimetálico) em um painel de comando de motor?',
    options: [
      'Proteger contra curto-circuito.',
      'Proteger contra sobrecarga.',
      'Seccionar o circuito para manutenção.',
      'Medir a tensão da rede.',
      'Realizar a partida suave do motor.'
    ],
    correctIndex: 1,
    explanation: 'O relé térmico protege o motor contra sobrecargas (aumento gradual de corrente acima do nominal), enquanto disjuntores ou fusíveis protegem contra curto-circuito.'
  },
  {
    id: 603,
    subject: 'Conhecimentos Específicos',
    role: 'tec_eletrica',
    topic: 'NR-10 (Segurança)',
    question: 'Segundo a NR-10, as vestimentas de trabalho adequadas para atividades em instalações elétricas devem:',
    options: [
      'Ser de tecido sintético comum.',
      'Conter adornos metálicos para facilitar a identificação.',
      'Ser adequadas às atividades e contemplar a condutibilidade, inflamabilidade e influências eletromagnéticas.',
      'Ser utilizadas apenas em alta tensão.',
      'Ser substituídas apenas a cada 5 anos.'
    ],
    correctIndex: 2,
    explanation: 'A NR-10 proíbe adornos pessoais e exige vestimentas que não sejam inflamáveis e que protejam contra arco elétrico.'
  },

  // --- OUTROS CARGOS ---
  {
    id: 101,
    subject: 'Conhecimentos Específicos',
    role: 'eng_petroleo',
    topic: 'Propriedades dos Fluidos',
    question: 'O fator volume formação óleo (Bo) é definido como:',
    options: [
      'A razão entre o volume de óleo nas condições de reservatório e o volume de óleo nas condições padrão.',
      'A viscosidade do óleo no reservatório dividida pela viscosidade na superfície.',
      'A razão entre o gás dissolvido e o óleo produzido.',
      'O volume de água produzido junto com o óleo.',
      'A densidade do óleo API.'
    ],
    correctIndex: 0,
    explanation: 'Bo é a relação entre o volume que uma massa de óleo ocupa nas condições de pressão e temperatura do reservatório e o volume que ocupa nas condições standard (superfície).'
  },
  {
    id: 401,
    subject: 'Conhecimentos Específicos',
    role: 'tec_operacao',
    topic: 'Termodinâmica',
    question: 'Em uma coluna de destilação, os componentes mais voláteis tendem a:',
    options: [
      'Sair pelo fundo da coluna.',
      'Ficar retidos no meio da coluna.',
      'Sair pelo topo da coluna.',
      'Solidificar nas bandejas.',
      'Não se separar.'
    ],
    correctIndex: 2,
    explanation: 'Componentes mais voláteis têm menor ponto de ebulição e tendem a subir para o topo da coluna na fase vapor.'
  }
];

// --- COMPONENTES ---

const WelcomeScreen = ({ onStart, history, onClearHistory }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [mode, setMode] = useState('simulado'); // 'simulado' | 'estudo'
  const [selectedSubjects, setSelectedSubjects] = useState({
    'Língua Portuguesa': true,
    'Matemática / Raciocínio Lógico': true,
    'Conhecimentos Específicos': true
  });
  const [numQuestions, setNumQuestions] = useState(5);

  const toggleSubject = (subject) => {
    setSelectedSubjects(prev => ({ ...prev, [subject]: !prev[subject] }));
  };

  const handleStart = () => {
    if (!selectedRole) return alert("Por favor, selecione o Cargo/Ênfase.");
    const activeSubjects = Object.keys(selectedSubjects).filter(k => selectedSubjects[k]);
    if (activeSubjects.length === 0) return alert("Selecione pelo menos uma disciplina.");
    onStart(selectedRole, activeSubjects, numQuestions, mode);
  };

  const isElectricRole = selectedRole.includes('eletrica');
  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length) 
    : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 md:p-6">
      <div className={`bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-5xl w-full border-t-8 ${isElectricRole ? 'border-yellow-400' : 'border-green-600'} flex flex-col md:flex-row gap-8`}>
        
        {/* COLUNA ESQUERDA - CONFIGURAÇÃO */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center space-x-4 mb-2">
            {/* LOGO DA EMPRESA */}
            <div className="flex-shrink-0">
               <img 
                 src="../logo-simulpetro.png" 
                 alt="Logo Simulado Petrobras" 
                 className="h-20 w-auto object-contain" 
                 onError={(e) => {
                   // Fallback se a imagem não carregar: mostra o ícone antigo
                   e.target.style.display = 'none';
                   e.target.nextSibling.style.display = 'flex';
                 }}
               />
               <div className={`hidden ${isElectricRole ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-700'} p-3 rounded-2xl`}>
                  {isElectricRole ? <Zap className="w-8 h-8" /> : <Award className="w-8 h-8" />}
               </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Simulado Petrobras</h1>
              <p className="text-gray-400 text-sm font-medium">Focado na Banca Cesgranrio</p>
            </div>
          </div>

          <div className="space-y-4">
             {/* CARGO */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center">
                <Briefcase className="w-3 h-3 mr-1" /> Cargo / Ênfase
              </label>
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="" disabled>Selecione seu cargo...</option>
                {ROLES.map(role => (
                  <option key={role.id} value={role.id}>{role.label}</option>
                ))}
              </select>
            </div>

            {/* MODO DE JOGO - NOVIDADE */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setMode('simulado')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${mode === 'simulado' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}
              >
                <Clock className="w-5 h-5 mb-1" />
                <span className="font-bold text-sm">Modo Simulado</span>
                <span className="text-xs opacity-75">Tempo & Nota Final</span>
              </button>
              <button 
                onClick={() => setMode('estudo')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${mode === 'estudo' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}
              >
                <GraduationCap className="w-5 h-5 mb-1" />
                <span className="font-bold text-sm">Modo Estudo</span>
                <span className="text-xs opacity-75">Feedback Imediato</span>
              </button>
            </div>

            {/* DISCIPLINAS */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center">
                <BookOpen className="w-3 h-3 mr-1" /> Disciplinas
              </label>
              <div className="space-y-2">
                {Object.keys(selectedSubjects).map(subject => (
                  <label key={subject} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-slate-100 rounded">
                    <input 
                      type="checkbox" 
                      checked={selectedSubjects[subject]} 
                      onChange={() => toggleSubject(subject)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-gray-700 text-sm">
                      {subject === 'Conhecimentos Específicos' && selectedRole 
                        ? `Específicos (${ROLES.find(r => r.id === selectedRole).label})` 
                        : subject}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* SLIDER */}
            <div>
               <div className="flex justify-between text-sm text-gray-600 mb-2 font-medium">
                 <span>Questões: {numQuestions}</span>
               </div>
               <input 
                  type="range" min="3" max="10" value={numQuestions} 
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
            </div>

            <button 
              onClick={handleStart}
              disabled={!selectedRole}
              className={`w-full py-4 rounded-xl shadow-lg font-bold flex items-center justify-center text-lg transition-all
                ${!selectedRole 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-gray-900 hover:bg-black text-white transform hover:scale-[1.02]'}`}
            >
              {mode === 'simulado' ? 'Iniciar Prova' : 'Iniciar Estudos'} <PlayCircle className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>

        {/* COLUNA DIREITA - ESTATÍSTICAS (DASHBOARD) */}
        <div className="md:w-80 bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-700 flex items-center"><History className="w-4 h-4 mr-2"/> Seu Histórico</h3>
            {history.length > 0 && (
              <button onClick={onClearHistory} className="text-xs text-red-500 hover:underline flex items-center">
                <Trash2 className="w-3 h-3 mr-1"/> Limpar
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 text-center">
              <span className="block text-2xl font-bold text-gray-800">{history.length}</span>
              <span className="text-xs text-gray-500 uppercase font-bold">Testes</span>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 text-center">
              <span className={`block text-2xl font-bold ${averageScore >= 70 ? 'text-green-600' : averageScore >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                {averageScore}%
              </span>
              <span className="text-xs text-gray-500 uppercase font-bold">Média</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2 pr-1 custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8 italic">
                Nenhum teste realizado ainda.
              </div>
            ) : (
              history.slice().reverse().map((h, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-gray-700">{h.score}% de acerto</span>
                    <span className="text-xs text-gray-400">{new Date(h.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{h.role || 'Geral'}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block mt-1 ${h.mode === 'estudo' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {h.mode === 'estudo' ? 'Estudo' : 'Simulado'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuizScreen = ({ questions, onFinish, roleName, mode }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(mode === 'simulado' ? questions.length * 150 : 0);
  // Estados para modo estudo
  const [studyModeAnswered, setStudyModeAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  useEffect(() => {
    let timer;
    if (mode === 'simulado') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onFinish(answers);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // No modo estudo, o tempo conta pra cima (opcional, aqui deixei estático ou progressivo)
    }
    return () => clearInterval(timer);
  }, [answers, onFinish, mode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (optionIndex) => {
    if (mode === 'estudo' && studyModeAnswered) return; // Trava resposta se já respondeu

    const newAnswers = { ...answers, [currentQuestion.id]: optionIndex };
    setAnswers(newAnswers);

    if (mode === 'estudo') {
      setStudyModeAnswered(true);
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      // Resetar estados do modo estudo
      setStudyModeAnswered(false);
      setShowExplanation(false);
    } else {
      onFinish(answers);
    }
  };

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className={`bg-white shadow-sm p-4 sticky top-0 z-10 border-b-4 ${mode === 'estudo' ? 'border-blue-400' : 'border-yellow-400'}`}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
             <img src="../logo-simulpetro.png" className="h-8 w-auto mr-3 hidden md:block opacity-80" alt="Logo" onError={(e) => e.target.style.display='none'}/>
             <div>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">{roleName}</span>
               <span className="font-bold text-gray-800 text-lg">Questão {currentQuestionIndex + 1} <span className="text-gray-400 text-sm">/ {totalQuestions}</span></span>
             </div>
          </div>
          {mode === 'simulado' && (
            <div className={`flex items-center font-mono font-bold px-4 py-2 rounded-lg bg-gray-50 border ${timeLeft < 60 ? 'text-red-600 border-red-200 animate-pulse' : 'text-gray-700 border-gray-200'}`}>
              <Clock className="w-5 h-5 mr-2" />
              {formatTime(timeLeft)}
            </div>
          )}
          {mode === 'estudo' && (
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wide">
              Modo Estudo
            </div>
          )}
        </div>
        <div className="w-full bg-gray-200 h-1 mt-4 absolute bottom-0 left-0">
          <div 
            className={`${mode === 'estudo' ? 'bg-blue-500' : 'bg-yellow-500'} h-1 transition-all duration-300`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 pb-32">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 animate-fade-in">
          <div className="flex items-center mb-6">
             <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full uppercase tracking-wide border border-slate-200">
               {currentQuestion.subject === 'Conhecimentos Específicos' ? 'Específicos' : currentQuestion.subject}
             </span>
             <span className="mx-2 text-gray-300">•</span>
             <span className="text-sm text-gray-500 font-medium">{currentQuestion.topic}</span>
          </div>
          
          <h2 className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed mb-8">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.id] === idx;
              const isCorrect = idx === currentQuestion.correctIndex;
              
              // Lógica de cores para Modo Estudo
              let borderClass = 'border-gray-200 hover:border-gray-400 hover:bg-gray-50';
              let bgClass = 'bg-white';
              let iconBg = 'bg-white border-gray-300 text-gray-400';
              
              if (mode === 'estudo' && studyModeAnswered) {
                if (isCorrect) {
                  borderClass = 'border-green-500 bg-green-50'; // Sempre mostra a correta
                  iconBg = 'bg-green-500 border-green-500 text-white';
                } else if (isSelected && !isCorrect) {
                  borderClass = 'border-red-500 bg-red-50'; // Mostra o erro
                  iconBg = 'bg-red-500 border-red-500 text-white';
                } else {
                  borderClass = 'border-gray-100 opacity-50'; // Apaga as outras
                }
              } else if (isSelected) {
                // Modo Simulado (apenas selecionado)
                borderClass = 'border-gray-800 bg-gray-50 ring-1 ring-gray-800';
                iconBg = 'bg-gray-800 border-gray-800 text-white';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={mode === 'estudo' && studyModeAnswered}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start group relative overflow-hidden ${borderClass} ${bgClass}`}
                >
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 mr-4 font-bold text-sm transition-colors ${iconBg}`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`text-gray-700 text-base mt-1 ${isSelected ? 'font-medium' : ''}`}>
                    {option}
                  </span>
                  {mode === 'estudo' && studyModeAnswered && isCorrect && (
                    <CheckCircle className="absolute right-4 top-4 text-green-600 w-6 h-6" />
                  )}
                  {mode === 'estudo' && studyModeAnswered && isSelected && !isCorrect && (
                    <XCircle className="absolute right-4 top-4 text-red-500 w-6 h-6" />
                  )}
                </button>
              );
            })}
          </div>

          {/* EXPLICAÇÃO NO MODO ESTUDO */}
          {mode === 'estudo' && showExplanation && (
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 animate-fade-in-up">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Comentário do Professor</h4>
                  <p className="text-blue-800 text-sm leading-relaxed">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 p-4 fixed bottom-0 w-full z-20">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0 || (mode === 'estudo')}
            className={`px-6 py-3 rounded-lg font-medium transition ${currentQuestionIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Anterior
          </button>

          {/* Botão de Avançar com lógica diferente para estudo */}
          <button 
            onClick={handleNext}
            disabled={mode === 'estudo' && !studyModeAnswered}
            className={`px-8 py-3 rounded-lg font-bold shadow-lg transition flex items-center
              ${mode === 'estudo' && !studyModeAnswered 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-900 text-white hover:bg-black'}`}
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Finalizar' : 'Próxima'}
            {currentQuestionIndex < totalQuestions - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </footer>
    </div>
  );
};

const ResultScreen = ({ questions, userAnswers, onRetry, roleName, mode }) => {
  const correctCount = questions.reduce((acc, q) => {
    return acc + (userAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);
  
  const score = Math.round((correctCount / questions.length) * 100);
  
  let feedback = "";
  if (score >= 80) feedback = "Excelente! Desempenho de aprovado.";
  else if (score >= 50) feedback = "Bom, mas precisa revisar os erros.";
  else feedback = "Atenção! Reforce os estudos nas específicas.";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="bg-gradient-to-r from-gray-900 to-slate-800 text-white p-8 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0 text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-2 opacity-80">
                      <span className="uppercase tracking-widest text-xs font-bold">Resultado</span>
                      <span className="px-2 py-0.5 rounded bg-white/20 text-[10px]">{mode === 'estudo' ? 'MODO ESTUDO' : 'SIMULADO'}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start space-x-4 mb-2">
                       <img src="../logo-simulpetro.png" className="h-10 w-auto bg-white/10 rounded p-1" alt="Logo" onError={(e) => e.target.style.display='none'} />
                       <h1 className="text-3xl font-bold text-yellow-400">{roleName}</h1>
                    </div>
                    <p className="text-slate-300">{feedback}</p>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-5xl font-bold">{score}%</span>
                    <span className="text-sm opacity-60">de acerto</span>
                </div>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-center">
            <button 
              onClick={onRetry}
              className="inline-flex items-center px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 font-medium transition"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Voltar ao Início
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-700 ml-2">Revisão Detalhada</h3>
          {questions.map((q, index) => {
            const userAnswer = userAnswers[q.id];
            const isCorrect = userAnswer === q.correctIndex;

            return (
              <div key={q.id} className={`bg-white rounded-xl shadow-sm border ${isCorrect ? 'border-green-200' : 'border-red-200'} overflow-hidden`}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{q.subject}</span>
                        <span className="text-sm font-semibold text-gray-600">{q.topic}</span>
                    </div>
                    {isCorrect ? (
                      <span className="flex items-center text-green-700 font-bold text-xs bg-green-100 px-3 py-1 rounded-full"><CheckCircle className="w-3 h-3 mr-1"/> ACERTOU</span>
                    ) : (
                      <span className="flex items-center text-red-700 font-bold text-xs bg-red-100 px-3 py-1 rounded-full"><XCircle className="w-3 h-3 mr-1"/> {userAnswer === undefined ? 'PULOU' : 'ERROU'}</span>
                    )}
                  </div>
                  
                  <p className="text-gray-800 font-medium mb-4">{q.question}</p>
                  
                  <div className="space-y-2 mb-6">
                    {q.options.map((opt, idx) => {
                      let style = "p-3 rounded-lg border text-sm flex ";
                      if (idx === q.correctIndex) {
                        style += "bg-green-50 border-green-200 text-green-900 font-medium";
                      } else if (idx === userAnswer && !isCorrect) {
                        style += "bg-red-50 border-red-200 text-red-900 opacity-70";
                      } else {
                        style += "bg-white border-transparent text-gray-400";
                      }
                      
                      return (
                        <div key={idx} className={style}>
                          <span className="mr-3 font-bold w-4">{String.fromCharCode(65 + idx)})</span> 
                          <span>{opt}</span>
                          {idx === q.correctIndex && <CheckCircle className="w-4 h-4 ml-auto text-green-600" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-start text-sm text-slate-700">
                      <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 text-slate-400 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block mb-1">Explicação:</span>
                        {q.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentRoleName, setCurrentRoleName] = useState('');
  const [currentMode, setCurrentMode] = useState('simulado');
  
  // PERSISTÊNCIA DE HISTÓRICO
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('simulpetro_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('simulpetro_history', JSON.stringify(history));
  }, [history]);

  const clearHistory = () => {
    if (confirm("Tem certeza que deseja apagar todo o histórico?")) {
      setHistory([]);
    }
  };

  const startQuiz = (roleId, subjects, num, mode) => {
    const roleLabel = ROLES.find(r => r.id === roleId)?.label;
    setCurrentRoleName(roleLabel);
    setCurrentMode(mode);

    // FILTRO INTELIGENTE
    let filtered = QUESTION_BANK.filter(q => {
      const isSubjectSelected = subjects.includes(q.subject);
      if (q.subject === 'Conhecimentos Específicos') {
        return isSubjectSelected && q.role === roleId;
      }
      return isSubjectSelected && q.role === 'global';
    });

    if (filtered.length === 0) {
      alert("Não há questões suficientes para os filtros selecionados.");
      return;
    }

    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, num);
    
    setActiveQuestions(selected);
    setUserAnswers({});
    setScreen('quiz');
  };

  const finishQuiz = (answers) => {
    // Salvar histórico
    const correctCount = activeQuestions.reduce((acc, q) => {
      return acc + (answers[q.id] === q.correctIndex ? 1 : 0);
    }, 0);
    const score = Math.round((correctCount / activeQuestions.length) * 100);
    
    const newRecord = {
      date: new Date().toISOString(),
      score,
      role: currentRoleName,
      mode: currentMode
    };
    
    setHistory(prev => [...prev, newRecord]);
    
    setUserAnswers(answers);
    setScreen('result');
  };

  return (
    <div className="font-sans text-gray-900 antialiased">
      {screen === 'welcome' && <WelcomeScreen onStart={startQuiz} history={history} onClearHistory={clearHistory} />}
      {screen === 'quiz' && <QuizScreen questions={activeQuestions} onFinish={finishQuiz} roleName={currentRoleName} mode={currentMode} />}
      {screen === 'result' && <ResultScreen questions={activeQuestions} userAnswers={userAnswers} onRetry={() => setScreen('welcome')} roleName={currentRoleName} mode={currentMode} />}
    </div>
  );
}
