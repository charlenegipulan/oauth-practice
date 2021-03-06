var allStudents;
var filteredStudents = [];
var searchName = '';
var template;

$(function() {
  // load all students one time at load
  //get request with jQuery
  $.get('/api/students', function(data) {
    allStudents = data;
    template = _.template($('#studentTemplate').html()); //select students with studentTemplate id
    render();
  });
});

function render() {
  applyFilterAndSort();
  $('#students').html(template({students: filteredStudents})); //call template function provide data(students)
}

function applyFilterAndSort() {
  if (searchName) {
    filteredStudents = allStudents.filter(function(student) {
      return student.name.toLowerCase().indexOf(searchName.toLowerCase()) >= 0;
    });
  } else {
    filteredStudents = allStudents;
  }
  var sortKey = $('#sortCohort').is(":checked") ? 'cohort' : 'name';
  filteredStudents = _.sortBy(filteredStudents, sortKey);
}

function doSearch() {
  var curSearch = $('#search').val();
  if (curSearch != searchName) searchName = curSearch;
  render();
}

function addFact() {
  if ( !$('#fact').val() ) return; //input cant be empty
  fetch('/api/facts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( { fact: $('#fact').val() } ),
    credentials: 'include' //send the cookies
  })
  .then(res => res.json())
  .then(data => {
    //clear the <input>
    $('#fact').val('');
    // find the updated student's index
    var idx = allStudents.findIndex(s => s._id === data._id);
    allStudents[idx] = data;
    render();
  });
}

function deleteFact(factId) {
  fetch(`/api/facts/${factId}`, {
    method: 'DELETE',
    credentials: 'include' //send cookie
  })
  .then(res => res.json())
  .then(data => {
    var student = allStudents.find(s => s.facts.some(f => f._id == factId));
    student.facts.splice(student.facts.findIndex(f => f._id == factId), 1);
    render();
  });
}

/* ----- event handlers ----- */

$('#search').on('keypress blur', function(evt) {
  if (evt.keyCode === 13 || evt.type === 'blur') doSearch();
});

$('[type="radio"]').on('change', function() { render(); });
