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
    });
    return true;
  };
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#current-mail').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields

}


function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#current-mail').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  if(mailbox=='inbox'){
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
      // Print emails
      const temp = document.querySelector('#emails-view');
      for(var email in emails){
        const maindiv = document.createElement('div');
        const iddiv = document.createElement('div');
        const datediv = document.createElement('div');
        const subjectdiv = document.createElement('div');
        const id = document.createElement('input');
        id.setAttribute('type','text');
        id.setAttribute('value',email);
        id.setAttribute('hidden','true');
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
        maindiv.append(id);
        temp.append(maindiv);
      }
        document.querySelectorAll('.mail').forEach(item =>{
          item.addEventListener('click', event =>{
            current_mail(emails[item.querySelector('input').value]);
          });
        });
    });
  }
  else if(mailbox == 'sent'){
    fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {
      // Print emails
      const temp = document.querySelector('#emails-view');
      for(var email in emails){
        const maindiv = document.createElement('div');
        const iddiv = document.createElement('div');
        const datediv = document.createElement('div');
        const subjectdiv = document.createElement('div');
        const id = document.createElement('input');
        id.setAttribute('type','text');
        id.setAttribute('value',email);
        id.setAttribute('hidden','true');
        maindiv.classList.add('mail');
        iddiv.classList.add('id');
        subjectdiv.classList.add('subject');
        datediv.classList.add('date');
        iddiv.innerHTML = emails[email].recipients;
        datediv.innerHTML = emails[email].timestamp;
        subjectdiv.innerHTML = emails[email].subject;
        maindiv.append(iddiv);
        maindiv.append(subjectdiv);
        maindiv.append(datediv);
        maindiv.append(id);
        temp.append(maindiv);
      }
      document.querySelectorAll('.mail').forEach(item =>{
        item.addEventListener('click', event =>{
          current_mail(emails[item.querySelector('input').value]);
        });
      });
    });
  }
  else if(mailbox == 'archive'){
    fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {
      // Print emails
      const temp = document.querySelector('#emails-view');
      for(var email in emails){
        const maindiv = document.createElement('div');
        const iddiv = document.createElement('div');
        const datediv = document.createElement('div');
        const subjectdiv = document.createElement('div');
        const id = document.createElement('input');
        id.setAttribute('type','text');
        id.setAttribute('value',email);
        id.setAttribute('hidden','true');
        maindiv.classList.add('mail');
        iddiv.classList.add('id');
        subjectdiv.classList.add('subject');
        datediv.classList.add('date');
        iddiv.innerHTML = emails[email].recipients;
        datediv.innerHTML = emails[email].timestamp;
        subjectdiv.innerHTML = emails[email].subject;
        maindiv.append(iddiv);
        maindiv.append(subjectdiv);
        maindiv.append(datediv);
        maindiv.append(id);
        temp.append(maindiv);
      }
      document.querySelectorAll('.mail').forEach(item =>{
        item.addEventListener('click', event =>{
          current_mail(emails[item.querySelector('input').value]);
        });
      });
    });
  }

  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function current_mail(email){

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#current-mail').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  const temp = document.querySelector('#current-mail');
  temp.innerHTML = "";
  const details = document.createElement('div');
  const body = document.createElement('div');

  const replyButton = document.createElement('button');
  replyButton.className = 'btn btn-outline-primary';
  replyButton.innerHTML = "Reply";
  replyButton.onclick = () => {
    document.querySelector('#compose-recipients').value = email.sender;
    document.querySelector('#compose-recipients').disabled = true;
    compose_email();
  };
  const archiveButton = document.createElement('button');
  archiveButton.className = 'btn btn-outline-primary';
  archiveButton.innerHTML = "Archive";
  archiveButton.onclick = () => {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
    document.location.reload(true);
    load_mailbox('inbox');
  };

  details.innerHTML = `<b>From:</b> ${email.sender} <br> <b>To:</b> ${email.recipients} <br> <b>Subject:</b> ${email.subject} <br> <b>Timestamp:</b> <br> ${email.timestamp} <br>`;
  details.append(replyButton);
  details.append(archiveButton);
  body.innerHTML = `<hr> ${email.body}`;
  temp.append(details);
  temp.append(body);
}