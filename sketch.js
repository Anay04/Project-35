//Create variables here
var dog, happyDog, database, foodS, foodStock, dog1, dog2, fedTime, lastFed, feed, addFood, foodObj;

function preload() {
  dog1 = loadImage("images/dogImg.png");
  dog2 = loadImage("images/dogImg1.png");
}

function setup() {
  database = firebase.database();
	createCanvas(1000, 400);
  foodObj = new Food();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  
  dog = createSprite(800,200,150,150);
  dog.addImage(dog1);
  dog.scale = 0.15;

  feed = createButton("Feed The Dog!");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food!");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46, 139, 87);
  foodObj.display();
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data) {
    lastFed = data.val();
  })
  fill(255,255,255);
  textSize(15);
  if(lastFed >= 12) {
    text("lastFed" + lastFed%12+"pm",350,30)
  } else if(lastFed === 0) {
    text("lastFed: 12 AM", 350,30)
  } else {
    text("lastFed" + lastFed+"am",350,30)
  }
  
  
  
  drawSprites();
  
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog() {
  dog.addImage(dog1);
  if(foodObj.getFoodStock()<=0) {
    foodObj.updateFoodStock(foodObj.getFoodStock()*0)
  } else {
    foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  }
  database.ref('/').update(
    {
      Food: foodObj.getFoodStock(),
      FeedTime: hour()
    }
  )
}

function addFoods() {
  foodS++
  database.ref('/').update(
    {
      Food: foodS,
    }
  )
}