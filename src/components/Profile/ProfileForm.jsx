import { useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { API_KEY } from '../../helpers/helper';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const newPasswordInputRef = useRef();

  const authCTX = useContext(AuthContext);

  const history = useHistory();

  const submithandler = async event => {
    event.preventDefault();

    setIsUpdating(true);

    const enteredPassword = newPasswordInputRef.current.value;

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`;

    const postMethod = {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCTX.token,
        password: enteredPassword,
        returnSecureToken: false,
      }),
      headers: { 'Content-Type': 'application/json' },
    };

    try {
      // TODO: Add more validation

      if (enteredPassword.trim().length === 0) {
        setIsUpdating(false);
        throw new Error('Enter a valid password!');
      }

      if (enteredPassword.trim().length < 7) {
        setIsUpdating(false);
        throw new Error('Password length is too short!');
      }

      const response = await fetch(url, postMethod);

      // Guard clause
      if (!response.ok) throw new Error('Password failed to update!');

      setIsUpdating(false);

      newPasswordInputRef.current.value = '';

      history.replace('/');
    } catch (error) {
      setIsUpdating(false);
      alert(`💥 ${error.message} 💥`);
    }
  };

  return (
    <form onSubmit={submithandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input ref={newPasswordInputRef} type="password" id="new-password" />
      </div>
      <div className={classes.action}>
        <button className={isUpdating ? classes.updating : ''}>
          {isUpdating ? 'Updating...' : 'Change Password'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
