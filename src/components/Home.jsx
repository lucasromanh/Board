import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
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
      <section className="banner-section text-center text-light bg-primary py-5">
        <div className="container">
          <h1 className="display-4">CASI-Trello <span className="text-warning">JINJARDIGANS</span> unifica tus tareas, compañeros de equipo y herramientas</h1>
          <p className="lead">Mantenlo todo en el mismo lugar, aunque tu equipo no lo esté.</p>
          <form className="row justify-content-center my-4">
            <div className="col-auto">
              <input className="form-control" type="email" placeholder="Ingresa tu correo electrónico" />
            </div>
            <div className="col-auto">
              <button className="btn btn-light" type="submit">Regístrate, ¡es gratis!</button>
            </div>
          </form>
          <figure className="my-4">
            <img src={heroImage} alt="Hero" className="img-fluid" />
          </figure>
        </div>
      </section>
      <section className="features-section py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <img src={featureImage1} alt="Funcionalidad 1" className="img-fluid" />
            </div>
            <div className="col-md-6">
              <h2 className="text-primary">Escalabilidad infinita, configuración cero</h2>
              <p>Permite que el código se ejecute según demanda sin necesidad de administrar tu propia infraestructura o actualizar hardware.</p>
            </div>
          </div>
          <div className="row align-items-center mb-5">
            <div className="col-md-6 order-md-2">
              <img src={featureImage2} alt="Funcionalidad 2" className="img-fluid" />
            </div>
            <div className="col-md-6 order-md-1">
              <h2 className="text-primary">Información y controles en tiempo real</h2>
              <p>Obtén métricas granulares de primera mano sobre el rendimiento del sitio por despliegue.</p>
            </div>
          </div>
          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <img src={featureImage3} alt="Funcionalidad 3" className="img-fluid" />
            </div>
            <div className="col-md-6">
              <h2 className="text-primary">Personalización en el borde</h2>
              <p>Ofrece contenido dinámico y personalizado, asegurando que los usuarios solo vean la mejor versión de tu sitio.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="cases-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center text-primary mb-5">Casos de uso</h2>
          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <img src={caseImage1} alt="Caso 1" className="img-fluid" />
            </div>
            <div className="col-md-6">
              <h3 className="text-primary">Gestión de proyectos</h3>
              <p>Mantén los proyectos en orden, los plazos controlados y a los compañeros de equipo coordinados con Trello.</p>
            </div>
          </div>
          <div className="row align-items-center mb-5">
            <div className="col-md-6 order-md-2">
              <img src={caseImage2} alt="Caso 2" className="img-fluid" />
            </div>
            <div className="col-md-6 order-md-1">
              <h3 className="text-primary">Reuniones</h3>
              <p>Consigue que las reuniones en equipo sean más productivas, motivadoras e incluso divertidas.</p>
            </div>
          </div>
          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <img src={caseImage3} alt="Caso 3" className="img-fluid" />
            </div>
            <div className="col-md-6">
              <h3 className="text-primary">Incorporación</h3>
              <p>La incorporación a una nueva empresa o proyecto no podría ser más sencilla con el diseño visual de Trello.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="cta-section py-5 text-center text-light bg-dark">
        <div className="container">
          <h2 className="text-light mb-4">Experimenta el flujo de trabajo que los mejores equipos de frontend aman</h2>
          <p className="lead mb-4">Permite que tu equipo se centre en enviar características en lugar de administrar la infraestructura con CI/CD automatizado.</p>
          <form className="row justify-content-center my-4">
            <div className="col-auto">
              <input className="form-control" type="email" placeholder="Ingresa tu correo electrónico" />
            </div>
            <div className="col-auto">
              <button className="btn btn-light" type="submit">Regístrate</button>
            </div>
          </form>
          <p className="cta-note">
            Regístrate para recibir notificaciones cuando lancemos.
            <Link to="/terminos" className="text-light">Términos y Condiciones</Link>
          </p>
        </div>
      </section>
    </main>
    <footer className="footer bg-primary text-light py-4">
      <div className="container text-center">
        <figure className="my-4">
          <img src={footerLogo} alt="Logo Footer" className="img-fluid" style={{ maxWidth: '100px' }} />
        </figure>
        <p>&copy; Jinjardigans. Todos los derechos reservados.</p>
        <nav className="footer-nav">
          <Link to="/about" className="text-light mx-3">Sobre Nosotros</Link>
          <Link to="/contact" className="text-light mx-3">Contacto</Link>
          <Link to="/privacy" className="text-light mx-3">Política de Privacidad</Link>
        </nav>
      </div>
    </footer>
  </div>
);

export default Home;
