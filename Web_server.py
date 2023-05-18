from flask import Flask, jsonify, redirect, request, render_template


app = Flask(__name__)

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

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


if __name__ == "__main__":
    app.run(port=8080)
