---

---

const rows = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}"<tr><td>{{forloop.index}}</td><td>{{-row['apk'] | replace: '.', ','-}}</td><td><a href='https://www.systembolaget.se/{{-row['productNumber']-}}/' target='_blank' rel='noreferrer'><b>{{-row['productNameBold'] | replace: '"', '\"'-}}</b>{{-' ' | append: row['productNameThin'] | replace: '"', '\"'-}}</a></td><td>{{-row['tags'] | join: ', '-}}</td><td>{{-row['alcoholPercentage'] | replace: '.', ',' | append: ' %'-}}</td><td>{{-row['volume'] | append: ' ml'-}}</td><td>{{-row['price'] | replace: '.', ',' | append: ' kr'-}}</td></tr>"{% endfor %}]


const tags = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}"{{row['tags'] | join: ',' | downcase}}"{% endfor %}]
const names = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}"{{row['productNameBold'] | append: ' ' | append: row['productNameThin'] | downcase | replace: '"', '\"'}}"{% endfor %}]
const volume = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}{{row['volume']}}{% endfor %}]
const price = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}{{row['price']}}{% endfor %}]
const alko = [{% for row in site.data.apk %}{% if forloop.first != true %},{% endif %}{{row['alcoholPercentage']}}{% endfor %}]

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

const typeSearch = document.getElementById('type-search')
const nameSearch = document.getElementById('name-search')

const minVolume = document.getElementById("min-volume")
const maxVolume = document.getElementById("max-volume")
minVolume.value = 0
maxVolume.value = 30000

const minPrice = document.getElementById("min-price")
const maxPrice = document.getElementById("max-price")
minPrice.value = 0
maxPrice.value = {{max_price}}

const minalko = document.getElementById("min-alko")
const maxalko = document.getElementById("max-alko")
minalko.value = 0
maxalko.value = 100

const filterRows = (rows) => {
  const results = []
  for (let i = 0, ii = rows.length; i < ii; i++) {
    if (active[i]) {
      results.push(rows[i])
    }
  }
  return results
}

let hideOrdervaraBool = false
let timeout = null
const hideOrdervara = (elem) => {
  if (elem.value == "Dölj Ordervara") {
    hideOrdervaraBool = true
    elem.value = "Visa Ordervara"
  } else {
    hideOrdervaraBool = false
    elem.value = "Dölj Ordervara"
  }

  clearTimeout(timeout)
  timeout = setTimeout(() => {
    onSearch()
  }, 250)
}

let hideOutOfStockBool = false
const hideOutOfStock = (elem) => {
  if (elem.value === "Dölj Slut i lager") {
    hideOutOfStockBool = true
    elem.value = "Visa Slut i lager"
  } else {
    hideOutOfStockBool = false
    elem.value = "Dölj Slut i lager"
  }

  clearTimeout(timeout)
  timeout = setTimeout(() => {
    onSearch()
  }, 250)
}

let clusterize;
if (Clusterize) {
  clusterize = new Clusterize({
    rows: rows,
    scrollId: 'scrollArea',
    contentId: 'contentArea'
  })
} else {
  document.getElementById("clusterize-script").addEventListener("load", () => {
    console.log("Clusterize loaded")
    clusterize = new Clusterize({
      rows: rows,
      scrollId: 'scrollArea',
      contentId: 'contentArea',
      no_data_text: 'Inga resultat'
    })
  })
}

const onSearch = () => {
  for(let i = 0, ii = rows.length; i < ii; i++) {
    let suitable = false
    if (tags[i].includes(typeSearch.value.toLowerCase()) && names[i].includes(nameSearch.value.toLowerCase()) && volume[i] >= minVolume.value && volume[i] <= maxVolume.value && price[i] >= minPrice.value && price[i] <= maxPrice.value && alko[i] >= minalko.value && alko[i] <= maxalko.value && (hideOrdervaraBool === false || tags[i].includes("ordervara") === false) && (hideOutOfStockBool === false || tags[i].includes("slut i lager") === false)) {
      suitable = true
    }
    active[i] = suitable
  }
  clusterize.update(filterRows(rows))
}

typeSearch.addEventListener('search', () => {
  typeSearch.blur()
  clearTimeout(timeout)
  onSearch()
})

typeSearch.addEventListener('input', () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    onSearch()
  }, 250)
})

