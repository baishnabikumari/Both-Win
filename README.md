# Reflection Rooms
> **One Move. Two Worlds.**

ScreenShot-
<img width="1440" height="723" alt="Screenshot 2025-12-08 at 10 43 48 PM" src="https://github.com/user-attachments/assets/23fead4c-a6ac-4637-8567-4f715541e242" />
<img width="1440" height="723" alt="Screenshot 2025-12-08 at 10 44 01 PM" src="https://github.com/user-attachments/assets/279c1150-aa3b-449a-99e2-0d72ded9cc46" />

## video of the game-play.
https://github.com/user-attachments/assets/dbfe4778-5dd3-4a21-b6f7-1fc8cef226d3

## About the GAME
**Why Reflection Rooms?** because it is a dual world puzzle game built with plan JavaScript, css and HTML 5 Canvas. Here you control two character(As a ball) - one in "Real world" and 2nd one in "Mirror World".

The catch? **Their movement are linked**
* **vertical movement** - synchronized (up is up).
* **Horizontal movement** is **mirrored** (left is right).
```
3 levels only || more levels soon with more complexity
```

you must navigate obstacles, trigger the switches, and use your controls and the differences of that to guide them both.

## Features
* **Dual physics engine**
* **Interactive**
* **A-symmetrical maps**
* **Levels built with simple text strings**

## Built with
* **HTML5 Canvas**
* **Vanilla JS** Pure logic.
* **CSS3**

### You don't need to install anything the game entirely runs on browser!

### Installation
1. **clone repo**
```bash
git clone https://github.com/baishnabikumari/Both-Win.git
```

2. **Navigate to the project folder**
```bash
cd Both-Win
```

3. **Run the game** simply click on the html file and open it in browser usin glive server or in you own way(double-click).

## how to play

### Controls

keys
```bash
 ↑(up) ↓(down) →(right(In Real World)) ←(left(In Real world))

 ←(Right in Mirror World)  →(Left in Mirror World)

 R(Restart the same level where you are rn)
 N(Skip this level and go on nect level)
 ESC(close the popup(When you open(How To Play?)))
 ```

 ### Rules
 1. **Goal** Move Blue player to the 'G' anf Pink player to 'g'.
 2. **Walls** It stops both players. Where 'R' stops Only real and 'X' stops only mirror.
 3. **Doors** they are solid unit you step on the same color switch in the **opposite** world

 ## Code structure
 * **index.html** Container, canvas, UI overlays.
 * **style.css** Theme uses :'root'.
 * **gameLogic.js** Handle rendering, calculates physics and check the collisions.

 ## how can you create you own level?
--The game is very easy extensible. all the levels data is stored in the gameLogic.js as Array of the ASCII strings.

1. To add the level open the gameLogic.js form this repo.
2. Find the `const levels = [...]` array.
3. Add new objects(see the format inside the levels).
 ##

* **With all my ♥️ for [Milkyway](https://milkyway.hackclub.com/) By Baishu(me)**
