import { Application } from 'express';
import authRoutes from './auth.routes'


const wrapRoutes = (app: Application) => {

    app.use("/api/auth", authRoutes)


}

export default wrapRoutes;