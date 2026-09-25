import {DataTypes,Model,Optional} from "sequelize"
import sequelize from "../../config/connection"
import type {FavoriteAttributes} from './favorite.type'
import Joi from "joi";

interface FavoriteCreationAttributes extends Optional<FavoriteAttributes,"id">{}

class Favorites extends Model<FavoriteAttributes,FavoriteCreationAttributes>
implements FavoriteAttributes{
    public id!:number;
    public userId!:number;
    public products!:number[]

}

Favorites.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
},
userId:{
    type:DataTypes.INTEGER,
    allowNull:false,
    unique:true,
    references:{model:"users",key:"id"},
    onDelete:"CASCADE",
    onUpdate:"CASCADE"
},
products:{
    type:DataTypes.JSON,
    allowNull:false,
    defaultValue:[],
    get(){
        const raw=this.getDataValue("products")
        if(typeof raw==="string"){
            try {
                return JSON.parse(raw);
            } catch{
                return []
            }
        }
        return raw || []
    }
 }
},
{sequelize,modelName:"favorites"}
)

const validateFavorite=(data:Partial<FavoriteAttributes>)=>{
    const schema=Joi.object({
        userId:Joi.number().optional(),
        products:Joi.array().items(Joi.number()).optional()
    })
    return schema.validate(data)
}
export {Favorites,validateFavorite}