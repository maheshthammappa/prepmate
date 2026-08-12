import React, { createContext, useContext, useState } from 'react';
import { interviewApi } from '../interview.api';

const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [activeSession, setActiveSession] = useState(null); // { topic, experienceLevel, questions: [], duration: number }
  const [answers, setAnswers] = useState({}); // { questionId: string }
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const startStandardInterview = async (setupData) => {
    setIsGenerating(true);
    try {
      const data = await interviewApi.generateQuestions({
        topic: setupData.topic,
        experienceLevel: setupData.experienceLevel,
        questionCount: parseInt(setupData.questionCount, 10),
        questionStyle: setupData.questionStyle || 'Mixed'
      });
      
      setActiveSession({
        topic: data.topic,
        experienceLevel: data.experienceLevel,
        questions: data.questions,
        duration: setupData.duration ? parseInt(setupData.duration, 10) : 30
      });
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
        setActiveSession({
            topic: data.topic || 'Resume Based',
            experienceLevel: data.experienceLevel,
            questions: data.questions,
            duration: duration ? parseInt(duration, 10) : 30
        });
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
  }

  return (
    <InterviewContext.Provider value={{
      activeSession,
      answers,
      setAnswers,
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
