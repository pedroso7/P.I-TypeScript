import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import { sequelize } from "./sequelize";

export class ProdutoModel extends Model<
    InferAttributes<ProdutoModel>,
    InferCreationAttributes<ProdutoModel>
> {
    declare id: CreationOptional<number>;
    declare nome: string;
    declare preco: number;
}

ProdutoModel.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nome: { type: DataTypes.STRING(100), allowNull: false },
        preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    },
    { sequelize, tableName: "produtos" }
);
