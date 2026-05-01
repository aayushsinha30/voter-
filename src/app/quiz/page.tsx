'use client';

import { useState, useCallback, useMemo } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { useUserContext } from '@/app/lib/user-store';
import { Onboarding } from '@/components/voting/Onboarding';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, Brain, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnalytics } from '@/hooks/use-analytics';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUIZ_DATA: Record<string, Question[]> = {
  'India': [
    {
      question: 'What is the minimum voting age in India?',
      options: ['16 years', '18 years', '21 years', '25 years'],
      correct: 1,
      explanation: 'The 61st Amendment Act of 1988 reduced the voting age from 21 to 18 years.'
    },
    {
      question: 'Which body conducts elections in India?',
      options: ['Supreme Court', 'Parliament', 'Election Commission of India', 'President'],
      correct: 2,
      explanation: 'The Election Commission of India (ECI) is an autonomous constitutional body responsible for conducting elections.'
    },
    {
      question: 'What is NOTA in Indian elections?',
      options: ['A political party', 'None of the Above option', 'A type of ballot', 'An election rule'],
      correct: 1,
      explanation: 'NOTA (None of the Above) was introduced in 2013, allowing voters to reject all candidates.'
    },
    {
      question: 'How many members are in the Lok Sabha?',
      options: ['250', '545', '543', '552'],
      correct: 2,
      explanation: 'The Lok Sabha has a maximum strength of 543 elected members representing constituencies.'
    },
    {
      question: 'What document is primarily used for voter identification?',
      options: ['PAN Card', 'EPIC (Voter ID)', 'Driving License', 'Ration Card'],
      correct: 1,
      explanation: 'The EPIC (Electors Photo Identity Card) is the primary identification document for voting.'
    },
    {
      question: 'What is the Anti-Defection Law?',
      options: ['Law against corruption', 'Law preventing party-switching by legislators', 'Law for election funding', 'Law for voter registration'],
      correct: 1,
      explanation: 'The Anti-Defection Law (10th Schedule) prevents elected legislators from switching parties after elections.'
    },
    {
      question: 'Which article of the Indian Constitution provides the right to vote?',
      options: ['Article 14', 'Article 19', 'Article 326', 'Article 21'],
      correct: 2,
      explanation: 'Article 326 provides for elections on the basis of adult suffrage to the Lok Sabha and State Legislative Assemblies.'
    },
    {
      question: 'What percentage of voter turnout did India see in 2024 General Elections?',
      options: ['55%', '62%', '66%', '71%'],
      correct: 2,
      explanation: 'India recorded approximately 66% voter turnout in the 2024 Lok Sabha elections.'
    },
  ],
  default: [
    {
      question: 'What is a democracy?',
      options: ['Rule by a king', 'Rule by the people', 'Rule by the military', 'Rule by the wealthy'],
      correct: 1,
      explanation: 'Democracy comes from Greek words meaning "rule by the people" — citizens participate in governance.'
    },
    {
      question: 'What is a referendum?',
      options: ['A type of election', 'A direct vote on a specific issue', 'A political party meeting', 'A court ruling'],
      correct: 1,
      explanation: 'A referendum is a direct vote in which citizens are asked to decide on a particular proposal or issue.'
    },
    {
      question: 'What is the purpose of a constitution?',
      options: ['To declare war', 'To establish fundamental laws and principles', 'To collect taxes', 'To appoint officials'],
      correct: 1,
      explanation: 'A constitution establishes the fundamental laws, principles, and framework of a government.'
    },
    {
      question: 'What does universal suffrage mean?',
      options: ['Only men can vote', 'Only property owners can vote', 'All adult citizens can vote', 'Only educated people can vote'],
      correct: 2,
      explanation: 'Universal suffrage means all adult citizens have the right to vote regardless of gender, race, or wealth.'
    },
    {
      question: 'What is gerrymandering?',
      options: ['A voting method', 'Manipulating electoral boundaries', 'A type of ballot', 'A campaign strategy'],
      correct: 1,
      explanation: 'Gerrymandering is the manipulation of electoral district boundaries to favor a particular political party.'
    },
    {
      question: 'What is voter registration?',
      options: ['Signing up to receive campaign materials', 'Formally enrolling to vote in elections', 'Joining a political party', 'Volunteering at polling stations'],
      correct: 1,
      explanation: 'Voter registration is the process of formally enrolling yourself in the electoral roll to be eligible to vote.'
    },
    {
      question: 'What is a coalition government?',
      options: ['A single-party government', 'A government formed by multiple parties', 'A military government', 'A temporary government'],
      correct: 1,
      explanation: 'A coalition government is formed when multiple political parties join together to form a majority.'
    },
    {
      question: 'What is the purpose of election observers?',
      options: ['To campaign for candidates', 'To ensure elections are fair and free', 'To count ballots', 'To register voters'],
      correct: 1,
      explanation: 'Election observers monitor the electoral process to ensure transparency, fairness, and adherence to laws.'
    },
  ],
};

