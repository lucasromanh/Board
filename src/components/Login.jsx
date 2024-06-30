import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import 'bulma/css/bulma.min.css';

const Login = () => {
  const [CorreoElectronico, setCorreoElectronico] = useState('');
  const [Password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ CorreoElectronico, Password });
      navigate('/board');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-half">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="CorreoElectronico">Correo Electrónico</label>
              <div className="control">
                <input
                  className="input"
                  type="email"
                  id="CorreoElectronico"
                  value={CorreoElectronico}
                  onChange={(e) => setCorreoElectronico(e.target.value)}
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
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button className="button is-primary" type="submit">
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
