// AI Learning Dashboard - Komplett læringssystem for AI
'use client';

import { useState, useEffect } from 'react';
import { 
  Brain, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  TrendingUp,
  BookOpen,
  Users,
  Zap,
  BarChart3,
  AlertCircle,
  Clock,
  Target
} from 'lucide-react';

export default function AILearningDashboard({ orgId }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState(null);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [correctionsQueue, setCorrectionsQueue] = useState([]);
  const [trainingConversations, setTrainingConversations] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orgId) {
      loadDashboardData();
    }
  }, [orgId]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Last alle data parallelt
      const [metricsRes, questionsRes, correctionsRes, trainingRes, knowledgeRes] = await Promise.all([
        fetch(`/api/orgs/${orgId}/ai/metrics?granularity=daily`),
        fetch(`/api/orgs/${orgId}/ai/followup-questions?status=pending`),
        fetch(`/api/orgs/${orgId}/ai/corrections?status=pending`),
        fetch(`/api/orgs/${orgId}/ai/training/conversations?status=pending&limit=10`),
        fetch(`/api/orgs/${orgId}/ai/knowledge?status=active&limit=10`)
      ]);

      const [metricsData, questionsData, correctionsData, trainingData, knowledgeData] = await Promise.all([
        metricsRes.json(),
        questionsRes.json(),
        correctionsRes.json(),
        trainingRes.json(),
        knowledgeRes.json()
      ]);

      setMetrics(metricsData.summary || {});
      setFollowUpQuestions(questionsData.data || []);
      setCorrectionsQueue(correctionsData.data || []);
      setTrainingConversations(trainingData.data || []);
      setKnowledgeBase(knowledgeData.data || []);
    } catch (error) {
      console.error('Feil ved lasting av dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const answerFollowUpQuestion = async (questionId, answer) => {
    try {
      const res = await fetch(`/api/orgs/${orgId}/ai/followup-questions/${questionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer })
      });

      if (res.ok) {
        await loadDashboardData();
        alert('✅ Svar lagret! AI-en har lært noe nytt.');
      }
    } catch (error) {
      console.error('Feil ved lagring av svar:', error);
      alert('❌ Kunne ikke lagre svar');
    }
  };

  const approveTraining = async (trainingId) => {
    try {
      const res = await fetch(`/api/orgs/${orgId}/ai/training/${trainingId}/approve`, {
        method: 'POST'
      });

      if (res.ok) {
        await loadDashboardData();
        alert('✅ AI sitt svar godkjent!');
      }
    } catch (error) {
      console.error('Feil ved godkjenning:', error);
    }
  };

  const correctTraining = async (trainingId, correctAnswer, feedback) => {
    try {
      const res = await fetch(`/api/orgs/${orgId}/ai/training/${trainingId}/correct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correctAnswer, correctionFeedback: feedback })
      });

      if (res.ok) {
        await loadDashboardData();
        alert('✅ Korreksjon lagret! AI-en lærer av feilen.');
      }
    } catch (error) {
      console.error('Feil ved korreksjon:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Laster AI læringssystem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Brain className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-bold">AI Læringssystem</h1>
            <p className="text-blue-100">
              Din AI lærer seg både LYX sine mønstre og din bedrifts kunnskap
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <div className="text-sm text-blue-100">Nøyaktighet</div>
            <div className="text-2xl font-bold">{metrics?.accuracy || 0}%</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <div className="text-sm text-blue-100">Samtaler</div>
            <div className="text-2xl font-bold">{metrics?.totalConversations || 0}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <div className="text-sm text-blue-100">Korrekte svar</div>
            <div className="text-2xl font-bold">{metrics?.correctResponses || 0}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <div className="text-sm text-blue-100">Lært</div>
            <div className="text-2xl font-bold">{metrics?.knowledgeLearned || 0} ting</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Oversikt', icon: BarChart3 },
              { id: 'questions', label: 'Spørsmål fra AI', icon: HelpCircle, badge: followUpQuestions.length },
              { id: 'training', label: 'Treningssamtaler', icon: MessageSquare, badge: trainingConversations.length },
              { id: 'corrections', label: 'Korreksjoner', icon: AlertCircle, badge: correctionsQueue.length },
              { id: 'knowledge', label: 'Kunnskapsbase', icon: BookOpen }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors relative
                  ${activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {tab.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">AI Læringsoversikt</h2>

              {/* Performance Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <span className="text-3xl font-bold text-green-600">{metrics?.accuracy || 0}%</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">AI Nøyaktighet</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {metrics?.correctResponses || 0} av {(metrics?.correctResponses || 0) + (metrics?.incorrectResponses || 0)} svar var korrekte
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Brain className="w-8 h-8 text-blue-600" />
                    <span className="text-3xl font-bold text-blue-600">{metrics?.knowledgeLearned || 0}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Nye ting lært</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    AI-en har lært {metrics?.knowledgeLearned || 0} nye ting om din bedrift
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8 text-purple-600" />
                    <span className="text-3xl font-bold text-purple-600">{metrics?.bookingsCompleted || 0}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Bookinger fullført</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    AI-en har hjulpet med {metrics?.bookingsCompleted || 0} bookinger
                  </p>
                </div>
              </div>

              {/* Pending Actions */}
              {(followUpQuestions.length > 0 || correctionsQueue.length > 0 || trainingConversations.length > 0) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                    <h3 className="font-semibold text-gray-900">Handlinger som venter</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {followUpQuestions.length > 0 && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center gap-3">
                          <HelpCircle className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-900">AI har <strong>{followUpQuestions.length}</strong> spørsmål til deg</span>
                        </div>
                        <button 
                          onClick={() => setActiveTab('questions')}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Svar nå →
                        </button>
                      </div>
                    )}

                    {trainingConversations.length > 0 && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-5 h-5 text-purple-600" />
                          <span className="text-gray-900"><strong>{trainingConversations.length}</strong> samtaler trenger gjennomgang</span>
                        </div>
                        <button 
                          onClick={() => setActiveTab('training')}
                          className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Gå gjennom →
                        </button>
                      </div>
                    )}

                    {correctionsQueue.length > 0 && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center gap-3">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="text-gray-900"><strong>{correctionsQueue.length}</strong> feil må rettes</span>
                        </div>
                        <button 
                          onClick={() => setActiveTab('corrections')}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Fiks nå →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* How It Works */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Hvordan AI-en lærer</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">LYX Mønstre</h4>
                      <p className="text-sm text-gray-600">
                        AI-en følger alltid LYX sine beprøvde kommunikasjonsmønstre og beste praksis
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Din Bedrift</h4>
                      <p className="text-sm text-gray-600">
                        AI-en lærer åpningstider, priser, tjenester og alt om din spesifikke bedrift
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Kontinuerlig Forbedring</h4>
                      <p className="text-sm text-gray-600">
                        Hver samtale gjør AI-en smartere - den lærer av både suksesser og feil
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <QuestionsTab
              questions={followUpQuestions}
              onAnswer={answerFollowUpQuestion}
            />
          )}

          {/* Training Tab */}
          {activeTab === 'training' && (
            <TrainingTab
              conversations={trainingConversations}
              onApprove={approveTraining}
              onCorrect={correctTraining}
            />
          )}

          {/* Corrections Tab */}
          {activeTab === 'corrections' && (
            <CorrectionsTab corrections={correctionsQueue} />
          )}

          {/* Knowledge Tab */}
          {activeTab === 'knowledge' && (
            <KnowledgeTab knowledge={knowledgeBase} orgId={orgId} />
          )}
        </div>
      </div>
    </div>
  );
}

