import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Dashboard from '../features/dashboard/pages/Dashboard';
import InterviewSetup from '../features/interview/pages/InterviewSetup';
import ResumeInterviewSetup from '../features/interview/pages/ResumeInterviewSetup';
import InterviewSession from '../features/interview/pages/InterviewSession';
import InterviewResult from '../features/interview/pages/InterviewResult';
import PracticeSetup from '../features/interview/pages/PracticeSetup';
import MasteredQuestions from '../features/interview/pages/MasteredQuestions';
import HistoryList from '../features/history/pages/HistoryList';
import Profile from '../features/profile/pages/Profile';
import Settings from '../features/settings/pages/Settings';
import Chatbot from '../features/chatbot/pages/Chatbot';
import { InterviewProvider } from '../features/interview/hooks/InterviewContext';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/app/dashboard" replace />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'history',
        element: <HistoryList />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'chat',
        element: <Chatbot />
      },
      {
        path: 'interviews',
        element: (
          <InterviewProvider>
            <Outlet />
          </InterviewProvider>
        ),
        children: [
          {
            path: '',
            element: <Navigate to="/app/interviews/new" replace />
          },
          {
            path: 'new',
            element: <InterviewSetup />
          },
          {
            path: 'resume',
            element: <ResumeInterviewSetup />
          },
          {
            path: 'practice',
            element: <PracticeSetup />
          },
          {
            path: 'mastered',
            element: <MasteredQuestions />
          },
          {
            path: 'session/active',
            element: <InterviewSession />
          },
          {
            path: 'result/:id',
            element: <InterviewResult />
          }
        ]
      }
    ]
  }
]);




