import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async ( req: express.Request, res: express.Response ) => {

    //retrieve the url from the image_url query parameter
   let image_url = req.query.image_url;
    
   //Check to see if the image_url query parameter has been specified and a value provided for it
   //If a value has been provided, then check to determine if the provided image_url is a valid url and not some other value
   if ( !image_url ) {
     return res.status(400)
               .send(`A valid image URL is required e.g. http://${req.hostname}:8082/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg `);
   } else {
         try {
           
          const URL = require('url').URL;
          let is_url_valid = new URL(image_url);
          
         } catch (error) {
           return res.status(400)
                     .send(`Please enter a valid URL as a parameter`);
         }
     }
    
   //Send file to filterImageFromURL then send back the filtered output to the user
   
   try {
     let filteredfilepath = await filterImageFromURL(image_url);
     return res.status(200)
               .sendFile(filteredfilepath, () => {
                       let filePathArray: string[] = [filteredfilepath];
                       deleteLocalFiles(filePathArray);
     });
   } catch (error) {
     return res.status(400)
               .send('Error processing image');
   }
 
   });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();