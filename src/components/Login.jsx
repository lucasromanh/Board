import 'bulma/css/bulma.min.css';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Login.css'; // Importa el archivo CSS con la clase de fondo
import Navbar from './Navbar';

const Login = () => {
  const [formData, setFormData] = useState({ CorreoElectronico: '', Password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data on submit:', formData); // Asegúrate de que los datos del formulario son correctos
    try {
      const user = await login(formData);
      console.log('User data after login:', user);  
      navigate('/board');
    } catch (error) {
      console.error('Error during login:', error.message);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="login-background">
      <Navbar /> 
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half">
            <form onSubmit={handleSubmit} className="box">
              <div className="field">
                <label className="label">Correo Electrónico</label>
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    name="CorreoElectronico"
                    value={formData.CorreoElectronico}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Contraseña</label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-primary">Login</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
