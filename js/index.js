"use strict";

const messageSystem = {
  startFetching() {
    setInterval(() => {                                                                                 /*Nodig om de pagina automatisch te laten refreshen*/
      this.fetchMessages();
    }, 10);
  },

  sendMessage(msg) {
    // https://thecrew.cc/api/message/create.php?token=__TOKEN__ POST
    fetch(`https://thecrew.cc/api/message/create.php?token=${userSystem.token}`, {                       /*Telkens gebruik maken van userSystem omdat token in ander object staat en ook om zeker te weten dat we de juiste hebben*/
        method: 'POST',
        body: JSON.stringify({
          "message": msg                                                                                  /*Bij message moeten we message vanuit inputfield halen, hetzelfde als chatbot wc3 ook voor het weergeven van de messages*/
        })                                                                                                /*Het oproepen van de message moet gedaan worden bij initfields om dan als parameter msg mee te geven aan sendMessage*/
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);})
      .catch(error => console.log("error"));
  },

  fetchMessages() {
    // https://thecrew.cc/api/message/read.php?token=__TOKEN__ GET
    fetch(`https://thecrew.cc/api/message/read.php?token=${userSystem.token}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const container = document.getElementById("output");
        container.innerHTML = "";
        data.forEach(messages => {                                                                        /*ophalen van het element vanuit de html om zichtbare acties uit te voeren*/
          const tekst = `<div class="message">
          <span class="by">${messages.handle}</span>
          <span class="on">${messages.created_at}</span>
          <p>${messages.message}</p>                                                                
          </div>`;                                                                                        /*messages.message slaat op de variable da we aan de forEach hebben gegeven en de message is de message da we hale uit het inputfield*/
          container.insertAdjacentHTML("beforeEnd", tekst);                                               /*Before end gebruiken om alles meldingen achter elkaar weer te geven*/
        });
      });
  }
};

const userSystem = {
  token: "",
  loggedIn: false,
  checkToken(){
      if (this.token !== null){
        this.token = userSystem.token;
        messageSystem.fetchMessages();
 
        document.getElementById('loginWindow').style.display = 'none';                              /*gebruik van een style.display om dat inlogscherm iedere keer als de token overeenkomt te skippen*/
      }
    },

  saveToken() {
    localStorage.setItem("token", this.token);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  logout() { 
    localStorage.removeItem("token");
  },

  login(email, password) {
    // https://thecrew.cc/api/user/login.php POST
    console.log(email, password);
    const data = {email: email, password: password};                                                  /*de eerste e-mail staat voor de naam die in de const data wordt gebruikt voor het aanroepen in verdere code.  De tweede e-mail is de value die opgehaald hebben in submithandler waaraan we de variabel e-mail aan gelijk gaan stellen*/

    fetch('https:thecrew.cc/api/user/login.php', {method: 'POST', body: JSON.stringify(data)})        /*stringify zorgt voor leesbare code*/
      .then(response => response.json())                                                              /*response vragen aan json*/
      .then(data => {console.log("Succes",data); 
      this.token = data.token;                                                                        /*data.token is de token die ge krijgt bij inloggen*/
      messageSystem.fetchMessages();
      document.getElementById('loginWindow').style.display = 'none';
      this.saveToken(); 
    });                                                                                               /*token in lokale storage plaatsen*/
  
  },

  updateUser(password, handle) {
    // https://thecrew.cc/api/user/update.php?token=__TOKEN__ POST
    const dataHandle = {password: password, handle: handle};

    fetch(`https://thecrew.cc/api/user/update.php?token=${userSystem.token}`, {method: 'POST'})
    .then(response => response.json())
    .then();
  }

  
};

const display = {
  initFields() {
    const form = document.getElementById("loginForm");
    form.addEventListener('submit', this.submitHandler);
  
    const messageForm = document.getElementById("messageForm");                                      /*messageForm moet opgehaald worden om de input vanuit het field te halen en te sturen naar de api*/
    messageForm.addEventListener("submit", e => {
      e.preventDefault();
      const message = document.getElementById("MessageField");
      messageSystem.sendMessage(message);
    });

  },

  submitHandler(e) {                                                                                /*Input van velden ophalen en de value sturen naar API voor login uit te voeren*/
    e.preventDefault();
    const email = document.getElementById("emailField").value;
    const password = document.getElementById("passwordField").value;
    
    userSystem.login(email,password);                                                               /*Sturen van input naar login met de juiste parameters*/
  }
};

  display.initFields();
  userSystem.checkToken();                                                                          /*Bij inloggen token bijhouden en kijken of er een token aanwezig is en zo ja doorsturen naar pagina*/