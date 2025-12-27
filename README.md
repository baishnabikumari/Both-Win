# Reflection Rooms
> **One Move. Two Worlds each move is diff in the mirror world left = right.**
> **New Spikes and Things.**
```bash
   Portals(O,o) - teleportation.

   One-timeTile (+) if you Step on that tile is and move anywhere else so now the tile is solid You can step on this now.

   Spikes(^) Dont step the level will Restart.
   Ice(=) Sliding.
   Keys(yellow circle) and Lock(Yellow Square).
```

> **NOTE** - updated Full UI and Increased Level upto 12 with hard and confusion level. 

ScreenShot-

<img width="1440" height="772" alt="Screenshot 2025-12-10 at 2 07 56 PM" src="https://github.com/user-attachments/assets/60cb7c9e-5f64-44ad-8df3-9475a2ad2264" />
<img width="1440" height="770" alt="Screenshot 2025-12-10 at 2 07 37 PM" src="https://github.com/user-attachments/assets/133da50c-9feb-47ff-9a76-ef14f21dba7f" />
<img width="1439" height="775" alt="Screenshot 2025-12-10 at 2 07 30 PM" src="https://github.com/user-attachments/assets/d9f53026-4399-4616-9ad2-65083aff0d94" />
<img width="1440" height="773" alt="Screenshot 2025-12-10 at 2 05 12 PM" src="https://github.com/user-attachments/assets/bb8629df-b431-4a4e-b0b4-c81215d75551" />


## video of the game-play.

https://github.com/user-attachments/assets/e507b427-a4ae-4491-a694-3e17f03f4bdb

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
* **Levels built with simple text string (added more difficulty to levels)**
* **funny sounds added now for all the movements and for more buttons(R,N)**

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
 * **assets** for the sound .mp3 files.

 ## how can you create you own level?
--The game is very easy extensible. all the levels data is stored in the gameLogic.js as Array of the ASCII strings.

1. To add the level open the gameLogic.js form this repo.
2. Find the `const levels = [...]` array.
3. Add new objects(see the format inside the levels).
 ##

* **With all my ♥️ for [Milkyway](https://milkyway.hackclub.com/) By Baishu(me)**