export default function QuizPage() {
  const { user, saveUser } = useUserContext();
  const { track, events } = useAnalytics();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  if (!user || !user.onboarded) {
    return <Onboarding onComplete={saveUser} />;
  }

  const questions = QUIZ_DATA[user.country] || QUIZ_DATA['default'];
  const question = questions[currentQ];
  const totalQuestions = questions.length;

  const handleAnswer = useCallback((idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    const isCorrect = idx === question.correct;
    if (isCorrect) {
      setScore(s => s + 1);
    }
    track(events.QUIZ_QUESTION_ANSWERED, {
      question_number: currentQ + 1,
      is_correct: isCorrect,
      country: user?.country,
    });
  }, [showResult, answers, question.correct, currentQ, track, events, user?.country]);

  const nextQuestion = () => {
    if (currentQ + 1 >= totalQuestions) {
      setQuizComplete(true);
    } else {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizComplete(false);
  };

  const getGrade = () => {
    const pct = (score / totalQuestions) * 100;
    if (pct >= 90) return { label: 'Civic Champion 🏆', color: 'text-yellow-400', desc: 'Outstanding! You\'re incredibly well-informed.' };
    if (pct >= 70) return { label: 'Informed Citizen ⭐', color: 'text-success', desc: 'Great job! You have strong civic knowledge.' };
    if (pct >= 50) return { label: 'Growing Learner 📚', color: 'text-accent', desc: 'Good start! Keep learning with our tools.' };
    return { label: 'Civic Beginner 🌱', color: 'text-warning', desc: 'No worries! Head to Learn to boost your knowledge.' };
  };

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar />
      <main className="px-5 py-6 pb-28 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/20">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-headline">Civic Quiz</h2>
              <p className="text-xs text-muted-foreground">Test your voting & civic knowledge</p>
            </div>
          </div>
        </div>

        {quizComplete ? (
          /* Results Screen */
          <div className="space-y-6">
            <Card className="glass-card-accent border-primary/20 text-center overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
                  <span className="text-3xl">{score >= totalQuestions * 0.7 ? '🏆' : score >= totalQuestions * 0.5 ? '⭐' : '📚'}</span>
                </div>
                <div className="space-y-2">
                  <h3 className={`text-2xl font-headline ${getGrade().color}`}>{getGrade().label}</h3>
                  <p className="text-muted-foreground">{getGrade().desc}</p>
                </div>
                <div className="text-5xl font-headline gradient-text font-bold">
                  {score}/{totalQuestions}
                </div>
                <p className="text-sm text-muted-foreground">
                  {Math.round((score / totalQuestions) * 100)}% accuracy
                </p>

                {/* Answer Breakdown */}
                <div className="grid grid-cols-4 gap-2 pt-4">
                  {answers.map((ans, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-full aspect-square rounded-xl flex items-center justify-center text-sm font-bold",
                        ans === questions[i].correct
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                      )}
                    >
                      {ans === questions[i].correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 btn-scale rounded-xl text-base"
                  onClick={resetQuiz}
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Quiz Questions */
          <div className="space-y-4">
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div className="quiz-progress-fill h-full rounded-full" style={{ width: `${((currentQ + 1) / totalQuestions) * 100}%` }} />
              </div>
              <Badge variant="outline" className="text-[10px] font-bold border-border/50 rounded-full px-3 py-1">
                {currentQ + 1}/{totalQuestions}
              </Badge>
            </div>

            {/* Question Card */}
            <Card className="glass-card border-border/30">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Question {currentQ + 1}</span>
                </div>
                <CardTitle className="text-lg leading-relaxed">{question.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showResult}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3",
                      showResult
                        ? idx === question.correct
                          ? "border-success bg-success/10 text-success"
                          : idx === selected
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : "border-border/30 bg-secondary/20 opacity-50"
                        : selected === idx
                        ? "border-primary bg-primary/10"
                        : "border-border/30 bg-secondary/20 hover:border-primary/30 hover:bg-secondary/40"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                      showResult
                        ? idx === question.correct
                          ? "bg-success/20 text-success"
                          : idx === selected
                          ? "bg-destructive/20 text-destructive"
                          : "bg-secondary text-muted-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}>
                      {showResult && idx === question.correct ? <CheckCircle2 className="w-4 h-4" /> :
                       showResult && idx === selected ? <XCircle className="w-4 h-4" /> :
                       String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-sm font-medium">{opt}</span>
                  </button>
                ))}

                {/* Explanation */}
                {showResult && (
                  <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-primary uppercase">Explanation</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
                  </div>
                )}

                {showResult && (
                  <Button
                    className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:opacity-90 btn-scale rounded-xl mt-2"
                    onClick={nextQuestion}
                  >
                    {currentQ + 1 >= totalQuestions ? 'See Results' : 'Next Question'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
