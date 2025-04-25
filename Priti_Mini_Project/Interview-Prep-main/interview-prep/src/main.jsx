import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import SignInPage from './auth/sign-in/SignInPage.jsx';
import SignUpPage from './auth/sign-up/SignUpPage.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage.jsx';
import Loader from './components/Loader'; 
import ResumeBuilder from './pages/ResumeBuilder.jsx';
import ResumePreviewPage from './pages/ResumePreviewPage.jsx'; 

// Lazy-loaded components
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Resume = lazy(() => import('./pages/Resume.jsx'));
const InterviewPage = lazy(() => import('./pages/InterviewPage.jsx'));
const QuestionsPage = lazy(() => import('./pages/QuestionPage.jsx'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage.jsx')); 
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Dashboard />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: 'resume',
    element: (
      <Suspense fallback={<Loader />}>
        <Resume />
      </Suspense>
    ),
  },
  {
    path: 'services',
    element: (
      <Suspense fallback={<Loader />}>
        <ServicesPage />
      </Suspense>
    ),
  },
  {
    path: 'contact',
    element: (
      <Suspense fallback={<Loader />}>
        <ContactPage />
      </Suspense>
    ),
  },
  {
    path: 'resume-builder',
    element: (
      <Suspense fallback={<Loader />}>
        <ResumeBuilder/>
      </Suspense>
    ),
  },
  {
    path: '/my-resume/:resumeId/view',
    element: <Suspense fallback={<Loader />}><ResumePreviewPage /></Suspense>,
  },
  {
    path: '/interview/:mockId',
    element: (
      <Suspense fallback={<Loader />}>
        <InterviewPage />
      </Suspense>
    ),
  },
  {
    path: '/interview/:mockId/questions',
    element: (
      <Suspense fallback={<Loader />}>
        <QuestionsPage />
      </Suspense>
    ),
  },
  {
    path: '/feedbackpage', // Add the new route
    element: (
      <Suspense fallback={<Loader />}>
        <FeedbackPage />
      </Suspense>
    ),
  },
  {
    path: 'auth/sign-in',
    element: <SignInPage />,
  },
  {
    path: 'auth/sign-up',
    element: <SignUpPage />,
  },
]);

// Create the root once
const root = createRoot(document.getElementById('root'));

// Render the app
root.render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
