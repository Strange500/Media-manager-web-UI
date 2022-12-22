//  Gloabl var
//const base_url = "http://82.65.222.143:8080/";
//const base_url = "http://127.0.0.1:8080/"
const base_url = "http://82.65.222.143:8080/"
const path = document.location.pathname.toString().split("/").at(-1)

// var for index.html
const button_container = document.getElementById("menu_button");
const button_container_close = document.getElementById("menu_button_close");
const menu_container = document.getElementById("menue_right_up")
const space_div = document.getElementById("space_frame")
const restart_bt = document.getElementById("restart_bt")
const current_temp = document.getElementById("current")
const log = document.getElementById("log")
const alive_var = document.getElementById("alive")
const nb_show = document.getElementById("nb_show")
const uncomplete = document.getElementById("uncomplete")

// var for searh.html
const search = document.getElementById("search")
const search_result = document.getElementById("result")
let search_temp = ""
let is_show = true
let was_show = true
const api = "91d34b37526d54cfd3d6fcc5c50d0b31"
let req = "https://api.themoviedb.org/3/search/tv?api_key="+api+"&query={search}"
let req_image = "https://image.tmdb.org/t/p/w500"
const show_check = document.getElementById("is_show")
const movie_check = document.getElementById("is_movie")
const bt_dl = document.getElementById("dl")
const r = document.getElementById("r")

function dic_show_or_movie(statut) {
    if (statut) {
        return {"title" : "name", "poster_path" : "poster_path", "date" : "first_air_date" }
    }
     else {
         return {"title" : "title", "poster_path" : "poster_path", "date" : "release_date" }
    }
}
function make_presentation(dic,div_append,is_show) {
    let dic_used = dic_show_or_movie(is_show)

    let title = dic[dic_used["title"]]

    let poster_path = req_image + dic["poster_path"]
    console.log(dic[dic_used["date"]])
    let year = dic[dic_used["date"]].split("-")[0]


    let a = document.createElement("a")
    a.id = dic["id"] + ":" + title.replaceAll(" ", "%20")
    a.classList.add("size")



    // create show div
    let div_show = document.createElement("div")
    div_show.classList = "div_show"


    // create all inside div show
    let poster = document.createElement("img")
    poster.src = poster_path
    poster.classList.add("poster")
    let titre = document.createElement("h5")
    titre.textContent = title
    titre.classList.add("show_title")
    let date = document.createElement("h5")
    date.classList.add("re_date")
    date.textContent = year

    div_show.appendChild(poster)
    div_show.appendChild(titre)
    div_show.appendChild(date)
    a.appendChild(div_show)
    div_append.appendChild(a)
    let slect = document.getElementById(dic["id"] + ":" + title.replaceAll(" ", "%20"))
    slect.addEventListener("click", function () {
        slect.classList.toggle("selected")
        div_show.classList.toggle("selected_show")
    })


}
function search_list(search) {
    let x = fetch(req.replace("{search}",search.replace("  "," ").replace(" ", "+")))
        .then(data => data.json())
        .then(data => {
            return data["results"]
        })
    return x


}
console.log(search_list("death note"))
function add_text(div_id, content, style = "") {
    let new_bt = document.createElement('h5')
    new_bt.textContent = content
    new_bt.classList = ["bt"]
    new_bt.style = style
    document.getElementById(div_id).appendChild(new_bt)
}

function alive() {
    fetch(base_url + "alive")
        .then(response => response.json())
        .then(data => {
            data = data["alive"]
            if (data === true) {
                //add_text("alive", "ON", "color: green;")
                if (alive_var.textContent === "OFF"){
                    space()
                }
                alive_var.textContent = "ON"
                alive_var.style = "color:green;"


            }


        })
        .catch(code => {
            if (code !== 200) {
                //add_text("alive", "OFF", "color: red;")
                alive_var.textContent = "OFF"
                alive_var.style = "color:red;"

            }
        })

}

function space() {
    fetch(base_url + "space")
        .then(response => response.text())
        .then(data_0 => JSON.parse(data_0))
        .then(data => {
            space_div.innerHTML = ""
            for ( let disk in data) {

                let new_div = document.createElement("div")
                new_div.id = disk
                new_div.classList.add("disk")
                space_div.appendChild(new_div)
                add_text(disk, disk, style = "")


                let disk_div = document.getElementById(disk);
                let spec_disk = document.createElement("div")
                let div_bar = document.createElement("div")
                let percent_used = Math.floor((data[disk]["used"] / data[disk]["total"]) * 100)
                div_bar.classList.add("progress_bar")
                div_bar.id = "bar" + disk
                disk_div.classList.add("progress_bar_div")
                spec_disk.classList.add('progess_bar_green')
                spec_disk.style = "width: " + percent_used.toString() + "%;"

                let space_free = document.createElement("h5")
                space_free.textContent = Math.floor(data[disk]["free"] / (10 ** 9)).toString() + "gB free"
                disk_div.appendChild(space_free)
                disk_div.appendChild(div_bar)
                let div_bar_select = document.getElementById("bar" + disk)
                div_bar_select.appendChild(spec_disk)
            }


        })
        .catch(code => {
            if (code !== 200) {
                add_text("space", "OFF", "color: red;")


            }
        })
}

