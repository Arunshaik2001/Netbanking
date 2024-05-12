import { Router } from "express";
import loginRouter from "./login";
import debitRouter from "./debit";

const authRouter = Router();

authRouter.use("/login", loginRouter);
authRouter.use("/debit", debitRouter);

export default authRouter;
