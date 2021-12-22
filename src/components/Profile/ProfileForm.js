import { useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const usePassRef = useRef();
  const history = useHistory();
  const ctx = useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault();
    const pass = usePassRef.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCWWq40CP26YmcP7ANrjvgMmZIRT_NDVlE', {
      method: 'POST',
      body: JSON.stringify({
        idToken: ctx.token,
        password: pass,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      alert('Password Changed');
      ctx.logout();
      history.replace('/');
    });
  }
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' minLength="7" ref={usePassRef} id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
