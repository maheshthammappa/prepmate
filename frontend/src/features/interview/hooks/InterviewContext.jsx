import React, { createContext, useContext, useState, useEffect } from 'react';
import { interviewApi } from '../interview.api';

const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [activeSession, setActiveSession] = useState(() => {
    const saved = localStorage.getItem('pm_activeSession');
    return saved ? JSON.parse(saved) : null;
  }); 
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('pm_answers');
    return saved ? JSON.parse(saved) : {};
  }); 
  const [sessionEndTime, setSessionEndTime] = useState(() => {
    const saved = localStorage.getItem('pm_sessionEndTime');
    return saved ? parseInt(saved, 10) : null;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    if (activeSession) localStorage.setItem('pm_activeSession', JSON.stringify(activeSession));
    else localStorage.removeItem('pm_activeSession');
  }, [activeSession]);

  useEffect(() => {
    localStorage.setItem('pm_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    if (sessionEndTime) localStorage.setItem('pm_sessionEndTime', sessionEndTime.toString());
    else localStorage.removeItem('pm_sessionEndTime');
  }, [sessionEndTime]);

  const startStandardInterview = async (setupData) => {
    setIsGenerating(true);
    try {
      const data = await interviewApi.generateQuestions({
        topic: setupData.topic,
        experienceLevel: setupData.experienceLevel,
        questionCount: parseInt(setupData.questionCount, 10),
        questionStyle: setupData.questionStyle || 'Mixed'
      });
      
      const duration = setupData.duration ? parseInt(setupData.duration, 10) : 30;
      setActiveSession({
        topic: data.topic,
        experienceLevel: data.experienceLevel,
        questions: data.questions,
        duration: duration
      });
      setSessionEndTime(Date.now() + duration * 60 * 1000);
      setAnswers({});
      return true;
    } catch (error) {
      console.error("Failed to generate questions", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const startPracticeInterview = async () => {
    setIsGenerating(true);
    try {
      const data = await interviewApi.generatePracticeQuestions();
      
      // If there are no questions returned (e.g. user has no weak questions due)
      if (!data.questions || data.questions.length === 0) {
        return false;
      }
      
      setActiveSession({
        topic: data.topic,
        experienceLevel: data.experienceLevel,
        questions: data.questions,
        duration: 10 // Quick practice duration
      });
      setSessionEndTime(Date.now() + 10 * 60 * 1000);
      setAnswers({});
      return true;
    } catch (error) {
      console.error("Failed to generate practice questions", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const startResumeInterview = async (formData, duration) => {
      setIsGenerating(true);
      try {
        const data = await interviewApi.generateFromResume(formData);
        const finalDuration = duration ? parseInt(duration, 10) : 30;
        setActiveSession({
            topic: data.topic || 'Resume Based',
            experienceLevel: data.experienceLevel,
            questions: data.questions,
            duration: finalDuration
        });
        setSessionEndTime(Date.now() + finalDuration * 60 * 1000);
        setAnswers({});
        return true;
      } catch (error) {
        console.error("Failed to generate questions from resume", error);
        throw error;
      } finally {
          setIsGenerating(false);
      }
  }

  const saveAnswer = (questionId, text) => {
    setAnswers(prev => ({ ...prev, [questionId]: text }));
  };

  const submitInterview = async () => {
    if (!activeSession) return null;
    setIsEvaluating(true);
    try {
      const submissionData = {
        topic: activeSession.topic,
        experienceLevel: activeSession.experienceLevel,
        answers: activeSession.questions.map(q => ({
          questionId: q.id,
          questionText: q.questionText,
          userAnswer: answers[q.id] || ""
        }))
      };
      
      const result = await interviewApi.evaluate(submissionData);
      clearSession();
      return result.id; // Return DB ID for navigation
    } catch (error) {
      console.error("Failed to evaluate interview", error);
      throw error;
    } finally {
      setIsEvaluating(false);
    }
  };
  
  const clearSession = () => {
      setActiveSession(null);
      setAnswers({});
      setSessionEndTime(null);
      localStorage.removeItem('pm_activeSession');
      localStorage.removeItem('pm_answers');
      localStorage.removeItem('pm_sessionEndTime');
  }

  return (
    <InterviewContext.Provider value={{
      activeSession,
      answers,
      setAnswers,
      sessionEndTime,
      isGenerating,
      isEvaluating,
      startStandardInterview,
      startResumeInterview,
      startPracticeInterview,
      saveAnswer,
      submitInterview,
      clearSession
    }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
