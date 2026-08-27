// Carte Google Maps de localisation de l'ARD de Ziguinchor
// Embed fourni par Google Maps (partager → intégrer une carte).
const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3894.3052700253393!2d-16.2831092!3d12.5621115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xee7938683153fe9%3A0x3ff668d0e515e7d2!2sAgence%20R%C3%A9gionale%20de%20D%C3%A9veloppement%20de%20Ziguinchor!5e0!3m2!1sfr!2ssn!4v1787332987717!5m2!1sfr!2ssn';

export function CarteContact() {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 h-56">
      <iframe
        src={MAP_EMBED_SRC}
        title="Localisation de l'ARD Ziguinchor"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="w-full h-full"
      />
    </div>
  );
}

