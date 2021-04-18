fetch('https://gitcdn.xyz/repo/C4illin/systembolaget-data/main/apksort.json')
  .then(response => response.json())
  .then(data => {
    // console.log(data)
    let table = document.getElementById("apk-table")
    let tableHeader = document.createElement("tr")
    
    tableHeader.appendChild(document.createElement("th")).textContent = "APK"
    tableHeader.appendChild(document.createElement("th")).textContent = "Namn"
    tableHeader.appendChild(document.createElement("th")).textContent = "Typ"
    tableHeader.appendChild(document.createElement("th")).textContent = "Alkohol"
    tableHeader.appendChild(document.createElement("th")).textContent = "Volym"
    tableHeader.appendChild(document.createElement("th")).textContent = "Pris"
    tableHeader.appendChild(document.createElement("th")).textContent = "Rank"

    table.appendChild(tableHeader)
    for (let num in data) {
      let tablerow = document.createElement("tr")

      tablerow.appendChild(document.createElement("td")).textContent = data[num]["apk"]
      if (data[num]["subtitle"]) {
        tablerow.appendChild(document.createElement("td")).innerHTML = "<a href='https://www.systembolaget.se/produkt/" + data[num]["url"] + "/'><b>" + data[num]["name"] + "</b> " + data[num]["subtitle"] + "</a>"
      } else {
        tablerow.appendChild(document.createElement("td")).innerHTML = "<a href='https://www.systembolaget.se/produkt/" + data[num]["url"] + "/'><b>" + data[num]["name"] + "</b></a>"
      }
      tablerow.appendChild(document.createElement("td")).textContent = data[num]["tags"].join(", ")
      tablerow.appendChild(document.createElement("td")).textContent = data[num]["alcohol"]
      tablerow.appendChild(document.createElement("td")).textContent = data[num]["volume"]
      tablerow.appendChild(document.createElement("td")).textContent = String(data[num]["price"]).replace(".", ",") + " kr"
      tablerow.appendChild(document.createElement("td")).textContent = Number(num) + 1
      

      table.appendChild(tablerow)
    }
  })
