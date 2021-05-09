---

---

var rows = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}"<tr><td>{{forloop.index}}</td><td>{{row['apk'] | replace: '.', ','}}</td><td><a href='https://www.systembolaget.se/produkt/{{row['url']}}/' target='_blank'><b>{{row['name'] | replace: '"', '\"'}}</b>{{' ' | append: row['subtitle'] | replace: '"', '\"'}}</a></td><td>{{row['tags'] | join: ', '}}</td><td>{{row['alcohol'] | replace: ' ', ' '}}</td><td>{{row['volume'] | replace: ' ', ' '}}</td><td>{{row['price'] | replace: '.', ',' | append: ' kr'}}</td></tr>"{% endfor %}]

var tags = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}"{{row['tags'] | join: ','}}"{% endfor %}]

var names = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}"{{row['name'] | append: ' ' | append: row['subtitle'] | downcase | replace: '"', '\"'}}"{% endfor %}]

var active = []
for (var i = 0, ii = rows.length; i < ii; i++) {
  active.push(true)
}

var typeSearch = document.getElementById('type-search')
var nameSearch = document.getElementById('name-search')

var filterRows = function(rows) {
  var results = []
  for (var i = 0, ii = rows.length; i < ii; i++) {
    if (active[i]) {
      results.push(rows[i])
    }
  }
  return results
}

var clusterize = new Clusterize({
  rows: filterRows(rows),
  scrollId: 'scrollArea',
  contentId: 'contentArea'
})

var onSearch = function() {
  console.log(typeSearch.value)
  console.log(nameSearch.value)
  for(var i = 0, ii = rows.length; i < ii; i++) {
    var suitable = false
    if(tags[i].includes(typeSearch.value) && names[i].includes(nameSearch.value)) {
      suitable = true
    }
    active[i] = suitable
  }
  clusterize.update(filterRows(rows))
}

let timeout = null
typeSearch.addEventListener('keyup', function() {
  clearTimeout(timeout)
  timeout = setTimeout(function () {
    onSearch()
  }, 500)
})

nameSearch.addEventListener('keyup', function() {
  clearTimeout(timeout)
  timeout = setTimeout(function () {
    onSearch()
  }, 500)
})

let clearSearchBox = () => {
  typeSearch.value = ""
  nameSearch.value = ""
  clusterize.update(rows)
}