import { configDotenv } from "dotenv";
import  app  from "./app.js";

configDotenv({ path: "./.env" });

app.listen(process.env.PORT, () => {
  console.log("running at ", process.env.PORT);
});
