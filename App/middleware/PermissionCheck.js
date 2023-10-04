const express = require('express');
const app = express();
const rolesModel = require(__dirname+'/../Models/roles');

const inArray = require('in-array'); 


const routePermissionCheck = (permissionName)=>{
      
    return async (req,res,next)=>{
      rolesModel.findOne({_id:req.session.user.roles_id}).then((permissionRoles)=>{
        const permission = permissionRoles.permission;
        if(inArray(permission,permissionName)){
            next();
        }else{
            const referer = req.headers.referer || '/';
            res.redirect(referer);
        }
    }).catch((err)=>{
        console.error(err.message);
    })
};
};


module.exports = routePermissionCheck; 