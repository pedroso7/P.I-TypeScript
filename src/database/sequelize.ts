import { Sequelize } from "sequelize";
import { criarConfigBanco } from "../config/database";

export const sequelize = new Sequelize(criarConfigBanco());
