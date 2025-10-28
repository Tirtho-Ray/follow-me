import express, { type Application, type NextFunction, type Request, type Response } from "express"
import cors from "cors"
import notFound from "./middlewares/notfound";
import routes from "./routes";
const app: Application = express();


app.use(cors({
  origin: ["http://localhost:3000","http://localhost:5173",],
  credentials: true,            
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

//Testing
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Lost And Found API',
  });
});

app.use(notFound)
export default app;
