const https = require('https')
const fs = require("fs")

let url = "https://susbolaget.emrik.org/v1/products"

https.get(url,(res) => {
  let body = ""
  res.on("data", (chunk) => {
    body += chunk
  })

  res.on("end", () => {
    try {
      let json = JSON.parse(body)
      console.log("Found " + json.length + " products")
      for(let i = 0; i < json.length; i++) {
        if (json[i]["alcoholPercentage"] == null) {
          json[i]["alcoholPercentage"] = 0
        }

        let apk = json[i]["alcoholPercentage"]*json[i]["volume"]/json[i]["price"]/100

        if (apk == null) {
          apk = 0
        }

        json[i]["tags"] = [json[i]["categoryLevel1"],json[i]["categoryLevel2"],json[i]["categoryLevel3"],json[i]["categoryLevel4"]].filter(n => n)

        if (json[i]["assortmentText"] == "Ordervaror"){
          json[i]["tags"].push("Ordervara")
        }

        if (json[i]["isCompletelyOutOfStock"] || (json[i]["isTemporaryOutOfStock"])) {
          json[i]["tags"].push("Slut i lager")
        }

        json[i]["apk"] = Math.round((apk + Number.EPSILON) * 1000) / 1000
      }

      json.sort(function(a,b){
        return b.apk - a.apk
      })

      fs.writeFile("_data/apk.json", JSON.stringify(json, null, 2), (err) => {
        if (err) {
          console.error(err.message)
        } else {
          console.log("Build: Successfully wrote apk.json")
        }
      })
    } catch (error) {
      console.error(error.message)
    }
  })

}).on("error", (error) => {
  console.error(error.message)
})

