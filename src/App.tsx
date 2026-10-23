import { useState, type FormEvent } from 'react';
import { Loader2, Send, MessageSquare, User, Mail, Building2, Phone } from 'lucide-react';
import { Toast, useToast } from '@/components/Toast';
import { EDGE_FUNCTION_URL } from '@/lib/supabase';

const AVATAR_URL =
  'https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg?auto=compress&cs=tinysrgb&h=400&w=400';

interface FormData {
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  agreement: boolean;
}

const initialForm: FormData = {
  full_name: '',
  company_name: '',
  email: '',
  phone: '',
  agreement: false,
};

export default function App() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const { toast, showToast, dismissToast } = useToast();

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        showToast(result.error || 'Something went wrong', 'error');
        return;
      }

      showToast('Message sent successfully!', 'success');
      setForm(initialForm);
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
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

      <Toast toast={toast} onDismiss={dismissToast} />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Left side — Profile */}
          <div className="flex flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl sm:p-10">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Available for meetings
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Meet with Cameron
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
              Schedule a one-on-one to discuss your project, explore
              partnership opportunities, or just have a great conversation about
              what we're building. Fill out the form and we'll get back to you
              within 24 hours.
            </p>

            {/* Avatar + info */}
            <div className="mt-8 flex items-center gap-4">
              <img
                src={AVATAR_URL}
                alt="Cameron Williamson"
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/20"
              />
              <div>
                <p className="font-semibold text-white">Cameron Williamson</p>
                <p className="text-sm text-white/50">Co-Founder</p>
              </div>
            </div>

            {/* Chat button */}
            <button
              type="button"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 transition-all duration-200 hover:from-purple-500 hover:to-fuchsia-500 hover:shadow-purple-700/50 active:scale-[0.98]"
            >
              <MessageSquare className="h-4 w-4" />
              Start a Chat
            </button>
          </div>

          {/* Right side — Contact form */}
          <div className="flex flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl sm:p-10">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Get in Touch
            </h2>
            <p className="mt-1.5 text-sm text-white/50">
              Fill out the form below and we'll be in touch.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="mb-1.5 block text-xs font-medium text-white/70">
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    id="full_name"
                    type="text"
                    value={form.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="company_name" className="mb-1.5 block text-xs font-medium text-white/70">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    id="company_name"
                    type="text"
                    value={form.company_name}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    placeholder="Acme Inc."
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-white/70">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="jane@acme.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-white/70">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              {/* Agreement checkbox */}
              <label className="flex cursor-pointer items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  checked={form.agreement}
                  onChange={(e) => handleChange('agreement', e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/5 accent-purple-600"
                />
                <span className="text-xs leading-relaxed text-white/50">
                  I agree to the processing of my personal data and accept the
                  terms and conditions.
                </span>
              </label>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 transition-all duration-200 hover:from-purple-500 hover:to-fuchsia-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
