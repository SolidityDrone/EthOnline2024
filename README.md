# Game 

Kartik avdventures is a simple platformer built on unity and combines the simplicity and responsiveness of Stackr sdk to create a tx-free expirience of playing a game on a web browser just by signing messages, and with the benefits of a Micro Rollup of having verifiable data and data availability about the games that are played.
The game repo is available [here](https://github.com/SolidityDrone/Verifiable-Kartik-s-Adventures.git)

## How it works 

The project is an union of Unity Engine, NextJs and Stackr Microrollup:
To start off, the game is a Unity WebGL build, which can run on a webpage in the Next application.
At this point the user may sign a message and the application will forward that signature to a dedicated MicroRollup running on Railway. Note that transactions are done by the MRU operator itself and the user just need to provide a signature, so no gas is spent during the process.

Whenever a game start or end, a signature is sent to the Micro Rollup, that takes care of batching transactions on Avail ( or Celestia ), resulting afterwards in a post on L1. 
From now on, every game will be recorded onchain along with score and inputs!


