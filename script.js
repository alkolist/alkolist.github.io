---

---

const rows = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}"<tr><td>{{forloop.index}}</td><td>{{row['apk'] | replace: '.', ','}}</td><td><a href='https://www.systembolaget.se/produkt/{{row['url']}}/' target='_blank' rel='noreferrer'><b>{{row['name'] | replace: '"', '\"'}}</b>{{' ' | append: row['subtitle'] | replace: '"', '\"'}}</a></td><td>{{row['tags'] | join: ', '}}</td><td>{{row['alcohol'] | replace: ' ', ' '}}</td><td>{{row['volume'] | replace: ' ', ' '}}</td><td>{{row['price'] | replace: '.', ',' | append: ' kr'}}</td></tr>"{% endfor %}]

const tags = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}"{{row['tags'] | join: ','}}"{% endfor %}]
const names = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}"{{row['name'] | append: ' ' | append: row['subtitle'] | downcase | replace: '"', '\"'}}"{% endfor %}]
const volume = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}{{row['volume'] | remove: " ml"}}{% endfor %}]
const price = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}{{row['price']}}{% endfor %}]
const alko = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}{{row['alcohol'] | remove: " %" | replace: ",", "."}}{% endfor %}]

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

let typeSearch = document.getElementById('type-search')
let nameSearch = document.getElementById('name-search')

let minVolume = document.getElementById("min-volume")
let maxVolume = document.getElementById("max-volume")
minVolume.value = 0
maxVolume.value = 30000

let minPrice = document.getElementById("min-price")
let maxPrice = document.getElementById("max-price")
minPrice.value = 0
maxPrice.value = {{max_price}}

let minalko = document.getElementById("min-alko")
let maxalko = document.getElementById("max-alko")
minalko.value = 0
maxalko.value = 100

let filterRows = (rows) => {
  var results = []
  for (var i = 0, ii = rows.length; i < ii; i++) {
    if (active[i]) {
      results.push(rows[i])
    }
  }
  return results
}

let clusterize = new Clusterize({
  rows: rows,
  scrollId: 'scrollArea',
  contentId: 'contentArea'
})

let onSearch = () => {
  for(var i = 0, ii = rows.length; i < ii; i++) {
    var suitable = false
    if(tags[i].includes(typeSearch.value.toLowerCase()) && names[i].includes(nameSearch.value.toLowerCase()) && volume[i] >= minVolume.value && volume[i] <= maxVolume.value && price[i] >= minPrice.value && price[i] <= maxPrice.value && alko[i] >= minalko.value && alko[i] <= maxalko.value) {
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
  }, 350)
})

nameSearch.addEventListener('keyup', function() {
  clearTimeout(timeout)
  timeout = setTimeout(function () {
    onSearch()
  }, 350)
})

let clearSearchBox = () => {
  typeSearch.value = ""
  nameSearch.value = ""
  minVolume.value = 0
  maxVolume.value = 30000
  minPrice.value = 0
  maxPrice.value = {{max_price}}
  minalko.value = 0
  maxalko.value = 100
  volSlider.noUiSlider.set([minVolume.value, maxVolume.value])
  priSlider.noUiSlider.set([minPrice.value, maxPrice.value])
  alkoSlider.noUiSlider.set([minalko.value, maxalko.value])
  clusterize.update(rows)
}



let showFilter = (elem) => {
  let elements = document.querySelectorAll(".slider-min-max, .slider")
  if (elements[0].style.display) {
    for (var i = 0, ii = elements.length; i < ii; i++) {
      elements[i].style.display = ""
    }
    elem.value = "▲ Dölj filter"
  } else {
    for (var i = 0, ii = elements.length; i < ii; i++) {
      elements[i].style.display = "none"
    }
    elem.value = "▼ Fler filter"
  }
}

// showFilter(document.getElementById("show-filter"))

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


var alkoSlider = document.getElementById('alko-slider')
noUiSlider.create(alkoSlider, {
  start: [0, 	100],
  connect: true,
  range: {
    'min': 0,
    '50%': 50,
    'max': 100
  },
  behaviour: 'tap',
  step: 1,
  pips: {
    mode: 'count',
    density: 10,
    values: 7,
  },
})


alkoSlider.noUiSlider.on('slide.one', function () {
  let value = alkoSlider.noUiSlider.get()
  minalko.value = Math.round(value[0])
  maxalko.value = Math.round(value[1])
})

alkoSlider.noUiSlider.on('change.one', function () {
  let value = alkoSlider.noUiSlider.get()
  minalko.value = Math.round(value[0])
  maxalko.value = Math.round(value[1])
  onSearch()
})

minalko.addEventListener('keyup', function() {
  alkoSlider.noUiSlider.set([minalko.value, maxalko.value])
  clearTimeout(timeout)
  timeout = setTimeout(function () {
    onSearch()
  }, 500)
})

maxalko.addEventListener('keyup', function() {
  alkoSlider.noUiSlider.set([minalko.value, maxalko.value])
  clearTimeout(timeout)
  timeout = setTimeout(function () {
    onSearch()
  }, 500)
})
