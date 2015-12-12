var students = new Object();

// JSON & Ajax
document.querySelector('input').addEventListener('click', function (event) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', './data.php');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      document.querySelector('#students').innerHTML = xhr.responseText;
    }
  };
  // students = JSON.parse(xhr.responseText); // 동작하지 않음. SyntaxError: JSON Parse error: Unexpected EOF
  xhr.send();
});
