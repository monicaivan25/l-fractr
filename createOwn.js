  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAZxvFhAhfPt__c6jb1aLTUM8jhdzD44eg",
    authDomain: "l-fractr.firebaseapp.com",
    databaseURL: "https://l-fractr.firebaseio.com",
    projectId: "l-fractr",
    storageBucket: "l-fractr.appspot.com",
    messagingSenderId: "480520325235"
  };
  firebase.initializeApp(config);

  const txtEmail = document.getElementById("txtEmail");
  const textPsw = document.getElementById("textPsw");
  const loginBtn = document.getElementById("login");
  const signupBtn = document.getElementById("signup");

  loginBtn.addEventListener('click', e => {
    console.log("login")
    const email = txtEmail.value;
    const pass = textPsw.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message))
  });
  
  signupBtn.addEventListener('click', e =>{
    console.log("signup")
    const email = txtEmail.value;
    const pass = textPsw.value;
    const auth = firebase.auth();
    const promise =  auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message))
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      console.log(firebaseUser);
    } else {
      console.log('not logged in');
    }
  })