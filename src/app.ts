import express, { Application } from "express";
import { createMovies, deleteMovies, listMovies, listMoviesId, updadeMovies } from "./logic";
import { ensureMoviesExist, movieIdMiddle } from "./middlewares";
import { startDatabase } from "./database";

const app: Application = express();
app.use(express.json());

app.post("/movies", ensureMoviesExist, createMovies);
app.get("/movies", listMovies);
app.get("/movies/:id", movieIdMiddle, listMoviesId);
app.patch("/movies", movieIdMiddle, ensureMoviesExist, updadeMovies);
app.delete("/movies", movieIdMiddle, deleteMovies);

app.listen(3000, async () => {
  await startDatabase()
  console.log("server is running");
});
