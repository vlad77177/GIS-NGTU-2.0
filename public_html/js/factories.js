App.factory('tableSettingsDecoder',function(){
    return{
        /*
         * r - SELEST
         * w - UPDATE
         * a - INSERT
         * d - DELETE
         */
        decode:function(data){
            for(var i=0;i<data.length;i++){
                if(data[i].relacl==null){
                    continue;
                }
                else{
                    /*
                     * имя_роли=xxxx/назначивший право
                     * x - права
                     */
                    
                    var strings=[];
                    var current_string='';
                    for(var j=0;j<data[i].relacl.length;j++){
                        if(data[i].relacl.charAt(j)=='{'){
                            continue;
                        }
                        if(data[i].relacl.charAt(j)!=',' && j<data[i].relacl.length-1){
                            current_string=current_string+data[i].relacl.charAt(j);
                        }
                        else{
                            strings[strings.length]=current_string;
                            current_string='';
                        }
                    }
                    
                    var users=[];
                    
                    var current_user={
                        name:'',
                        select_r:false,
                        update_w:false,
                        insert_a:false,
                        delete_d:false
                    };
                    
                    for(var j=0;j<strings.length;j++){
                        var is_name_find=false;
                        for(var k=0;k<strings[j].length;k++){
                            if(strings[j].charAt(k)!='=' && !is_name_find){
                                current_user.name=current_user.name+strings[j].charAt(k);
                            }
                            else{
                                is_name_find=true;
                                for(var s=k+1;s<strings[j].length;s++){
                                    if(strings[j].charAt(s)!='/'){
                                        switch(strings[j].charAt(s)){
                                            case 'r':{
                                                    current_user.select_r=true;
                                                    break;
                                            }
                                            case 'w':{
                                                    current_user.update_w=true;
                                                    break;
                                            }
                                            case 'a':{
                                                    current_user.insert_a=true;
                                                    break;
                                            }
                                            case 'd':{
                                                    current_user.delete_d=true;
                                                    break;
                                            }
                                        }
                                    }
                                    else{
                                        break;
                                    }
                                }
                            }
                        }
                        users[users.length]=JSON.parse(JSON.stringify(current_user));
                        current_user.name='';
                        current_user.select_r=false;
                        current_user.update_w=false;
                        current_user.insert_a=false;
                        current_user.delete_d=false;
                    }
                    
                    data[i].relacl=users;
                }
            }
            return data;
        }
    };
});

App.factory('newRowModelFactory',function(){
    return{
        get:function(input){
            var model=[];
            var col={
                column:null,
                value:null
            };
            for(var i=0;i<input.length;i++){
                model[i]=JSON.parse(JSON.stringify(col));
                model[i].column=input[i].column_name;
            }
            return model;
        }
    };
});

App.factory('getSQLString',function(){
    return{
        getInsertString:function(input,table,columnsettings){
            var string='INSERT INTO '+table+'(';
            for(var i=0;i<input.length;i++){
                string+=input[i].column;
                if(i!=input.length-1)
                    string+=',';
            }
            string+=') VALUES(';
            for(var i=0;i<input.length;i++){
                if(columnsettings[i].typname=='varchar'){
                    string+="'";
                }
                string+=input[i].value;
                if(columnsettings[i].typname=='varchar'){
                    string+="'";
                }
                if(i!=input.length-1){
                    string+=',';
                }
            }
            string+=')';
            return string;
        }
    };
});

