document.addEventListener('DOMContentLoaded', function() {
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  // By default, load the inbox
  load_mailbox('inbox');
  
  document.querySelector('form').onsubmit = () =>{
    id = document.querySelector('#compose-recipients').value;
    subject = document.querySelector('#compose-subject').value;
    body = document.querySelector('#compose-body').value;
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: id,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
    return false;
  };
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields


  console.log("HI");
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  if(mailbox=='inbox'){
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);
      const temp = document.querySelector('#emails-view');
      for(var email in emails){
        const maindiv = document.createElement('div');
        const iddiv = document.createElement('div');
        const datediv = document.createElement('div');
        const subjectdiv = document.createElement('div');
        maindiv.classList.add('mail');
        iddiv.classList.add('id');
        subjectdiv.classList.add('subject');
        datediv.classList.add('date');
        iddiv.innerHTML = emails[email].sender;
        datediv.innerHTML = emails[email].timestamp;
        subjectdiv.innerHTML = emails[email].subject;
        maindiv.append(iddiv);
        maindiv.append(subjectdiv);
        maindiv.append(datediv);
        temp.append(maindiv);
      }


      // ... do something else with emails ...
    });
  }
  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}