from bottle import get, template, static_file, post, run, request
from functions import read, create, update, delete

@get('/')
def server():
    return template('static/Main.html')


@get('/static/:filename#.*#')
def send_static(filename):
    return static_file(filename, root='./static/')


@get('/scripts/:filename#.*#')
def send_script(filename):
    return static_file(filename, root='./scripts/')


@get('/ServerData')
def server_get():
    return {'info': read()}


@post('/ServerData')
def server_post():
    action = request.forms.get('action')

    if action == "CREATE":
        student = request.forms.get('student')
        subjects = request.forms.get('subjects')
        rates = request.forms.get('rates')
        create(student, subjects, rates)

    elif action == "UPDATE":
        student= request.forms.get('student')
        prev_subject = request.forms.get('prev_subject')
        prev_mark = request.forms.get('prev_mark')
        new_student = request.forms.get('new_student')
        new_subject = request.forms.get('new_subject')
        new_mark = request.forms.get('new_mark')
        update(student, prev_subject, prev_mark, new_student, new_subject, new_mark)

    elif action == "DELETE":
        student = request.forms.get('student')
        subject = request.forms.get('subject')
        mark = request.forms.get('mark')
        delete(student, subject, mark)


if __name__ == '__main__':
    run(host='localhost', port=8080, debug=True)