App.factory('getTablePrivilegesModel',function(){
    return{
        get:function(ts,username){
            var model={
                table:null,
                select:null,
                update:null,
                insert:null,
                delete:null
            };
            var option=[
                {
                    value:false,
                    desc:'Запрещено'
                },
                {
                    value:true,
                    desc:'Разрешено'
                }
            ];
            var select=['Разрешен','Запрещен'];
            var models=[];
            console.log(ts.length);//ok
            for(var i=0;i<ts.length;i++){
                models[i]=JSON.parse(JSON.stringify(model));
                models[i].table=ts[i].relname;
                if(ts[i].relacl==null){
                    models[i].select={
                        now:false,
                        select:option
                    };
                    models[i].update={
                        now:false,
                        select:option
                    };
                    models[i].insert={
                        now:false,
                        select:option
                    };
                    models[i].delete={
                        now:false,
                        select:option
                    };
                }
                else{
                    var settings=null;
                    for(var j=0;j<ts[i].relacl.length;j++){
                        if(ts[i].relacl[j].name==username){
                            settings=JSON.parse(JSON.stringify(ts[i].relacl[j]));
                            break;
                        }
                    }
                    if(settings==null){
                        models[i].select={
                            now:false,
                            select:option
                        };
                        models[i].update={
                            now:false,
                            select:option
                        };
                        models[i].insert={
                            now:false,
                            select:option
                        };
                        models[i].delete={
                            now:false,
                            select:option
                        };
                    }
                    else{
                        models[i].select={
                            now:settings.select_r,
                            select:option
                        };
                        models[i].update={
                            now:settings.update_w,
                            select:option
                        };
                        models[i].insert={
                            now:settings.insert_a,
                            select:option
                        };
                        models[i].delete={
                            now:settings.delete_d,
                            select:option
                        };
                    }
                }
            }
            return models;
        }
    };
});
App.factory('getUserMembersModel',function(){
    return{
        get:function(current_user,users,members){
            var model=[];
            var element={
                rolename:null,
                oid:null,
                default:false,
                inherit:false,
                selected:false
            };
            for(var i=0,j=0;i<users.length;i++){
                if(current_user.oid==users[i].oid){
                    continue;
                }
                else{
                    model[j]=JSON.parse(JSON.stringify(element));
                    model[j].rolename=users[i].rolname;
                    model[j].oid=users[i].oid;
                    j++;
                }
            }
            for(var i=0;i<members.length;i++){
                if(current_user.oid==members[i].member){
                    var inheritoid=members[i].roleid;
                    for(var j=0;j<model.length;j++){
                        if(model[j].oid==inheritoid){
                            model[j].inherit=true;
                            model[j].default=true;
                        }
                    }
                }
            }
            return model;
        }
    };
});

App.factory('getCreateRoleString',function(){
    return{
        get:function(input){
            var string='CREATE ROLE '+input.name+' WITH';
            if(input.islogin==true){
                string+=' LOGIN PASSWORD \''+input.password+'\'';
            }
            else{
                string+=' NOLOGIN';
            }
            if(input.issuper==true){
                string+=' SUPERUSER';
            }
            if(input.isinherit==true){
                string+=' INHERIT';
            }
            if(input.iscreatedb==true){
                string+=' CREATEDB';
            }
            if(input.iscreaterole==true){
                string+=' CREATEROLE';
            }
            return string;
        }
    };
});

