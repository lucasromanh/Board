
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import 'bulma/css/bulma.min.css';
import './Home.css';
import heroImage from '../assets/logo.svg'; 
import featureImage1 from '../assets/feature1.svg';
import featureImage2 from '../assets/feature2.svg';
import featureImage3 from '../assets/feature3.svg';
import caseImage1 from '../assets/case1.svg';
import caseImage2 from '../assets/case2.svg';
import caseImage3 from '../assets/case3.svg';
import footerLogo from '../assets/footer-logo.svg';

const Home = () => (
  <div className="home-container">
    <Navbar />
    <main className="main-content">
      <section className="section banner-section has-text-centered">
        <div className="container">
          <h1 className="title is-2"> CASI-Trello <span className="jinja">JINJARDIGANS</span> unifica tus tareas, compañeros de equipo y herramientas</h1>
          <p className="subtitle is-4">Mantenlo todo en el mismo lugar, aunque tu equipo no lo esté.</p>
          <form className="field has-addons has-addons-centered cta-form">
            <div className="control">
              <input className="input" type="email" placeholder="Ingresa tu correo electrónico" />
            </div>
            <div className="control">
              <button className="button is-primary" type="submit">Regístrate, ¡es gratis!</button>
            </div>
          </form>
          <figure className="image is-128x128 is-inline-block mt-4">
            <img src={heroImage} alt="Hero" />
          </figure>
        </div>
      </section>
      <section className="section features-section">
        <div className="container">
          <div className="columns is-vcentered is-variable is-8">
            <div className="column is-5">
              <figure className="image">
                <img src={featureImage1} alt="Funcionalidad 1" />
              </figure>
            </div>
            <div className="column is-7">
              <h2 className="title is-3">Escalabilidad infinita, configuración cero</h2>
              <p>Permite que el código se ejecute según demanda sin necesidad de administrar tu propia infraestructura o actualizar hardware.</p>
            </div>
          </div>
          <div className="columns is-vcentered is-variable is-8">
            <div className="column is-5 is-offset-1-desktop order-2-desktop">
              <figure className="image">
                <img src={featureImage2} alt="Funcionalidad 2" />
              </figure>
            </div>
            <div className="column is-7">
              <h2 className="title is-3">Información y controles en tiempo real</h2>
              <p>Obtén métricas granulares de primera mano sobre el rendimiento del sitio por despliegue.</p>
            </div>
          </div>
          <div className="columns is-vcentered is-variable is-8">
            <div className="column is-5">
              <figure className="image">
                <img src={featureImage3} alt="Funcionalidad 3" />
              </figure>
            </div>
            <div className="column is-7">
              <h2 className="title is-3">Personalización en el borde</h2>
              <p>Ofrece contenido dinámico y personalizado, asegurando que los usuarios solo vean la mejor versión de tu sitio.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section cases-section">
        <div className="container">
          <h2 className="title is-2 has-text-centered">Casos de uso</h2>
          <div className="columns is-vcentered is-variable is-8">
            <div className="column is-5">
              <figure className="image">
                <img src={caseImage1} alt="Caso 1" />
              </figure>
            </div>
            <div className="column is-7">
              <h3 className="title is-3">Gestión de proyectos</h3>
              <p>Mantén los proyectos en orden, los plazos controlados y a los compañeros de equipo coordinados con Trello.</p>
            </div>
          </div>
          <div className="columns is-vcentered is-variable is-8">
            <div className="column is-5 is-offset-1-desktop order-2-desktop">
              <figure className="image">
                <img src={caseImage2} alt="Caso 2" />
              </figure>
            </div>
            <div className="column is-7">
              <h3 className="title is-3">Reuniones</h3>
              <p>Consigue que las reuniones en equipo sean más productivas, motivadoras e incluso divertidas.</p>
            </div>
          </div>
          <div className="columns is-vcentered is-variable is-8">
            <div className="column is-5">
              <figure className="image">
                <img src={caseImage3} alt="Caso 3" />
              </figure>
            </div>
            <div className="column is-7">
              <h3 className="title is-3">Incorporación</h3>
              <p>La incorporación a una nueva empresa o proyecto no podría ser más sencilla con el diseño visual de Trello.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section cta-section has-text-centered">
        <div className="container">
          <h2 className="title is-2">Experimenta el flujo de trabajo que los mejores equipos de frontend aman</h2>
          <p className="subtitle is-4">Permite que tu equipo se centre en enviar características en lugar de administrar la infraestructura con CI/CD automatizado.</p>
          <form className="field has-addons has-addons-centered cta-form">
            <div className="control">
              <input className="input" type="email" placeholder="Ingresa tu correo electrónico" />
            </div>
            <div className="control">
              <button className="button is-primary" type="submit">Regístrate</button>
            </div>
          </form>
          <p className="cta-note">
            Regístrate para recibir notificaciones cuando lancemos.
            <Link to="/terminos">Términos y Condiciones</Link>
          </p>
        </div>
      </section>
    </main>
    <footer className="footer">
      <div className="content has-text-centered">
        <figure className="image is-128x128 is-inline-block mb-4">
          <img src={footerLogo} alt="Logo Footer" />
        </figure>
        <p>&copy; 2023 Tu Empresa. Todos los derechos reservados.</p>
        <nav className="footer-nav">
          <Link to="/about" className="footer-link">Sobre Nosotros</Link>
          <Link to="/contact" className="footer-link">Contacto</Link>
          <Link to="/privacy" className="footer-link">Política de Privacidad</Link>
        </nav>
      </div>
    </footer>
  </div>
);

export default Home;