nameSearch.addEventListener('search', () => {
  nameSearch.blur()
  clearTimeout(timeout)
  onSearch()
})

nameSearch.addEventListener('input', () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    onSearch()
  }, 250)
})

const showFilter = (elem) => {
  const elements = document.querySelectorAll(".slider-min-max, .slider")
  if (elements[0].style.display) {
    for (let i = 0, ii = elements.length; i < ii; i++) {
      elements[i].style.display = ""
    }
    elem.value = "▲ Dölj filter"
  } else {
    for (let i = 0, ii = elements.length; i < ii; i++) {
      elements[i].style.display = "none"
    }
    elem.value = "▼ Fler filter"
  }
}

// showFilter(document.getElementById("show-filter"))

const volSlider = document.getElementById('volume-slider')
noUiSlider.create(volSlider, {
  start: [0, 	30000],
  connect: true,
  range: {
    min: 0,
    '50%': 1500,
    '66.67%': 3000,
    '83.333%': 6000,
    max: 30000
  },
  behaviour: 'tap',
  step: 1,
  pips: {
    mode: 'count',
    density: 10,
    values: 7,
  },
})

volSlider.noUiSlider.on('slide.one', () => {
  const value = volSlider.noUiSlider.get()
  minVolume.value = Math.round(value[0])
  maxVolume.value = Math.round(value[1])
})

volSlider.noUiSlider.on('change.one', () => {
  const value = volSlider.noUiSlider.get()
  minVolume.value = Math.round(value[0])
  maxVolume.value = Math.round(value[1])
  onSearch()
})

minVolume.addEventListener('keyup', () => {
  volSlider.noUiSlider.set([minVolume.value, maxVolume.value])
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    onSearch()
  }, 350)
})

maxVolume.addEventListener('keyup', () => {
  volSlider.noUiSlider.set([minVolume.value, maxVolume.value])
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    onSearch()
  }, 350)
})

const priSlider = document.getElementById('price-slider')
noUiSlider.create(priSlider, {
  start: [0, 	{{max_price}}],
  connect: true,
  range: {
    min: 0,
    '50%': 150,
    '66.67%': 300,
    '83.33333%': 1000,
    max: {{max_price}}
  },
  behaviour: 'tap',
  step: 1,
  pips: {
    mode: 'count',
    density: 10,
    values: 7,
  },
})


priSlider.noUiSlider.on('slide.one', () => {
  const value = priSlider.noUiSlider.get()
  minPrice.value = Math.round(value[0])
  maxPrice.value = Math.round(value[1])
})

priSlider.noUiSlider.on('change.one', () => {
  const value = priSlider.noUiSlider.get()
  minPrice.value = Math.round(value[0])
  maxPrice.value = Math.round(value[1])
  onSearch()
})

minPrice.addEventListener('keyup', () => {
  priSlider.noUiSlider.set([minPrice.value, maxPrice.value])
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    onSearch()
  }, 350)
})

maxPrice.addEventListener('keyup', () => {
  priSlider.noUiSlider.set([minPrice.value, maxPrice.value])
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    onSearch()
  }, 350)
})


const alkoSlider = document.getElementById('alko-slider')
noUiSlider.create(alkoSlider, {
  start: [0, 	100],
  connect: true,
  range: {
    min: 0,
    '50%': 50,
    max: 100
  },
  behaviour: 'tap',
  step: 1,
  pips: {
    mode: 'count',
    density: 10,
    values: 7,
  },
})


alkoSlider.noUiSlider.on('slide.one', () => {
  const value = alkoSlider.noUiSlider.get()
  minalko.value = Math.round(value[0])
  maxalko.value = Math.round(value[1])
})

alkoSlider.noUiSlider.on('change.one', () => {
  const value = alkoSlider.noUiSlider.get()
  minalko.value = Math.round(value[0])
  maxalko.value = Math.round(value[1])
  onSearch()
})

minalko.addEventListener('keyup', () => {
  alkoSlider.noUiSlider.set([minalko.value, maxalko.value])
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    onSearch()
  }, 350)
})

maxalko.addEventListener('keyup', () => {
  alkoSlider.noUiSlider.set([minalko.value, maxalko.value])
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    onSearch()
  }, 350)
})


const clearSearchBox = () => {
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