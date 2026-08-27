import { SectionTitle } from '@/components/ui/SectionTitle';
import { Target, Users, BarChart3, Handshake } from 'lucide-react';

const MISSIONS = [
  {
    icon: <Target className="h-7 w-7" />,
    titre: 'Planification territoriale',
    desc: "Appui à l'élaboration et à la mise en œuvre des plans de développement des collectivités locales.",
  },
  {
    icon: <Users className="h-7 w-7" />,
    titre: 'Renforcement des capacités',
    desc: "Formation et assistance technique aux élus, agents et acteurs du développement local.",
  },
  {
    icon: <BarChart3 className="h-7 w-7" />,
    titre: 'Mobilisation des ressources',
    desc: "Identification et montage de projets pour mobiliser des financements nationaux et internationaux.",
  },
  {
    icon: <Handshake className="h-7 w-7" />,
    titre: 'Coordination des acteurs',
    desc: "Facilitation du dialogue entre l'État, les collectivités, la société civile et les partenaires.",
  },
];

export function MissionsSection() {
  return (
    <section className="py-16 bg-background" aria-label="Nos missions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          title="Nos Missions"
          subtitle="L'ARD accompagne le développement de la région de Ziguinchor sur quatre axes stratégiques"
          centered
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MISSIONS.map((m, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                {m.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{m.titre}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
