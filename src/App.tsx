import { useEffect, useState, useCallback } from 'react';
import ContactPage from '@/pages/ContactPage';
import MessagesPage from '@/pages/MessagesPage';

function getCurrentRoute(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

export default function App() {
  const [route, setRoute] = useState(getCurrentRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(getCurrentRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
    setRoute(path);
    window.scrollTo(0, 0);
  }, []);

  if (route === '/messages') {
    return <MessagesPage onNavigate={navigate} />;
  }

  return <ContactPage onNavigate={navigate} />;
}
