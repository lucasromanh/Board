
import Navbar from './Navbar';
import { Link } from 'react-router-dom'; 
import './Home.css';
import heroImage from '../assets/logo.svg'; 

const Home = () => (
  <div className="home-container">
    <Navbar />
    <main className="main-content">
      <section className="banner-section">
        <div className="banner-text">
          <h1>La plataforma completa para construir proyectos de forma colaborativa</h1>
          <p>Componentes bellamente diseñados que puedes usar para crear tu aplicación. Accesibles. Personalizables. Código Abierto.</p>
          <Link to="/register" className="hero-button">Regístrate</Link>
        </div>
        <div className="banner-image">
          <img src={heroImage} alt="Hero" />
        </div>
      </section>
      <section className="features-section">
        <div className="feature">
          <h2>Escalabilidad infinita, configuración cero</h2>
          <p>Permite que el código se ejecute según demanda sin necesidad de administrar tu propia infraestructura o actualizar hardware.</p>
        </div>
        <div className="feature">
          <h2>Información y controles en tiempo real</h2>
          <p>Obtén métricas granulares de primera mano sobre el rendimiento del sitio por despliegue.</p>
        </div>
        <div className="feature">
          <h2>Personalización en el borde</h2>
          <p>Ofrece contenido dinámico y personalizado, asegurando que los usuarios solo vean la mejor versión de tu sitio.</p>
        </div>
      </section>
      <section className="cta-section">
        <h2>Experimenta el flujo de trabajo que los mejores equipos de frontend aman</h2>
        <p>Permite que tu equipo se centre en enviar características en lugar de administrar la infraestructura con CI/CD automatizado.</p>
        <form className="cta-form">
          <input type="email" placeholder="Ingresa tu correo electrónico" />
          <button type="submit">Regístrate</button>
        </form>
        <p className="cta-note">
          Regístrate para recibir notificaciones cuando lancemos.
          <Link to="/terminos">Términos y Condiciones</Link>
        </p>
      </section>
    </main>
  </div>
);

export default Home;
