$(document).ready(function () {
  var selUser = document.getElementById('selUser');
  var divMessage = document.getElementById('message');
  var openLogin = document.getElementById('openLogin');
  var openSignin = document.getElementById('openLogin');
  var closeLogin = document.getElementById('openLogin');
  var divLogin = document.getElementById('divLogin');
  var verifLogin = document.getElementById('verifLogin');
  var newMessage = document.getElementById('newMessage');


  $("#divLogin").hide();
  $("#divSignin").hide();
  $("#closeLogin").hide();

  $("#openLogin").click(function () {
    if (divLogin.style.display == 'none') {
      $("#divLogin").show();
    } else {
      $("#divLogin").hide();
    }
  });

  $("#openSignin").click(function () {
    if (divSignin.style.display == 'none') {
      $("#divSignin").show();
    } else {
      $("#divSignin").hide();
    }
  });


  $("#verifLogin").click(function () {
    login();
    $("#openLogin").hide();
    $("#divLogin").hide();
    $("#closeLogin").show();
    $("#newMessage").show();
  });

  $("#verifSignin").click(function (){
    signin();
    $("#divSignin").hide();

  })


  $("#selUser").change(function () {
    $("#message").empty();

    var valeur = $("#selUser").val();
    getMessageById(valeur);
  })


  $("#closeLogin").click(function () {
    localStorage.setItem('token', '');
    console.log('token' + localStorage.getItem('token'))
    $("#openLogin").show();
    $("#closeLogin").hide();
    $("#newMessage").hide();


  })

  function signin() {
    var valeurEmail = $("#email").val();
    var valeurPrenom = $("#prenom").val();
    var valeurNom = $("#nom").val();
    var valeurPassword = $("#passwordS").val();

    userSignIn(valeurEmail, valeurPassword, valeurNom, valeurPrenom);


  }

  function login() {
    var valeurEmail = $("#login").val();
    var valeurPassword = $("#password").val();

    authOneUser(valeurEmail, valeurPassword);


  }
  function getUser() {
    var request = $.ajax({
      url: "https://s3-4393.nuage-peda.fr/forum/public/api/users",
      method: "GET",
      dataType: "json",
      beforeSend: function (xhr) {
        xhr.overrideMimeType("application/json; charset=utf-8");
      }
    });
    request.done(function (user) {
      user.sort(function (a, b) {
        if (a.nom < b.nom) {
          return -1;
        } else {
          return 1;
        }
      })
      $.each(user, function (index, e) {
        var option = document.createElement("option");
        selUser.appendChild(option);
        option.innerText = e.prenom + " " + e.nom;
        option.value = e.id;

      })

    });


    // Fonction qui se lance lorsque l’accès au web service provoque une erreur         
    request.fail(function (jqXHR, textStatus) {
      alert('erreur');
    });
  }    // Appel de la fonction ajax    
  getUser();





  function getMessageById(valeur) {
    var request = $.ajax({
      url: "https://s3-4393.nuage-peda.fr/forum/public/api/users/" + valeur,
      method: "GET",
      dataType: "json",
      beforeSend: function (xhr) {
        xhr.overrideMimeType("application/json; charset=utf-8");
      }
    });

    request.done(function (user) {
      $.each(user.messages, function (index, e) {
        console.log(e);
        var paragraphe = document.createElement("p");
        divMessage.appendChild(paragraphe);
        date = new Date(e.datePoste);
        paragraphe.innerText = "Message n°" + e.id + " - " + e.titre + " posté le : " + date.getDay() + "-" + date.getMonth() + "-" + date.getFullYear() + "\n" + e.contenu

      })

    });
  }

  /*
  function patch() {
    console.log(localStorage.getItem('token'));
    var request = $.ajax({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/merge-patch+json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      url: "https://s3-4400.nuage-peda.fr/forum/public/api/users/164",
      method: "PATCH",
      data: JSON.stringify({
        email: "alexandria.duhamel@nuage-pedagogique"
  
      }),
      beforeSend: function (xhr) {
        xhr.overrideMimeType("application/json; charset=utf-8");
      }
    });
    request.done(function (msg, textStatus, jqXHR) {
      console.log(msg);
    });
    // Fonction qui se lance lorsque l’accès au web service provoque une erreur 
    request.fail(function (jqXHR, textStatus) {
      console.log('erreur');
    });
  }
  

  
  function auth() {
    var request = $.ajax({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      url: "https://s3-4393.nuage-peda.fr/forum/public/api/authentication_token",
      method: "POST",
      data: JSON.stringify({
        email: "audrey.rousseau@free.fr",
        password: "audrey",
  
      }),
      dataType: "json",
      beforeSend: function (xhr) {
        xhr.overrideMimeType("application/json; charset=utf-8");
      }
    });
  
    request.done(function (msg) {
      console.log(msg.token);
      localStorage.setItem('token', msg.token);
    });
    request.fail(function (jqXHR, textStatus, error) {
      console.log(error);
    });
  }
  */

  function authOneUser(email, password) {
    var request = $.ajax({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      url: "https://s3-4393.nuage-peda.fr/forum/public/api/authentication_token",
      method: "POST",
      data: JSON.stringify({
        email: email,
        password: password,

      }),
      dataType: "json",
      beforeSend: function (xhr) {
        xhr.overrideMimeType("application/json; charset=utf-8");
      }
    });

    request.done(function (msg) {
      console.log(msg);
      console.log(msg.token);
      localStorage.setItem('token', msg.token);
    });
    request.fail(function (jqXHR, textStatus, error) {
      console.log(error);
    });
  }

  function userSignIn(email, password, nom, prenom) {
    var request = $.ajax({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      url: "https://s3-4393.nuage-peda.fr/forum/public/api/users",
      method: "POST",
      data: JSON.stringify({
        email: email,
        roles: ["ROLE_USER"],
        password: password,
        nom: nom,
        prenom: prenom,
        dateInscription: new Date(),
        messages: []
        

      }),
      dataType: "json",
      beforeSend: function (xhr) {
        xhr.overrideMimeType("application/json; charset=utf-8");
      }
    });
    request.done(function (msg) {
      console.log(email);
      console.log(nom);
      console.log(prenom);
      console.log(password);
    });
    request.fail(function (jqXHR, textStatus, error) {
      console.log(error);
    });

  }




});



