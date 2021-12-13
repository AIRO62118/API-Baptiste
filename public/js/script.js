$(document).ready(function () {
    var selUser = document.getElementById('selUser');
    var divMessage = document.getElementById('message');

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



    $("#selUser").change(function () {
        $("#message").empty();

        var valeur = $("#selUser").val();
        getMessageById(valeur);
    })

function getMessageById(valeur){
    var request = $.ajax({
        url: "https://s3-4393.nuage-peda.fr/forum/public/api/users/"+valeur,
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
            paragraphe.innerText ="Message n°"+e.id+" - "+e.titre+" posté le : "+date.getDay()+"-"+date.getMonth()+"-"+date.getFullYear()+"\n"+e.contenu
            
        })

    });
}


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
      url: "https://s3-4400.nuage-peda.fr/forum/public/api/authentication_token",
      method: "POST",
      data: JSON.stringify({
        email: "alexandria.duhamel@nuage-pedagogique",
        password: "alexandria",

      }),
      dataType: "json",
      beforeSend: function (xhr) {
        xhr.overrideMimeType("application/json; charset=utf-8");
      }
    });

    request.done(function (msg) {
      console.log(msg.token);
      localStorage.setItem('token', msg.token);
      patch();
    });
    request.fail(function (jqXHR, textStatus, error) {
      console.log(error);
    });

  }
  auth();

});

