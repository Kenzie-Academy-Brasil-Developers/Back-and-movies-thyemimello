import { Request, Response } from "express";
import {QueryConfig, QueryResult} from "pg"
import { IMovies, IMoviesRequest, NewCreateMovies } from "./interfaces";
import { client } from "./database";
import format from "pg-format";


const createMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const movieRequest: IMoviesRequest = request.body;

  const NewCreateMovies: NewCreateMovies = {
    ...movieRequest,
  };

  const queryString: string = `
    INSERT INTO 
        movies(name, category, duration, price )
    VALUES 
        ($1, $2, $3, $4)  
    RETURNING *      
    `;

  const queryConfig = {
    text: queryString,
    values: Object.values(NewCreateMovies),
  };

  const queryResult: QueryResult<IMovies> = await client.query(queryConfig);

  return response.status(201).json(queryResult.rows[0]);
};

const listMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
 const cate: any = request.query.category;
 let queryString: string = "";
 let queryResult: QueryResult<IMovies> = await client.query(queryString)


  if(cate){
  queryString = `
   SELECT
    *
   FROM 
    movies
  WHERE 
    category = $1
   `;

   const queryConfig: QueryConfig = {
     text: queryString,
     values:[cate]
   }
   queryResult = await client.query(queryConfig)

  }

  if(!cate || queryResult.rowCount === 0){
    queryString =`
        SELECT
            * 
        FROM
            movies;
    `;
   
    queryResult = await client.query(queryString);
};

  return response.status(200).json(queryResult.rows);
};

const listMoviesId = async (request: Request, response: Response):Promise<Response> => {
  const moviesCurrent: IMovies = response.locals.movies

  return response.status(200).json(moviesCurrent)
 }

 const updadeMovies = async(request:Request, response:Response): Promise<Response> =>{
  const id:number = parseInt(request.params.id);
  const movieData: Partial<IMoviesRequest> = request.body;

  const updateColumns = Object.keys(movieData);
  const updateValues  = Object.values(movieData);

  const queryString: string = format(`
      UPDATE 
          movies
          SET(%I) = ROW(%L)
      WHERE
           id = $1
      RETURNING *
      `,
      updateColumns,
      updateValues
  );

  const queryConfig: QueryConfig = {
      text: queryString,
      values: [id],
  };
  
  const queryResult: QueryResult<IMovies> = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
}

 const deleteMovies = async (request: Request, response: Response): Promise<Response> =>{
  const id: number = parseInt(request.params.id);

  const queryString: string =`
  DELETE FROM
      movies 
  WHERE 
      id = $1;
  `;

  const queryConfig: QueryConfig = {
      text: queryString,
      values: [id],
  };

  await client.query(queryConfig);
  
  return response.status(204).send();
}



export { createMovies, listMovies, listMoviesId, deleteMovies, updadeMovies };
