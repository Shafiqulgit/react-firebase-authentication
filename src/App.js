import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from "react";
import './App.css';
import initializeAuthentication from './firebase/firebase.init';

initializeAuthentication();
const googleProvider = new GoogleAuthProvider();

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //work -5
  const [error, setError] = useState('');
  
  //work -6
  const [isLogin, setIsLogin] = useState(false);



  const auth = getAuth();
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
    .then(resutl => {
      const user = resutl.user;
      // console.log(user)
    })
  }

  //work-------------------6
  const toggleLogin = e => {
    setIsLogin(e.target.checked);
  }

  //work----------8
  const handleNameChange = e => {
    setName(e.target.value);
  }

  // Email Change Function setEmail koresi
  const handleEmailChange = e => {
    setEmail(e.target.value);
  }

  // Password Change Function setPassword koresi
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }

  // (email, password) k useState er ta console log koresi
  const handleRegistration = e => {
    //  e.preventDefault(); prothomai declar kora hoy karon page ta nutun kore relod nibena work-5
    e.preventDefault();
    console.log(email, password);

    if(password.length < 6){
      setError('Password Must be at last 6 characters log');
      return;
    }
    if(!/(?=.*[A-Z]).*[A-Z]/.test(password)){
      setError('Password Must contain 2 upper case');
      return;
    }

    if(isLogin){
      processLogin(email, password);
      }
      else {
        registerNewUser(email, password);
      }
    }

  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(resutl => {
      const user = resutl.user;
      console.log(user)
      setError('');
    })
    .catch((error) => {
      setError(error.message);
      // ..
    });

  }

  //work -------------------6
  const registerNewUser = (email, password) => {
    //work -5
    createUserWithEmailAndPassword(auth, email, password)
    .then(resutl => {
      const user = resutl.user;
      console.log(user)
      setError('');
      //work----------7
      verifyEmail();
      //work----------8
      setUserName();
    })
    .catch((error) => {
      setError(error.message);
      // ..
    });
//  e.preventDefault(); declar korle page reload nibe work-5
  }
  const setUserName = () => {
    updateProfile(auth.currentUser, {displayName: name})
    .then(result => {})
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then(resutl =>{
      console.log(resutl);
    })
  }

  // work----------7
  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email);
  }

  //input email change & password change a required set koresi
  return (
    <div className="mx-5">
<form onSubmit ={handleRegistration}>
  <h3 className="text-primary text-center">Please {isLogin ? 'Login' : 'Reginster'}</h3>
  {/* work--------8 */}
 {!isLogin && <div className="row mb-3">
  <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
    <div className="col-sm-10">
    <input type="text" onBlur={handleNameChange} className="form-control" placeholder="Your Name" />
    </div>
  </div>}

  <div className="row mb-3">
    <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
    <div className="col-sm-10">
      <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required/>
    </div>
  </div>
  <div className="row mb-3">
    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
    <div className="col-sm-10">
      <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" required/>
    </div>
  </div>
  <div className="row mb-3">
    <div className="col-sm-10 offset-sm-2">
      <div className="form-check">
        <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1" />
        <label className="form-check-label" htmlFor="gridCheck1">
          Already Registered
        </label>
      </div>
    </div>
  </div>
  <div className="row mb-3 text-danger">{error}</div>
  <button onBlur={handleGoogleSignIn} type="submit" className="btn btn-primary">{isLogin ? 'Login' : 'Register'}</button>
  <button type="button" onClick={handleResetPassword} className="btn btn-secondary btn-sm">Reset Password</button>
</form>
    </div>
  );
}

export default App;
