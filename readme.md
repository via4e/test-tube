# Test tube

The project doesn't use any backend or frontend frameworks. All functions are implemented natively. Therefore, there's no package.json file and the 'npm install' isn't used. To run, you need to have Node.js of any current version installed. Simply launch server with the "node tube"  command and start client - open index.html in browser.

The server uses port 8989, which can be changed in line 4 of the /back/tube.js file if necessary.
The server uses CORS headers, so it runs locally without any issues.

## Launch

* Start server 

   From the project's root folder, run the command

   **cd back && node tube**

* Open client in browser
  
   From the project's root folder, run the command

   **google-chrome '../front/index.html'**

   or open the index.html file manually from the browser

   ##ToDo, What would I improve?

   1. State for storing the state of buttons
   2. Stylize the interface
   3. Improve media queries