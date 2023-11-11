const form = document.querySelector('form');
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
 

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // reset errors
  emailError.innnerHTML = '';
  passwordError.innerHTML = '';

  // get values
  const email = form.email.value;
  const password = form.password.value;

  try {
    const res = await fetch('/login', { 
      method: 'POST', 
      body: JSON.stringify({ email, password }),
      headers: {'Content-Type': 'application/json'}
    });
    const data = await res.json();
    
    if (data.errors) {
      emailError.innerHTML = data.errors.email;
      passwordError.innerHTML = data.errors.password;
    }
    if (data.user) {
      location.assign('/app.html');
    }

  }
  catch (err) {
    console.log(err);
  }
});