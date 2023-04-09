import { Request, Response, response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { NextFunction } from "express";
import { client } from "./database";
import { IMovies, IMoviesRequest } from "./interfaces";

const movieIdMiddle = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { id } = request.params;

  const queryString: string = `
  SELECT * FROM
      movies
  WHERE
      id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [Number(id)],
  };

  const queryResult: QueryResult<IMovies> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      error: "Movie not found!",
    });
  }

  response.locals.movies = queryResult.rows[0];

  return next();
};

const ensureMoviesExist = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const moviesData: IMoviesRequest = request.body;

  const queryString: string = `
  SELECT * FROM
      movies
  WHERE
      name = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [moviesData.name],
  };

  const queryResult: QueryResult<IMovies> = await client.query(queryConfig);

  if (queryResult.rowCount === 1) {
    return response.status(409).json({
      error: "Movie name already exists!",
    });
  }

  return next();
};

export { movieIdMiddle, ensureMoviesExist };
