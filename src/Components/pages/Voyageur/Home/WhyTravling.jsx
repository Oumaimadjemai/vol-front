
import heroImage from "../../../../assets/images/why.png"

const WhyTravling = () => {
  return (
    <section 
    id="about"
    className="w-full min-h-screen  flex items-center px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
        
        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#00C0E8] drop-shadow-md">
            Pourquoi Travling?
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed">
            Travling vous aide à découvrir les meilleures destinations au monde 
            avec une expérience simple, rapide et personnalisée. 
            Réservez vos vols, trouvez les meilleurs hôtels et explorez 
            des endroits magnifiques en quelques clics.
          </p>

          <p className="text-gray-500">
            Notre plateforme combine technologie moderne et recommandations 
            intelligentes pour vous offrir un voyage inoubliable.
          </p>

          <button className="mt-4 px-6 py-3 bg-[#00C0E8] text-white rounded-xl shadow-lg hover:bg-cyan-700 transition duration-300">
            Explorer maintenant
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center">
          <img
            src={heroImage}
            alt="Travling illustration"
            className="w-full max-w-lg object-contain"
          />
        </div>

      </div>
    </section>
  );
};

export default WhyTravling;