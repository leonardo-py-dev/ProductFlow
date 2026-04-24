import { Link } from 'react-router-dom';
import { ArrowRight, LayoutDashboard, Workflow, FileText, Users, Zap, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-deep text-white font-sans overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[150px] opacity-50 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] opacity-50 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Workflow className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">ProductFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
            Entrar
          </Link>
          <Link
            to="/register"
            className="bg-white/10 hover:bg-white/15 border border-white/10 text-white px-5 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
          >
            Começar Grátis
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-primary-light mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            <span>A nova forma de organizar times tech</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">
            O caos vira <br className="hidden md:block" /> fluxo de trabalho.
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Substitua suas 4 ferramentas diferentes por um único workspace focado em desenvolvimento de produto. 
            Kanban, diagramas, documentação e colaboração em tempo real.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-full text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1"
            >
              Começar a organizar agora
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
            >
              Já tenho uma conta
            </Link>
          </div>
        </section>

        {/* Features Showcase */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors group">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Workspaces e Steps</h3>
              <p className="text-gray-400 leading-relaxed">
                Organize projetos em Steps. Defina responsáveis, prazos e acompanhe tudo via Kanban ou Timeline.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors group">
              <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 text-secondary group-hover:scale-110 transition-transform">
                <Workflow className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Flow Builder</h3>
              <p className="text-gray-400 leading-relaxed">
                Desenhe arquiteturas e processos em um canvas infinito colaborativo. Conecte nós diretamente aos seus Steps.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Knowledge Base</h3>
              <p className="text-gray-400 leading-relaxed">
                Documentação integrada com um editor rico. Crie atas, PRDs e notas vinculadas ao contexto do projeto.
              </p>
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">Feito para times que constroem o futuro.</h2>
            <p className="text-gray-400 text-lg mb-8">
              O ProductFlow foi desenhado para equipes de produto enxutas que precisam de agilidade sem abrir mão da documentação técnica e arquitetura visual.
            </p>
            <ul className="space-y-4">
              {[
                'Desenvolvedores e Engenheiros',
                'Product Managers',
                'Designers UI/UX',
                'Agências e Freelancers'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-3xl opacity-20" />
            <div className="relative bg-[#16171d] border border-white/10 rounded-3xl p-8 shadow-2xl aspect-square flex items-center justify-center">
              <Users className="w-32 h-32 text-gray-700" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            <span className="font-semibold text-gray-300">ProductFlow</span>
          </div>
          <p>© 2026 ProductFlow. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
