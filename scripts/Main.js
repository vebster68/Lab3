var students = new Array();
var subjects_marks = new Array();
var selected = -1;

function refresh_data()
{
    $.get("/ServerData", function(data)
    {
        students = data['info'][0];
        subjects_marks = data['info'][1];
    });
}

function button_create()
{
    var tmp = "";
    tmp = tmp + "<select>"
    var id = 0;
    students.forEach(function(entry)
    {
        tmp = tmp + "<option id=\"" + id + "\" onclick=\"hide_input_student()\">" + entry + "</option>";
        id = id + 1;
    });
    tmp = tmp + "<option id=\"" + id + "\" onclick=\"show_input_student()\" selected>Add new student</option></select>";
    tmp = tmp + "<p id=\"possible_new_student\"><input id=\"new_student\" size=26 type=\"text\"></input></p>";
    tmp = tmp + "<p><input id=\"new_subject\" size=15 type=\"text\"></input><input id=\"new_mark\" size=5 type=\"text\"></input></p>";
    tmp = tmp + "<button onclick=\"create_record()\">Create</button>";
    tmp = tmp + "<button onclick=\"cancel()\">Cancel</button>";
    $('#control').html(tmp);
    if(selected >= 0) $('#r'+selected).css('color', 'black');
    selected = -1;
}

function hide_input_student()
{
    $('#possible_new_student').html("");
    $('#new_subject').val("");
    $('#new_mark').val("");
}

function show_input_student()
{
    $('#possible_new_student').html("<input id=\"new_student\" size=26 type=\"text\"></input>");
    $('#new_subject').val("");
    $('#new_mark').val("");
}

function create_record()
{
    var student_id = $("option:selected").attr('id');
    var student = students[student_id];
    if (student_id >= students.length) student = $('#new_student').val();
    var subject = $('#new_subject').val();
    var mark = $('#new_mark').val();
    if(student === "" || subject === "" || mark === "")
        alert("Some input field(s) empty!");
    else if(!$.isNumeric(student) && !$.isNumeric(subject) && $.isNumeric(mark))
        $.post("/ServerData", {"action": "CREATE", "student": student, "subjects": subject, "rates": mark}, function()
        {
            refresh_data();
        });
    else alert("Check your input data!");
    $('#control').html("");
    $('#data').html("");
}

function cancel()
{
    $('#control').html("");
    selected = -1;
    $('#data').html("");
}

function button_read()
{
    var tmp = "";
    tmp = tmp + "<select>";
    var id = 0;
    students.forEach(function(entry)
    {
        tmp = tmp + "<option id=\"" + id + "\" selected>" + entry + "</option>";
        id = id + 1;
    });
    tmp = tmp + "</select></br><button onclick=\"read_student()\">Read</button>";
    tmp = tmp + "<button onclick=\"cancel()\">Cancel</button>";
    $('#control').html(tmp);
    if(selected >= 0) $('#r'+selected).css('color', 'black');
    selected = -1;
}

function read_student()
{
    var student_id = $("option:selected").attr('id');
    var student = students[student_id];
    $.get("/ServerData", function(data)
    {
        subjects_marks = data['info'][1];
    });
    var tmp = "";
    tmp = tmp + "<p><span>Current student: " + students[student_id] + "</span></p><br/>";
    tmp = tmp + "<table id=\"" + student_id + "\">";
    for (var i = 0; i < subjects_marks[student_id].length; i += 2)
    {
        tmp = tmp + "<tr id=\"r" + (i / 2) + "\" onclick=\"row_select(" + (i / 2) + ")\"><td id=\"d" + i + "\">" + subjects_marks[student_id][i] + "</td><td id=\"d" + (i + 1) + "\">" + subjects_marks[student_id][i + 1] + "</td></tr>";
    }
    tmp = tmp + "</table>";
    $('#data').html(tmp);
}

function row_select(id)
{
    if(selected >= 0) $('#r'+selected).css('color', 'black');
    selected = id;
    $('#r'+selected).css('color', 'green');
}

function button_update()
{
    if (selected < 0)
    {
        alert("Choose row first!");
        return;
    }
    var tmp = "";
    tmp = tmp + "<p><input id=\"new_student\" size=26 type=\"text\"></p>";
    tmp = tmp + "<p><input id=\"new_subject\" size=15 type=\"text\"><input id=\"new_mark\" size=5 type=\"text\"></p>";
    tmp = tmp + "<button onclick=\"update_record()\">Update</button>";
    tmp = tmp + "<button onclick=\"cancel()\">Cancel</button>";
    $('#control').html(tmp);
    $('#new_student').val(students[$("table").attr('id')]);
    $('#new_subject').val(subjects_marks[$("table").attr('id')][selected * 2]);
    $('#new_mark').val(subjects_marks[$("table").attr('id')][selected * 2 + 1]);
}

function update_record()
{
    var student_id = $("table").attr('id');
    var student = students[student_id];
    var prev_subject = subjects_marks[student_id][selected * 2];
    var prev_mark = subjects_marks[student_id][selected * 2 + 1];
    var new_student = $('#new_student').val();
    var new_subject = $('#new_subject').val();
    var new_mark = $('#new_mark').val();
    if(new_student === "" || new_subject === "" || new_mark === "")
        alert("Some input field(s) empty!");
    else if (new_student === student && new_subject === prev_subject && new_mark === prev_mark)
    {
        alert("Data is same!");
        $('#control').html("");
        if(selected >= 0) $('#r'+selected).css('color', 'black');
        selected = -1;
    }
    else if(!$.isNumeric(new_student) && !$.isNumeric(new_subject) && $.isNumeric(new_mark))
    {
        $.post("/ServerData", {"action": "UPDATE", "student": student, "prev_subject": prev_subject, "prev_mark": prev_mark, "new_student": new_student,
        "new_subject": new_subject, "new_mark": new_mark}, function()
        {
            refresh_data();
        });
        $('#control').html("");
        selected = -1;
        $('#data').html("");
    }
    else alert("Check your input data!");
}

function button_delete()
{
    if(selected < 0)
    {
        alert("Choose row first!");
        return;
    }
    var tmp = "";
    tmp = tmp + "<p><span>Are you sure want to delete selected row?</span></p>";
    tmp = tmp + "<button onclick=\"delete_record()\">Delete</button>";
    tmp = tmp + "<button onclick=\"cancel()\">Cancel</button>";
    $('#control').html(tmp);
}

function delete_record()
{
    var student_id = $("table").attr('id');
    var student = students[student_id];
    var subject = subjects_marks[student_id][selected * 2];
    var mark = subjects_marks[student_id][selected * 2 + 1];
    $.post("/ServerData", {"action": "DELETE", "student": student, "subject": subject, "mark": mark}, function ()
    {
        refresh_data();
    });
    $('#data').html("");
    selected = -1;
    $('#control').html("");
}