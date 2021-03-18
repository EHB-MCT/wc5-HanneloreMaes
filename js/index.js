"use strict";

const messageSystem = {
  startFetching() {
  },

  sendMessage(msg) {
    // https://thecrew.cc/api/message/create.php?token=__TOKEN__ POST
  },

  fetchMessages() {
    // https://thecrew.cc/api/message/read.php?token=__TOKEN__ GET
  }
};

const userSystem = {
  token: "",
  loggedIn: false,
  checkToken(){
      if (this.token !== null){
        userSystem.updateUser();
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
    const data = {email: email, password: password};                                                  /**/

    fetch('https:thecrew.cc/api/user/login.php', {method: 'POST', body: JSON.stringify(data)})        /*stringify zorgt voor leesbare code*/
      .then(response => response.json())                                                              /*response vragen aan json*/
      .then(data => {console.log("Succes",data); 
      this.token = data.token;                                                                        /*data.token is de token die ge krijgt bij inloggen*/
      this.saveToken(); });                                                                           /*token in lokale storage plaatsen*/
  },

  updateUser(password, handle) {
    // https://thecrew.cc/api/user/update.php?token=__TOKEN__ POST
    const dataHandle = {password: password, handle: handle};

    fetch(`https://thecrew.cc/api/user/update.php?token=${this.token}`, {method: 'POST'})
    .then(response => response.json());
    
  }

  
};

const display = {
  initFields() {
    const form = document.getElementById("loginForm");
    form.addEventListener('submit', this.submitHandler);

  },

  submitHandler(e) {
    e.preventDefault();
    const email = document.getElementById("emailField").value;
    const password = document.getElementById("passwordField").value;
    
    userSystem.login(email,password);
  }
};

  display.initFields();
  userSystem.checkToken();                                                          /*Bij inloggen token bijhouden en kijken of er een token aanwezig is en zo ja doorsturen naar pagina*/