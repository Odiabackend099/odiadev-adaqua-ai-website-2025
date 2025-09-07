import React from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';
import AssistantWizard from '../components/AssistantWizard';
import CRMDashboard from '../components/CRMDashboard';
import { supabase, Assistant } from '../lib/supabase';

function LoginContent() {
  const { user, loading } = useAuth();
  const [assistant, setAssistant] = React.useState<Assistant | null>(null);
  const [checkingAssistant, setCheckingAssistant] = React.useState(true);

  React.useEffect(() => {
    const checkAssistant = async () => {
      if (!user) {
        setCheckingAssistant(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('assistants')
          .select('*')
          .eq('owner_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking assistant:', error);
        } else if (data) {
          setAssistant(data);
        }
      } catch (error) {
        console.error('Error checking assistant:', error);
      } finally {
        setCheckingAssistant(false);
      }
    };

    checkAssistant();
  }, [user]);

  if (loading || checkingAssistant) {
    return (
      <div className="min-h-screen bg-[#0e2240] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => window.location.reload()} />;
  }

  if (!assistant) {
    return <AssistantWizard onComplete={setAssistant} />;
  }

  return <CRMDashboard />;
}

export default function Login() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
}
