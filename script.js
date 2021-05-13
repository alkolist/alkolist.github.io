---

---

var rows = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}"<tr><td>{{forloop.index}}</td><td>{{row['apk'] | replace: '.', ','}}</td><td><a href='https://www.systembolaget.se/produkt/{{row['url']}}/' target='_blank'><b>{{row['name'] | replace: '"', '\"'}}</b>{{' ' | append: row['subtitle'] | replace: '"', '\"'}}</a></td><td>{{row['tags'] | join: ', '}}</td><td>{{row['alcohol'] | replace: ' ', ' '}}</td><td>{{row['volume'] | replace: ' ', ' '}}</td><td>{{row['price'] | replace: '.', ',' | append: ' kr'}}</td></tr>"{% endfor %}]

var tags = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}"{{row['tags'] | join: ','}}"{% endfor %}]
var names = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}"{{row['name'] | append: ' ' | append: row['subtitle'] | downcase | replace: '"', '\"'}}"{% endfor %}]
var volume = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}{{row['volume'] | remove: " ml"}}{% endfor %}]
var price = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}{{row['price']}}{% endfor %}]

{% assign max_price = 0 %}
{% for row in site.data.apk %}
  {% if row.price > max_price %}
    {% assign max_price = row.price %}
  {% endif %}
{% endfor %}

var active = []
for (var i = 0, ii = rows.length; i < ii; i++) {
  active.push(true)
}

var typeSearch = document.getElementById('type-search')
var nameSearch = document.getElementById('name-search')

let minVolume = document.getElementById("min-volume")
let maxVolume = document.getElementById("max-volume")
minVolume.value = 0
maxVolume.value = 30000

let minPrice = document.getElementById("min-price")
let maxPrice = document.getElementById("max-price")
minPrice.value = 0
maxPrice.value = {{max_price}}

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
  rows: rows,
  scrollId: 'scrollArea',
  contentId: 'contentArea'
})

var onSearch = function() {
  for(var i = 0, ii = rows.length; i < ii; i++) {
    var suitable = false
    if(tags[i].includes(typeSearch.value.toLowerCase()) && names[i].includes(nameSearch.value.toLowerCase()) && volume[i] >= minVolume.value && volume[i] <= maxVolume.value && price[i] >= minPrice.value && price[i] <= maxPrice.value) {
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
  minVolume.value = 0
  maxVolume.value = 30000
  minPrice.value = 0
  maxPrice.value = {{max_price}}
  volSlider.noUiSlider.set([minVolume.value, maxVolume.value])
  priSlider.noUiSlider.set([minPrice.value, maxPrice.value])
  clusterize.update(rows)
}

var volSlider = document.getElementById('volume-slider')
noUiSlider.create(volSlider, {
  start: [0, 	30000],
  connect: true,
  range: {
    'min': 0,
    '50%': 1500,
    '66.67%': 3000,
    '83.333%': 6000,
    'max': 30000
  },
  behaviour: 'tap',
  step: 1,
  pips: {
    mode: 'count',
    density: 10,
    values: 7,
  },
})

volSlider.noUiSlider.on('slide.one', function () {
  let value = volSlider.noUiSlider.get()
  minVolume.value = Math.round(value[0])
  maxVolume.value = Math.round(value[1])
})

volSlider.noUiSlider.on('change.one', function () {
  let value = volSlider.noUiSlider.get()
  minVolume.value = Math.round(value[0])
  maxVolume.value = Math.round(value[1])
  onSearch()
})

minVolume.addEventListener('keyup', function() {
  volSlider.noUiSlider.set([minVolume.value, maxVolume.value])
  clearTimeout(timeout)
  timeout = setTimeout(function () {
    onSearch()
  }, 500)
})

maxVolume.addEventListener('keyup', function() {
  volSlider.noUiSlider.set([minVolume.value, maxVolume.value])
  clearTimeout(timeout)
  timeout = setTimeout(function () {
    onSearch()
  }, 500)
})

var priSlider = document.getElementById('price-slider')
noUiSlider.create(priSlider, {
  start: [0, 	{{max_price}}],
  connect: true,
  range: {
    'min': 0,
    '50%': 150,
    '66.67%': 300,
    '83.33333%': 1000,
    'max': {{max_price}}
  },
  behaviour: 'tap',
  step: 1,
  pips: {
    mode: 'count',
    density: 10,
    values: 7,
  },
})


priSlider.noUiSlider.on('slide.one', function () {
  let value = priSlider.noUiSlider.get()
  minPrice.value = Math.round(value[0])
  maxPrice.value = Math.round(value[1])
})

priSlider.noUiSlider.on('change.one', function () {
  let value = priSlider.noUiSlider.get()
  minPrice.value = Math.round(value[0])
  maxPrice.value = Math.round(value[1])
  onSearch()
})

minPrice.addEventListener('keyup', function() {
  priSlider.noUiSlider.set([minPrice.value, maxPrice.value])
  clearTimeout(timeout)
  timeout = setTimeout(function () {
    onSearch()
  }, 500)
})

maxPrice.addEventListener('keyup', function() {
  priSlider.noUiSlider.set([minPrice.value, maxPrice.value])
  clearTimeout(timeout)
  timeout = setTimeout(function () {
    onSearch()
  }, 500)
})