import { useContext, useRef, useState } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom'
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const enteredEmailInput = useRef('');
  const enteredPasswordInput = useRef('');
  const [isLogin, setIsLogin] = useState(true);
  const history = useHistory();
  const authContext = useContext(AuthContext);


  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const enteredEmail = enteredEmailInput.current.value;
    const enteredPassword = enteredPasswordInput.current.value;
    let url;
    if (!isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCWWq40CP26YmcP7ANrjvgMmZIRT_NDVlE';
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCWWq40CP26YmcP7ANrjvgMmZIRT_NDVlE';
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then(data => {
          let errorMessage = 'Authenticaton failed!'
          // if (data && data.error && data.error.message) {
          //   errorMessage = data.error.message;
          // }
          throw new Error(errorMessage)
        })
      }
    }).then(data => {
      const time = new Date(new Date().getTime() + (+data.expiredIn * 1000))
      authContext.login(data.idToken, time.toISOString());
      history.replaceState('/');
    }).catch(err => {
      alert(err.message)
    })
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' ref={enteredEmailInput} id='email' required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' ref={enteredPasswordInput} id='password' required />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
