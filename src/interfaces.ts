
interface IMoviesRequest {
    name: string;
    category: string;
    duration: number;
    price: number;
}

interface IMovies extends IMoviesRequest {
    id: number;
}


type NewCreateMovies = Omit<IMovies, "id">

export {IMoviesRequest, IMovies, NewCreateMovies}