import express, { type Application, type NextFunction, type Request, type Response } from "express"
import cors from "cors"
import notFound from "./app/middlewares/notfound";
import routes from "./app/routes";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
const app: Application = express();


// app.use(cors({
//   origin: ["http://localhost:3000","http://localhost:5173",],
//   credentials: true,            
// }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/v1', routes);

//Testing
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Lost And Found API',
  });
});

app.use(notFound)
app.use(globalErrorHandler)
export default app;
