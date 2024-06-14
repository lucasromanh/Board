import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import 'bulma/css/bulma.min.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    birthDate: '',
    city: '',
    password: '',
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-half">
          <form onSubmit={handleSubmit} className="box">
            <h1 className="title">Registro</h1>
            <div className="field">
              <label className="label" htmlFor="firstName">Nombre</label>
              <div className="control">
                <input className="input" type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="lastName">Apellido</label>
              <div className="control">
                <input className="input" type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="username">Nombre de usuario</label>
              <div className="control">
                <input className="input" type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="email">Correo Electrónico</label>
              <div className="control">
                <input className="input" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="phone">Teléfono</label>
              <div className="control">
                <input className="input" type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="birthDate">Fecha de Nacimiento</label>
              <div className="control">
                <input className="input" type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="city">Ciudad</label>
              <div className="control">
                <input className="input" type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="password">Contraseña</label>
              <div className="control">
                <input className="input" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button className="button is-link">Registrarse</button>
              </div>
            </div>
            <div className="field">
              <div className="buttons">
                <button className="button is-link is-light">Registrar con Google</button>
                <button className="button is-link is-light">Registrar con Facebook</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
