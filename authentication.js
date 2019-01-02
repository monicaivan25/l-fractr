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
const modalContent = document.getElementsByClassName("modal-content")[0];
const title = document.getElementById("title");
const gallery = document.getElementById("gallery");
const saveFireBtn = document.getElementById("save-remote");
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
		loggedUser = getFolderNameForEmail(email);
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
		loggedUser = firebaseUser.email;
		console.log(firebaseUser);
		title.style.display = 'block';
		gallery.style.display = 'block';
		modalContent.style.width = '780px';
		txtEmail.style.display = 'none';
		textPsw.style.display = 'none';
		logoutBtn.style.display = 'inline-block';
		loginBtn.style.display = 'none';
		signupBtn.style.display = 'none';
		saveFireBtn.style.display = 'block';
	} else {
		console.log('not logged in');
		title.style.display = 'none';
		gallery.style.display = 'none';
		modalContent.style.width = '400px';
		txtEmail.style.display = 'block';
		textPsw.style.display = 'block';
		logoutBtn.style.display = 'none';
		loginBtn.style.display = 'block';
		signupBtn.style.display = 'block';
		saveFireBtn.style.display = 'none';

	}
})

String.prototype.hashCode = function() {
	var hash = 0;
	if (this.length == 0) {
		return hash;
	}
	for (var i = 0; i < this.length; i++) {
		var char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