function switch_menue() {
    menu_container.classList.toggle("on");
    menu_container.classList.toggle("off");

}

function restart() {
    fetch(base_url + "restart")
        .then(response => JSON.parse(response.json()))
        .then(data => {
            if (data["status"] === "ok") {
                add_text("restart_div", "Restarting", "")

            }

        })
        .catch(code => {
            if (code !== 200) {
                add_text("restart_div", "can't communicate with server", "color: red;")

            }
        })
}

function cpu_temp() {
    fetch(base_url + "cpu_temp")
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (75 <= data["value"]) {
                current_temp.textContent = data["value"]
                current_temp.style = "color:red;"
            } else {
                if (data["value"] <= 45) {
                    current_temp.textContent = data["value"]
                    current_temp.style = "color:green;"
                } else {

                    current_temp.textContent = data["value"]
                    current_temp.style = "color:orange;"
                }
            }
        })
        .catch(code => {
            if (code !== 200) {
                current_temp.textContent = "can't communicate with server"
                current_temp.style = "color:red;"

            }
        })
}

function serv_log() {
    fetch(base_url + "log")
        .then(response => {
            return response.json()
        })
        .then(data => {
            log.textContent = data["value"]
            log.classList.remove("warning")
        })
        .catch(code => {
            if (code !== 200) {
                log.textContent = "can't communicate with server"
                log.classList.add("warning")

            }
        })

}

function stat_lib() {
    fetch(base_url+"stats_lib")
        .then(response => response.json())
        .then(data => {
            nb_show.textContent = data["nb_show"]

            let temp  = document.createElement("div")
            console.log(data["uncomplete"])
            temp.classList.add('progess_bar_green')
            temp.style.width = (100-data["uncomplete"]).toString() + "%"
            uncomplete.appendChild(temp)



        })
}


function search_check() {
    if (search.value !== search_temp || (is_show !== was_show ) )  {
        was_show = is_show
        r.textContent = ""
        search_result.innerHTML = ""
        //// tmdb api search and print
        console.log(search.value)
        search_temp = search.value

        let request = req.replace("{search}",search_temp.replace("  "," ").replace(" ", "+"))
        fetch(request)
            .then(data => data.json())
            .then(data => {
                data = data["results"]
                for (show in data) {
                    console.log(data[show])
                    let x = make_presentation(data[show],search_result,is_show)

                }



            })


    }
}

function dl() {
    let anime_ids = document.getElementsByClassName("selected")
    let ls = []
    let requests = base_url+"dl/?is_show="+is_show.toString()+"&q="
    for (let elt in anime_ids) {
        if (anime_ids[elt].id !== undefined) {
            requests = requests+anime_ids[elt].id.toString()+" "
        }
    }

    requests = requests.trim().replaceAll(" ", "+")

    console.log(requests)
    fetch(requests)
        .then(data => data.json())
        .then(data => {
            if (data["statut"] === "sucess") {
                r.textContent = "All selected video has been added for download"
            }
            else {
                r.textContent = "An error as occured, no file found for one or several videos"
            }
        })

}

if ("search.html" === path) {
    show_check.checked = true

    setInterval(search_check, 1000)
    show_check.addEventListener("change", function () {
        movie_check.checked = false
        req = "https://api.themoviedb.org/3/search/tv?api_key="+api+"&query={search}"
        was_show = is_show
        is_show = true
    })
    movie_check.addEventListener("change", function () {
        show_check.checked = false
        req = "https://api.themoviedb.org/3/search/movie?api_key="+api+"&query={search}"
        was_show = is_show
        is_show = false
    })

    bt_dl.addEventListener("click", dl)

}


alive();
cpu_temp();
serv_log();
space();
stat_lib()
setInterval(alive, 5000)
setInterval(cpu_temp, 5000)
setInterval(serv_log, 10000)






button_container.addEventListener("click", function () {
    switch_menue()
});
button_container_close.addEventListener("click", function () {
    switch_menue()
});

restart_bt.addEventListener("click", function () {
    restart()
});


