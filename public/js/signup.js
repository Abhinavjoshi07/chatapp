const form = document.querySelector('form');
const usernameError = document.getElementById("username-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

form.addEventListener  ('submit', async function(e){
    e.preventDefault()

    const username = form.username.value
    const email = form.email.value
    const password = form.password.value

      //reset errors
      usernameError.innerHTML = '';
      emailError.innerHTML = '';
      passwordError.innerHTML = '';
      try {
        const res = await fetch('/signup', { 
          method: 'POST', 
          body: JSON.stringify({ username, email, password }),
          headers: {'Content-Type': 'application/json'}
        });
        const data = await res.json();
        
        if (data.errors) {
          usernameError.innerHTML = data.errors.username;
          emailError.innerHTML = data.errors.email;
          passwordError.innerHTML = data.errors.password;
         
        }
        if (data.user) {
          window.location.assign('/app.html');
          console.log("yes executed")

        }
  
      }
      catch (err) {
        console.log(err);
      }
  
    });