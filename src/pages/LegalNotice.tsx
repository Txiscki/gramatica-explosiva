import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const LegalNotice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" onClick={() => navigate("/")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-center mb-8">⚖️ Aviso Legal / Legal Notice</h1>

            {/* Spanish Version */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold">🇪🇸 Español</h2>
              
              <div className="space-y-4">
                <p className="text-lg">
                  <strong>Explosive Grammar © 2025</strong> — Todos los derechos reservados.
                </p>
                
                <p>
                  Esta página web, incluyendo su diseño, código, textos, preguntas, y elementos gráficos (excepto donde se indique lo contrario), 
                  son creación original de su autor y están protegidos por la legislación española e internacional sobre propiedad intelectual y derechos de autor.
                </p>
                
                <p>
                  Queda prohibida la reproducción total o parcial, distribución, comunicación pública o transformación de los contenidos de esta web 
                  sin la autorización previa y expresa del autor.
                </p>

                <h3 className="text-xl font-semibold mt-6">🧑‍💻 Autoría</h3>
                <p>
                  Desarrollado y diseñado por <strong>Txiscki</strong>, creador de Explosive Grammar — una plataforma educativa para practicar inglés 
                  mediante preguntas interactivas por niveles.
                </p>
                <p>
                  Los emojis empleados en esta web pertenecen a sus respectivos autores y se utilizan conforme a las políticas de uso público de Unicode 
                  y de las plataformas correspondientes (Apple, Google, Twitter, etc.).
                </p>

                <h3 className="text-xl font-semibold mt-6">🤖 Imagen generada por IA</h3>
                <p>
                  El icono de la bomba 💣 utilizado en esta página fue generado mediante inteligencia artificial (Lovable AI) y se emplea exclusivamente 
                  con fines ilustrativos y no comerciales. Lovable conserva los derechos sobre las imágenes generadas en su plataforma conforme a sus 
                  Términos de Servicio.
                </p>

                <h3 className="text-xl font-semibold mt-6">🧠 Asistencia Técnica</h3>
                <p>
                  El desarrollo de esta web contó con el apoyo técnico y de redacción de <strong>ChatGPT (OpenAI)</strong>, en calidad de asistente virtual.
                </p>

                <h3 className="text-xl font-semibold mt-6">🔐 Propiedad y uso</h3>
                <p>
                  Todo el contenido del sitio (textos, código, bases de datos, diseño y funcionalidad del juego) pertenece a su autor original. 
                  El uso del sitio no concede al usuario ningún derecho de propiedad sobre los mismos.
                </p>
                <p>
                  Se permite compartir o mostrar el proyecto con fines educativos, siempre que se cite expresamente la fuente:
                </p>
                <p className="italic pl-4 border-l-4 border-primary">
                  "Explosive Grammar – desarrollado por Txiscki."
                </p>

                <h3 className="text-xl font-semibold mt-6">📜 Contacto</h3>
                <p>
                  Para cualquier cuestión relacionada con los derechos de autor, errores o solicitudes de colaboración, puedes contactar con el autor 
                  a través del correo electrónico <strong>fmgcp12@gmail.com</strong>.
                </p>
              </div>
            </section>

            {/* English Version */}
            <section className="space-y-6 pt-8 border-t border-border">
              <h2 className="text-3xl font-bold">🇬🇧 English</h2>
              
              <div className="space-y-4">
                <p className="text-lg">
                  <strong>Explosive Grammar © 2025</strong> — All rights reserved.
                </p>
                
                <p>
                  This website, including its design, code, text, questions, and graphical elements (unless otherwise stated), is the original creation 
                  of its author and protected under Spanish and international copyright laws.
                </p>
                
                <p>
                  Reproduction, distribution, public communication, or transformation of any part of this website without prior authorization from the 
                  author is strictly prohibited.
                </p>

                <h3 className="text-xl font-semibold mt-6">🧑‍💻 Author</h3>
                <p>
                  Developed and designed by <strong>Txiscki</strong>, creator of Explosive Grammar — an educational platform to practice English through 
                  interactive level-based quizzes.
                </p>
                <p>
                  Emojis used on this site belong to their respective owners and are used under Unicode and platform fair-use policies 
                  (Apple, Google, Twitter, etc.).
                </p>

                <h3 className="text-xl font-semibold mt-6">🤖 AI-Generated Image</h3>
                <p>
                  The bomb icon 💣 used on this site was generated using Lovable AI and is used for illustrative, non-commercial purposes. 
                  Lovable retains rights over images created through its platform as stated in its Terms of Service.
                </p>

                <h3 className="text-xl font-semibold mt-6">🧠 Technical Assistance</h3>
                <p>
                  This website was created with the support and guidance of <strong>ChatGPT (OpenAI)</strong> as a virtual assistant.
                </p>

                <h3 className="text-xl font-semibold mt-6">🔐 Ownership and Use</h3>
                <p>
                  All site content (text, code, databases, design, and game functionality) belongs to its original author. 
                  Using this site does not grant users any ownership rights.
                </p>
                <p>
                  Sharing or showcasing this project for educational purposes is allowed, as long as the following credit is included:
                </p>
                <p className="italic pl-4 border-l-4 border-primary">
                  "Explosive Grammar – developed by Txiscki."
                </p>

                <h3 className="text-xl font-semibold mt-6">📜 Contact</h3>
                <p>
                  For copyright inquiries, error reports, or collaboration requests, please contact the author via email{" "}
                  <strong>fmgcp12@gmail.com</strong>.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LegalNotice;
