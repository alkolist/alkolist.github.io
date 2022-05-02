const https = require("https")
const fs = require("fs")
const core = require("@actions/core") // required to be able to fail correctly

// host it yourself instead of using this
let url = "https://susbolaget.emrik.org/v1/products"

// uses https instaed of fetch to bring down the amount of dependencies
https.get(url,(res) => {
  let body = ""
  res.on("data", (chunk) => {
    body += chunk
  })

  res.on("end", () => {
    try {
      try {
        var json = JSON.parse(body)
      } catch (error) {
        // exit and don't change the website if error is detected
        core.setFailed(error.message)
      }
      
      console.log("Found " + json.length + " products")
      if (json.length < 100) {
        core.setFailed("No products found, backend is probably down")
      }

      for(let i = 0; i < json.length; i++) {
        if (json[i]["alcoholPercentage"] == null) {
          json[i]["alcoholPercentage"] = 0
        }

        let apk = json[i]["alcoholPercentage"]*json[i]["volume"]/json[i]["price"]/100

        // happens when divided by zero and such
        if (apk == null) {
          apk = 0
        }

        // compress all tags to one
        json[i]["tags"] = [json[i]["categoryLevel1"],json[i]["categoryLevel2"],json[i]["categoryLevel3"],json[i]["categoryLevel4"]].filter(n => n)

        if (json[i]["assortmentText"] == "Ordervaror"){
          json[i]["tags"].push("Ordervara")
        }

        if (json[i]["isCompletelyOutOfStock"] || (json[i]["isTemporaryOutOfStock"])) {
          json[i]["tags"].push("Slut i lager")
        }

        // round to three decimal places
        json[i]["apk"] = Math.round((apk + Number.EPSILON) * 1000) / 1000
      }

      json.sort(function(a,b){
        return b.apk - a.apk
      })

      fs.writeFile("_data/apk.json", JSON.stringify(json, null, 2), (err) => {
        if (err) {
          console.error(err.message)
          core.setFailed(err.message)
        } else {
          console.log("Build: Successfully wrote apk.json")
        }
      })
    } catch (error) {
      console.error(error.message)
      core.setFailed(error.message)
    }
  })

}).on("error", (error) => {
  console.error(error.message)
  core.setFailed(error.message)
})