App.factory('getUpdatePrivilegesString',function(){
    return{
        get:function(tpm,ts,username){
            var string='';
            
            var grantselect='GRANT SELECT ON ';
            var gs=false;
            var grantupdate='GRANT UPDATE ON ';
            var gu=false;
            var grantinsert='GRANT INSERT ON ';
            var gi=false;
            var grantdelete='GRANT DELETE ON ';
            var gd=false;
            var revokeselect='REVOKE SELECT ON ';
            var rs=false;
            var revokeupdate='REVOKE UPDATE ON ';
            var ru=false;
            var revokeinsert='REVOKE INSERT ON ';
            var ri=false;
            var revokedelete='REVOKE DELETE ON ';
            var rd=false;
            
            for(var i=0;i<tpm.length;i++){
                var table=tpm[i].table;
                var select=tpm[i].select.now;
                if(select==true){
                    for(var j=0;j<ts.length;j++){
                        if(ts[j].relname==table){
                            if(gs==true)
                                grantselect+=',';
                            grantselect+=table;
                            gs=true;
                        }
                    }
                }
            }
            grantselect+=' TO '+username;
            
            for(var i=0;i<tpm.length;i++){
                var table=tpm[i].table;
                var update=tpm[i].update.now;
                if(update==true){
                    for(var j=0;j<ts.length;j++){
                        if(ts[j].relname==table){
                            if(gu==true)
                                grantupdate+=',';
                            grantupdate+=table;
                            gu=true;
                        }
                    }
                }
            }
            grantupdate+=' TO '+username;
            
            for(var i=0;i<tpm.length;i++){
                var table=tpm[i].table;
                var insert=tpm[i].insert.now;
                if(insert==true){
                    for(var j=0;j<ts.length;j++){
                        if(ts[j].relname==table){
                            if(gi==true)
                                grantinsert+=',';
                            grantinsert+=table;
                            gi=true;
                        }
                    }
                }
            }
            grantinsert+=' TO '+username;
            
            for(var i=0;i<tpm.length;i++){
                var table=tpm[i].table;
                var del=tpm[i].delete.now;
                if(del==true){
                    for(var j=0;j<ts.length;j++){
                        if(ts[j].relname==table){
                            if(gd==true)
                                grantdelete+=',';
                            grantdelete+=table;
                            gd=true;
                        }
                    }
                }
            }
            grantdelete+=' TO '+username;
            
            for(var i=0;i<tpm.length;i++){
                var table=tpm[i].table;
                var select=tpm[i].select.now;
                if(select==false){
                    for(var j=0;j<ts.length;j++){
                        if(ts[j].relname==table && ts[j].relacl!=null){
                            for(var k=0;k<ts[j].relacl.length;k++){
                                if(ts[j].relacl[k].name==username){
                                    if(ts[j].relacl[k].select_r==true){
                                        if(rs==true)
                                            revokeselect+=',';
                                        revokeselect+=table;
                                        rs=true;
                                    }
                                }
                            }                          
                        }
                    }
                }
            }
            revokeselect+=' FROM '+username;
            
            for(var i=0;i<tpm.length;i++){
                var table=tpm[i].table;
                var update=tpm[i].update.now;
                if(update==false){
                    for(var j=0;j<ts.length;j++){
                        if(ts[j].relname==table && ts[j].relacl!=null){
                            for(var k=0;k<ts[j].relacl.length;k++){
                                if(ts[j].relacl[k].name==username){
                                    if(ts[j].relacl[k].update_w==true){
                                        if(ru==true)
                                            revokeupdate+=',';
                                        revokeupdate+=table;
                                        ru=true;
                                    }
                                }
                            }                          
                        }
                    }
                }
            }
            revokeupdate+=' FROM '+username;
            
            for(var i=0;i<tpm.length;i++){
                var table=tpm[i].table;
                var insert=tpm[i].insert.now;
                if(insert==false){
                    for(var j=0;j<ts.length;j++){
                        if(ts[j].relname==table && ts[j].relacl!=null){
                            for(var k=0;k<ts[j].relacl.length;k++){
                                if(ts[j].relacl[k].name==username){
                                    if(ts[j].relacl[k].insert_a==true){
                                        if(ri==true)
                                            revokeinsert+=',';
                                        revokeinsert+=table;
                                        ri=true;
                                    }
                                }
                            }                          
                        }
                    }
                }
            }
            revokeinsert+=' FROM '+username;
            
            for(var i=0;i<tpm.length;i++){
                var table=tpm[i].table;
                var del=tpm[i].delete.now;
                if(del==false){
                    for(var j=0;j<ts.length;j++){
                        if(ts[j].relname==table && ts[j].relacl!=null){
                            for(var k=0;k<ts[j].relacl.length;k++){
                                if(ts[j].relacl[k].name==username){
                                    if(ts[j].relacl[k].delete_d==true){
                                        if(rd==true)
                                            revokedelete+=',';
                                        revokedelete+=table;
                                        rd=true;
                                    }
                                }
                            }                          
                        }
                    }
                }
            }
            revokedelete+=' FROM '+username;
            
            if(gs==true)
                string+=grantselect+';';
            if(gu==true)
                string+=grantupdate+';';
            if(gi==true)
                string+=grantinsert+';';
            if(gd==true)
                string+=grantdelete+';';
            
            if(rs==true)
                string+=revokeselect+';';
            if(ru==true)
                string+=revokeupdate+';';
            if(ri==true){
                string+=revokeinsert+';';
            }
            if(rd==true){
                string+=revokedelete+';';
            }
            
            return string;
            
        }
    };
});