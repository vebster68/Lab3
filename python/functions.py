import redis


def create(student, subjects, rates):
    r = redis.Redis('localhost')

    r.rpush(student, subjects)
    r.rpush(student, rates)
    

def update(student, prev_subject, prev_mark, new_student, new_subject, new_mark):
    r = redis.Redis('localhost')

    if student != new_student:
        r.rename(student, new_student)

    elements = r.lrange(student, 0, -1)
    i = 0
    while i < len(elements):
        if elements[i] == prev_subject:
            elements[i] = new_subject
            if elements[i+1] == prev_mark:
                elements[i+1] = new_mark
        i += 2

    r.delete(student)
    for el in elements:
        r.rpush(student, el)


def delete(student, subject, mark):
    r = redis.Redis('localhost')

    elements = r.lrange(student, 0, -1)

    i = 0
    while i < len(elements):
        if elements[i] == subject and elements[i+1] == mark:
            del elements[i], elements[i]
        i += 2

    r.delete(student)

    for el in elements:
        r.rpush(student, el)


def read():
    r = redis.Redis('localhost')

    d = [r.keys()]

    tmp = []
    for student in r.keys():
        elements = []
        for el in r.lrange(student, 0, -1):
            elements.append(el)
        tmp.append(elements)
    d.append(tmp)

    return d
