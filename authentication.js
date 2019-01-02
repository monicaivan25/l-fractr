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

const modal = document.getElementById('login-form');
const txtEmail = document.getElementById("txtEmail");
const textPsw = document.getElementById("textPsw");
const loginBtn = document.getElementById("login");
const signupBtn = document.getElementById("signup");
const logoutBtn = document.getElementById("logout");

function exitModal(){
	modal.style.display = 'none';
	txtEmail.value='';
	textPsw.value='';
}

function validateEmail(inputText)
{
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if(inputText.match(mailformat))
	{
		return true;
	}
	else
	{
		alert("You have entered an invalid email address!");
		return false;
	}
}

loginBtn.addEventListener('click', e => {
	console.log("login")
	const email = txtEmail.value;
	const pass = textPsw.value;
	const auth = firebase.auth();
	if(validateEmail(email))
	{
		const promise = auth.signInWithEmailAndPassword(email, pass);
		promise.catch(e => console.log(e.message));
		exitModal();
		alert('Logged in');

	}
});

signupBtn.addEventListener('click', e =>{
	console.log("signup")
	const email = txtEmail.value;
	const pass = textPsw.value;
	const auth = firebase.auth();
	if(validateEmail(email))
	{
		const promise =  auth.createUserWithEmailAndPassword(email, pass);
		promise.catch(e => console.log(e.message));
		exitModal();
		alert('Signed up');
	}
});

logoutBtn.addEventListener('click', e => {
	console.log('logout');
	firebase.auth().signOut();
	exitModal();
	alert('Logged out');
});

firebase.auth().onAuthStateChanged(firebaseUser => {
	if(firebaseUser){
		console.log(firebaseUser);
		logoutBtn.style.display = 'block';
		loginBtn.style.display = 'none';
		signupBtn.style.display = 'none';
		writeUserData("email");

	} else {
		console.log('not logged in');
		logoutBtn.style.display = 'none';
		loginBtn.style.display = 'block';
		signupBtn.style.display = 'block';
	}
})

var database = firebase.database();

function writeUserData(email) {
	console.log(email);
	firebase.database().ref('users/' + email).set({
		caca: 2
	});
}
