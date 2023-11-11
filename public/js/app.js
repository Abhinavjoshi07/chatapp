const ul = document.querySelector('ul')
const form = document.querySelector('form')
const chatmsg = document.querySelector('.chat-messages')
const socket = io();
let sender;
let received;




const users = fetch('/api/users')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the JSON response
  })
  .then(data => {
    // 'data' now contains the array of usernames from the response
    
    sender = data.currentUserUsername;
    received = data.currentUserUsername;

     // You can use the data as needed
    data.allUsernames.forEach(username => {
      const li = document.createElement('li');
      const h2 = document.createElement('h2');
      h2.id = 'room-name';
      h2.textContent = username;
      li.appendChild(h2);
      ul.appendChild(li);

      
    });
    handleUsernameChange()
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });


// show message funtion 

function showMessages(username) {
  //db code here 
  const receiver = username;
  

  const data = {
    sender: sender,
    receiver: receiver,
  }
  console.log('sending the request with the data ', data)
  fetch('/api/chats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Specify the content type as JSON
    },
    body: JSON.stringify(data), // Convert the data to JSON format
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((data)=>{
         // Assuming you have a timestamp from the backend
        const timestampFromBackend = data.createdAt;

      // Convert the timestamp to a JavaScript Date object
        const date = new Date(timestampFromBackend);
   
      // Extract the time components
        const hours = date.getHours();
        const minutes = date.getMinutes();
      
   
      // Create a formatted time string
        const formattedTime = `${hours}:${minutes}`;
        // Handle the response from the server here
        if (username === data.sender) {
    
          const div = document.createElement("div");
          div.classList.add("message");
          div.innerHTML = `<p class="meta">${data.receiver} <span>${formattedTime}</span></p>
              <p class="text">
                  ${data.message}
              </p>`
          chatmsg.appendChild(div);
          chatmsg.scrollTop = chatmsg.scrollHeight
    
        }
    
        if(username === data.receiver){
    
          const div = document.createElement("div");
          div.classList.add("message");
          div.innerHTML = `<p class="meta"> you <span>${formattedTime}</span></p>
              <p class="text">
                  ${data.message}
              </p>`
          chatmsg.appendChild(div);
          chatmsg.scrollTop = chatmsg.scrollHeight
        }
      })
   
    })
    .catch((error) => {
      console.error('Error:', error);
    });
 

}

// event listeners

ul.addEventListener('click', (e) => {
  e.preventDefault()
  const username = e.target.textContent;
  const url = new URL(window.location.href);
  url.searchParams.delete('username');

  // Add the clicked username as a query parameter
  url.searchParams.set('username', username);
  window.location.href = url.toString();

})

function handleUsernameChange() {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username');

  if (username) {
    showMessages(username)
    // Call your showMessages function or perform any other actions here.
  }
}

// Handle username on initial load, refresh, and URL changes
// window.addEventListener('load', handleUsernameChange);
// window.addEventListener('popstate', handleUsernameChange);

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const msg = document.getElementById("msg")
  if (msg.value) {
    const urlParams = new URLSearchParams(window.location.search);
    const receiver = urlParams.get('username');
    
    socket.emit('chat', {msg:msg.value, sender, receiver})
    
    msg.value = '';
  }

})

   //listening for live messages
socket.on('chat', (data) => {
  
  const { msg, sender, receiver, timestamp } = data
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username');


  if((username === sender && received === receiver) || (username === receiver && sender === received)){
    
    // Assuming you have a timestamp from the backend
    const timestampFromBackend = timestamp;

   // Convert the timestamp to a JavaScript Date object
    const date = new Date(timestampFromBackend);

   // Extract the time components
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

   // Create a formatted time string
    const formattedTime = `${hours}:${minutes}`;

   // Display the formatted time
    

    if (username === sender) {
  
      const div = document.createElement("div");
      div.classList.add("message");
      div.innerHTML = `<p class="meta">${receiver} <span>${formattedTime}</span></p>
          <p class="text">
              ${msg}
          </p>`
      chatmsg.appendChild(div);
      chatmsg.scrollTop = chatmsg.scrollHeight

    }

    if(username === receiver){

      const div = document.createElement("div");
      div.classList.add("message");
      div.innerHTML = `<p class="meta"> you <span>${formattedTime}</span></p>
          <p class="text">
              ${msg}
          </p>`
      chatmsg.appendChild(div);
      chatmsg.scrollTop = chatmsg.scrollHeight
    }



  }
})
















