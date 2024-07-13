import 'bulma/css/bulma.min.css';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from './Navbar';

const Register = () => {
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    CorreoElectronico: '',
    Password: '',
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/board');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar /> 
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half">
            <form onSubmit={handleSubmit} className="box">
              <h1 className="title">Registro</h1>
              <div className="field">
                <label className="label" htmlFor="Nombre">Nombre</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    id="Nombre"
                    name="Nombre"
                    value={formData.Nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="Apellido">Apellido</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    id="Apellido"
                    name="Apellido"
                    value={formData.Apellido}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="CorreoElectronico">Correo Electrónico</label>
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    id="CorreoElectronico"
                    name="CorreoElectronico"
                    value={formData.CorreoElectronico}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="Password">Contraseña</label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    id="Password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="field is-grouped">
                <div className="control">
                  <button className="button is-link">Registrarse</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;