
// JSON & Ajax
var students = {};
// (function () {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      document.write(xhr.responseText);
      students = JSON.parse(xhr.responseText);
    }
  };
  xhr.open('POST', './data.php');
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();

xhr.onload = function () {
  console.log(students);
};
