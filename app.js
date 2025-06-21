let candidatos = []
let votos

if (localStorage.resultadovotos){
  votos = JSON.parse(localStorage.resultadovotos)
} else{
  votos = [0,0,0,0]
  localStorage.setItem("resultadovotos",JSON.stringify(votos))
}

obtenercandidatos()

function obtenercandidatos(){
    let url = "https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/candidatos.json"
    let opciones = {
        "method": "GET"
    }
    fetch(url,opciones)
    .then(respuesta=>respuesta.json())
    .then(datos=>{
        console.log(datos)
        candidatos=datos
        mostrarCandidatos()
        mostrarResultadosFinales()

    })

    .catch(error=>console.log(error))
}


function mostrarCandidatos() {

  const divcandidatos = document.querySelector("#candidatos")

  candidatos.forEach((candidato, index) => {

      let divcandidato = document.createElement("div")
        divcandidato.classList.add("card")
        divcandidato.classList.add("col-sm-3")

      let header = document.createElement("div")
        header.classList.add("card-header")
        header.textContent = candidato.curso
      divcandidato.appendChild(header)

      let body = document.createElement("div")
        body.classList.add("card-body")
        let foto = document.createElement("img")
        foto.src = candidato.foto
      body.appendChild(foto)
      divcandidato.appendChild(body)

      let footer = document.createElement("div")
        footer.classList.add("card-footer")
        let aprendiz = document.createElement("p")
        aprendiz.innerHTML = "<p><b>Aprendiz:</b> " + candidato.nombre + " " + candidato.apellido 
        footer.appendChild(aprendiz)
        let ficha = document.createElement("p")
        ficha.innerHTML = "<p><b>Ficha:</b> " + candidato.ficha
        footer.appendChild(ficha)
      divcandidato.appendChild(footer)

      divcandidatos.appendChild(divcandidato)

    foto.addEventListener("click", () => {
      const votacionesCerradas = localStorage.getItem("votacionesCerradas") === "true";

      if (votacionesCerradas) {
        Swal.fire({
          title: "Votaciones cerradas",
          icon: "error",
          confirmButtonText: "Aceptar"
        });
      return
      }

      Swal.fire({
      title: "¿Deseas votar por " + candidato.nombre + "?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#06D001",
      cancelButtonColor: "#FC2947",
      confirmButtonText: "Votar",
      cancelButtonText: "Cancelar"
        }).then((result) => {
        if (result.isConfirmed) {
        Swal.fire({
        title: "¡Voto registrado!",
        icon: "success",
        timer: 1000,
        showConfirmButton: false
        });
        votos[index]++
    localStorage.setItem("resultadovotos", JSON.stringify(votos))
        }});
    })
  })
}



function iniciarsesion() {
    const btningresar = document.querySelector("#btningresar");

    if (btningresar) {
        btningresar.addEventListener("click", (e) => {
            e.preventDefault(); // evita que recargue la página

            const user = document.querySelector("#usuario").value;
            const pass = document.querySelector("#contraseña").value;

            if (user === "" || pass === "") {
              Swal.fire({
                  icon: "warning",
                  title: "Campos vacíos",
                  confirmButtonText: "Aceptar"
              });
              return
            }


            let url = "https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/administrador.json";
            let opciones = {
                method: "GET"
            }

            fetch(url, opciones)
                .then(respuesta => respuesta.json())
                .then(admin => {
                    if (admin.username === user && admin.password === pass) {
                        localStorage.setItem("logueado", "true");

                        if (localStorage.getItem("reabrir") === "true") {
                            localStorage.setItem("votacionesCerradas", "false")
                            localStorage.setItem("reabrir", "false")
                            localStorage.setItem("resultadovotos", JSON.stringify([0, 0, 0, 0]))
                        }

                        Swal.fire({
                            icon: "success",
                            title: "Inicio de sesión exitoso",
                            showConfirmButton: false,
                            timer: 1000
                        }).then(() => {
                            window.location.href = "app.html"
                        })

                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Usuario o contraseña incorrectos",
                            confirmButtonText: "Intentar de nuevo"
                        });
                    }


                })

                .catch(error=>console.log(error))
        })
    }
}



function mostrarResultadosFinales() {
  const cerradas = localStorage.getItem("votacionesCerradas") === "true"
  const logueado = localStorage.getItem("logueado") === "true"

  if (cerradas && logueado) {
    const div = document.createElement("div")
    div.classList.add("mt-4")

    const titulo = document.createElement("h1")
    titulo.textContent = "Resultados de la Votación"
    div.appendChild(titulo)

    const ul = document.createElement("ul")
    votos.forEach((voto,i) => {
      const li = document.createElement("li")
      li.innerHTML = "<b>" + candidatos[i].nombre + " " + candidatos[i].apellido + ": </b> " + votos[i] + " votos<br>"
      ul.appendChild(li)
    })

    div.appendChild(ul)
    document.querySelector(".container").appendChild(div)
  }
}

if (document.querySelector("#btningresar")) {
    iniciarsesion()
}



function cerrarVotaciones() {
  const btnCerrar = document.querySelector("#btncerrar");

  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Debes iniciar sesión nuevamente para ver los resultados.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#06D001",
        cancelButtonColor: "#FC2947",
        confirmButtonText: "Cerrar Votaciones"
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem("votacionesCerradas", "true")
          localStorage.setItem("logueado", "false")

          window.location.href = "sesion.html"
        }
      });
    })
  }
}



function iniciarVotaciones() {
  const btnIniciar = document.querySelector("#btniniciar");

  if (btnIniciar) {
    const cerradas = localStorage.getItem("votacionesCerradas") === "true";
    if (!cerradas) {
      btnIniciar.style.display = "none"
      return;
    }

    btnIniciar.addEventListener("click", () => {
      localStorage.setItem("reabrir", "true")
      window.location.href = "sesion.html"
    });
  }
}

iniciarVotaciones()
cerrarVotaciones()