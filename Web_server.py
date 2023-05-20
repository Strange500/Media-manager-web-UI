from flask import Flask, jsonify, redirect, request, render_template
from requests import request as rq

app = Flask(__name__)
API_URL = "http://127.0.0.1:5000"
@app.route("/")
def home():
    return redirect("/login")

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Get the form data
        username = request.form.get('username')
        password = request.form.get('password')

        # Perform login validation (e.g., check username and password against a database)

        # Redirect to a different page on successful login or show an error message
        if username == 'admin' and password == 'password':
            return redirect('/dashboard')
        else:
            error_message = 'Invalid username or password'
            return render_template('login.html', error_message=error_message)
    else:
        return render_template('login.html')

@app.route("/dashboard", methods=["GET", "POST"])
def dashboard():
    if request.method == 'GET':
        return render_template("dashboard.html")
    elif request.method == 'POST':
        if request.form.get('id'):
            data={'id' : request.form.get('id'), "choice":request.form.get("choice")}
            response = rq(url=API_URL+"/request/show", data=data, method="POST")
            print(response.status_code)
            if response.status_code != 200:
                error_message = "An error occured"
                return render_template("dashboard.html", error_message="An error occured")
            else:
                error_message = ""
                return render_template("dashboard.html")
        elif request.form.get("file") :
            if type(request.form.get("file")) == str:
                data = {'url': request.form.get("file")}
                response = rq(url=API_URL + "/torrent/add/url", data=data, method="POST")
            else :
                data = {'file': request.form.get("file")}
                response = rq(url=API_URL + "/torrent/add/file", data=data, method="POST")
            if response.status_code != 200:
                error_message = "An error occured"
                return render_template("dashboard.html", error_message="An error occured")
            else:
                error_message = ""
                return render_template("dashboard.html")

@app.route("/upload")
def upload():
    return render_template("upload.html")



if __name__ == "__main__":
    app.run(port=8080)
