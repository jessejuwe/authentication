import { useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../../store/auth-context';
import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const authCTX = useContext(AuthContext);

  const isLoggedIn = authCTX.isLoggedIn;

  const logoutHandler = () => authCTX.logout();

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/profile">Profiles</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/">
                <button onClick={logoutHandler}>Logout</button>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