// Questions Tab Component
function QuestionsTab({ questions, onAnswer }) {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (selectedQuestion && answer.trim()) {
      onAnswer(selectedQuestion.id, answer);
      setSelectedQuestion(null);
      setAnswer('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Spørsmål fra AI</h2>
        <p className="text-gray-600 mt-1">
          AI-en stiller spørsmål for å lære mer om din bedrift. Svar så godt du kan.
        </p>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Ingen spørsmål akkurat nå</p>
          <p className="text-sm text-gray-500 mt-1">AI-en vil stille spørsmål etter hvert som den lærer</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map(q => (
            <div key={q.id} className="bg-white border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">AI spør:</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{q.question_text}</h3>
                  {q.question_context && (
                    <p className="text-sm text-gray-500 mt-2">
                      Kontekst: {q.question_context}
                    </p>
                  )}
                  {q.question_purpose && (
                    <p className="text-sm text-gray-600 mt-1 italic">
                      Hvorfor AI spør: {q.question_purpose}
                    </p>
                  )}
                </div>
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>

              {selectedQuestion?.id === q.id ? (
                <div className="space-y-3">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Skriv ditt svar her..."
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Send svar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedQuestion(null);
                        setAnswer('');
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedQuestion(q)}
                  className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium"
                >
                  Svar på dette spørsmålet →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Training Tab Component
function TrainingTab({ conversations, onApprove, onCorrect }) {
  const [selectedConv, setSelectedConv] = useState(null);
  const [correction, setCorrection] = useState({ answer: '', feedback: '' });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Treningssamtaler</h2>
        <p className="text-gray-600 mt-1">
          Gå gjennom AI sine svar og bekreft om de var korrekte
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Ingen treningssamtaler å gå gjennom</p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map(conv => (
            <div key={conv.id} className="bg-white border rounded-lg p-6">
              {/* Customer Message */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-600 mb-2">Kunde spurte:</div>
                <p className="text-gray-900">{conv.customer_message}</p>
              </div>

              {/* Employee Response */}
              <div className="mb-4 p-4 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-600 mb-2">Du svarte:</div>
                <p className="text-gray-900">{conv.employee_response}</p>
              </div>

              {/* AI Suggested Response (if any) */}
              {conv.ai_suggested_response && (
                <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm font-medium text-purple-600 mb-2">AI sitt forslag:</div>
                  <p className="text-gray-900">{conv.ai_suggested_response}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onApprove(conv.id)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  AI hadde rett
                </button>
                <button
                  onClick={() => setSelectedConv(conv)}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  AI må korrigeres
                </button>
              </div>

              {/* Correction Form */}
              {selectedConv?.id === conv.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hva er det korrekte svaret?
                    </label>
                    <textarea
                      value={correction.answer}
                      onChange={(e) => setCorrection({ ...correction, answer: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg"
                      rows={3}
                      placeholder="Skriv det riktige svaret..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hvorfor var AI feil? (valgfritt)
                    </label>
                    <textarea
                      value={correction.feedback}
                      onChange={(e) => setCorrection({ ...correction, feedback: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg"
                      rows={2}
                      placeholder="F.eks: 'Prisen har endret seg' eller 'AI misforstod spørsmålet'..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onCorrect(conv.id, correction.answer, correction.feedback);
                        setSelectedConv(null);
                        setCorrection({ answer: '', feedback: '' });
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Lagre korreksjon
                    </button>
                    <button
                      onClick={() => {
                        setSelectedConv(null);
                        setCorrection({ answer: '', feedback: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Corrections Tab Component
function CorrectionsTab({ corrections }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Korreksjonskø</h2>
        <p className="text-gray-600 mt-1">
          Feil som AI har gjort og som må rettes
        </p>
      </div>

      {corrections.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <p className="text-gray-600">Ingen korreksjoner å håndtere</p>
          <p className="text-sm text-gray-500 mt-1">AI-en gjør det bra! 🎉</p>
        </div>
      ) : (
        <div className="space-y-4">
          {corrections.map(corr => (
            <div key={corr.id} className="bg-white border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${corr.priority === 'urgent' ? 'bg-red-100 text-red-800' : 
                        corr.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'}
                    `}>
                      {corr.priority === 'urgent' ? '🚨 Urgent' : 
                       corr.priority === 'high' ? '⚠️ Høy' : '⚡ Medium'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(corr.created_at).toLocaleDateString('no-NO')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Kunde spurte:</div>
                      <p className="text-gray-900">{corr.customer_question}</p>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-red-600">AI svarte feil:</div>
                      <p className="text-gray-900">{corr.ai_wrong_answer}</p>
                    </div>

                    {corr.correct_answer && (
                      <div>
                        <div className="text-sm font-medium text-green-600">Riktig svar:</div>
                        <p className="text-gray-900">{corr.correct_answer}</p>
                      </div>
                    )}

                    {corr.error_description && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Forklaring:</div>
                        <p className="text-gray-600 text-sm">{corr.error_description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Knowledge Tab Component
function KnowledgeTab({ knowledge, orgId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredKnowledge, setFilteredKnowledge] = useState(knowledge);

  useEffect(() => {
    if (searchTerm) {
      const filtered = knowledge.filter(k => 
        k.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredKnowledge(filtered);
    } else {
      setFilteredKnowledge(knowledge);
    }
  }, [searchTerm, knowledge]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Kunnskapsbase</h2>
        <p className="text-gray-600 mt-1">
          Alt AI-en vet om din bedrift
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Søk i kunnskapsbase..."
          className="w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <BookOpen className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Knowledge Items */}
      <div className="space-y-3">
        {filteredKnowledge.map(k => (
          <div key={k.id} className="bg-white border rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                {k.category}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {(k.confidence_score * 100).toFixed(0)}%
                </div>
                <div className="text-gray-300">•</div>
                <div>Brukt {k.times_used} ganger</div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Spørsmål:</div>
                <p className="text-gray-900">{k.question}</p>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Svar:</div>
                <p className="text-gray-700">{k.answer}</p>
              </div>

              {k.keywords && k.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {k.keywords.map((keyword, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredKnowledge.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Ingen kunnskap funnet</p>
        </div>
      )}
    </div>
  );
}
