const fetch = require("node-fetch");
const assert = require('assert');

const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

let previousUSCount = 0;

console.log("Test affichage du bon nombre  d'US");

let projectToCreate = {
    id: 1,
    name: "OkOk",
    start_date: "2020-11-12",
    state: "Ouvert",
    end_date: "2020-11-14",
    git_repo: "https://github.com/max98hash/g1eq7-dev",
    description: "Projet de test"
}

fetch("http://localhost:3000/project/create", {
  method: "POST",
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  body: JSON.stringify(projectToCreate)
})
.then(() => driver.get("http://localhost:8080"))
.then(() => driver.sleep(1000))
.then(() => driver.findElement(By.className("v-btn v-btn--flat v-btn--text theme--dark v-size--default primary--text text--open")))
.then((project) => project.click())
.then(() => driver.sleep(1000))
.then(() => driver.findElements(By.css("tr")))
.then((lignes) => previousUSCount=lignes.length)
.then(() => driver.findElement(By.className("mx-2 success v-btn v-btn--contained v-btn--fab v-btn--round theme--dark v-size--default")))
.then((button) => button.click())
.then(() => {
    let desc = driver.findElement(By.id("description"));
    desc.sendKeys("As a developper I wan't to add and US so I can manage them");
})
.then(() => driver.findElement(By.className("mr-6 v-btn v-btn--contained theme--dark v-size--default success")))
.then((button) => button.click())
.then(() => driver.sleep(2000))
.then(() => driver.findElements(By.css("tr")))
.then((lignes) => {
    if(lignes.length>previousUSCount){
        assert.ok(true);
    }
    else{
        assert.ok(false);
    }
})
.then(() => driver.quit());

