import { useEffect, useState } from 'react';
import { ArrowLeft, Mail, Phone, Building2, Loader2, Inbox, RefreshCw } from 'lucide-react';
import { EDGE_FUNCTION_URL } from '@/lib/supabase';

interface ContactMessage {
  id: string;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface MessagesPageProps {
  onNavigate: (route: string) => void;
}

export default function MessagesPage({ onNavigate }: MessagesPageProps) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/messages`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load messages (${response.status})`);
      }

      const result = await response.json();
      setMessages(Array.isArray(result.data) ? result.data : []);
    } catch {
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a13] text-white">
      {/* Gradient background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-fuchsia-600/30 to-purple-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-blue-600/25 to-cyan-500/15 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-violet-600/25 to-indigo-600/15 blur-[120px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-xl transition-all hover:border-white/20 hover:text-white active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contact
          </button>

          <button
            onClick={fetchMessages}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-xl transition-all hover:border-white/20 hover:text-white active:scale-[0.98] disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Messages
          </h1>
          <p className="mt-1.5 text-sm text-white/50">
            All contact form submissions, newest first.
          </p>
        </div>

        {/* Content */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              <p className="mt-4 text-sm text-white/50">Loading messages...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-sm text-red-300">{error}</p>
              <button
                onClick={fetchMessages}
                className="mt-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-purple-500 hover:to-fuchsia-500"
              >
                Try Again
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Inbox className="h-12 w-12 text-white/20" />
              <p className="mt-4 text-sm text-white/50">No messages yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Left: name + company */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">
                          {msg.full_name}
                        </h3>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-white/40">
                        <Building2 className="h-3.5 w-3.5" />
                        {msg.company_name}
                      </div>
                    </div>

                    {/* Right: date */}
                    <span className="shrink-0 text-xs text-white/40">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>

                  {/* Contact info */}
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <a
                      href={`mailto:${msg.email}`}
                      className="inline-flex items-center gap-2 text-white/60 transition-colors hover:text-purple-300"
                    >
                      <Mail className="h-3.5 w-3.5 text-purple-400" />
                      {msg.email}
                    </a>
                    <span className="inline-flex items-center gap-2 text-white/60">
                      <Phone className="h-3.5 w-3.5 text-purple-400" />
                      {msg.phone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
