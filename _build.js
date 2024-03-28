const https = require("node:https");
const fs = require("node:fs");
const core = require("@actions/core"); // required to be able to fail correctly

const url = "https://susbolaget.emrik.org/v1/products";

// uses https instaed of fetch to bring down the amount of dependencies
https
	.get(url, (res) => {
		let body = "";
		res.on("data", (chunk) => {
			body += chunk;
		});

		res.on("end", () => {
			try {
				let json;

				try {
					json = JSON.parse(body);
				} catch (error) {
					// exit and don't change the website if error is detected
					core.setFailed(error.message);
				}

				if (!json.length || json.length < 100) {
					core.setFailed("No products found, backend is probably down");
				}
				console.log(`Found ${json.length} products`);

				for (let i = 0; i < json.length; i++) {
					if (json[i].alcoholPercentage == null) {
						json[i].alcoholPercentage = 0;
					}

					let apk =
						(json[i].alcoholPercentage * json[i].volume) / json[i].price / 100;

					// happens when divided by zero and such
					if (apk == null) {
						apk = 0;
					}

					// compress all tags to one
					json[i].tags = [
						json[i].categoryLevel1,
						json[i].categoryLevel2,
						json[i].categoryLevel3,
						json[i].categoryLevel4,
					].filter((n) => n);

					if (json[i].assortmentText === "Ordervaror") {
						json[i].tags.push("Ordervara");
					}

					if (json[i].assortmentText === "Webblanseringar") {
						json[i].tags.push("Webblansering");
					}

					if (
						json[i].isCompletelyOutOfStock ||
						json[i].isTemporaryOutOfStock ||
						json[i].isDiscontinued
					) {
						json[i].tags.push("Slut i lager");
					}

					if (json[i].isNews) {
						json[i].tags.push("Nyhet");
					}

					// round to three decimal places
					json[i].apk = Math.round((apk + Number.EPSILON) * 1000) / 1000;
				}

				json.sort((a, b) => b.apk - a.apk);

				fs.writeFile(
					"_data/apk.json",
					JSON.stringify(json, null, 2),
					(error) => {
						if (error) {
							core.setFailed(error.message);
						} else {
							console.log("Build: Successfully wrote apk.json");
						}
					},
				);
			} catch (error) {
				core.setFailed(error.message);
			}
		});
	})
	.on("error", (error) => {
		core.setFailed(error.message);
	});
