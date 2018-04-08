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

App.factory('columnSettingsDecoder',function(){
    return{
        /*
         * r - SELEST
         * w - UPDATE
         * a - INSERT
         * d - DELETE
         */
        decode:function(data){
            for(var i=0;i<data.length;i++){
                if(data[i].attacl==null){
                    continue;
                }
                else{
                    /*
                     * имя_роли=xxxx/назначивший право
                     * x - права
                     */
                    
                    var strings=[];
                    var current_string='';
                    for(var j=0;j<data[i].attacl.length;j++){
                        if(data[i].attacl.charAt(j)=='{'){
                            continue;
                        }
                        if(data[i].attacl.charAt(j)!=',' && j<data[i].attacl.length-1){
                            current_string=current_string+data[i].attacl.charAt(j);
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
                    
                    data[i].attacl=users;
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

App.factory('getUpdateSQLString',function(){
    return{
        getString:function(content,copycontent,tablename,columnsettings,selected){
            var string='';
            for(var i=0;i<selected.length;i++){
                if(selected[i]==true){
                    string+='UPDATE '+tablename+' SET ';
                    for(var j=0;j<columnsettings.length;j++){
                        if(content[i][columnsettings[j].column_name]==undefined)
                            continue;
                        string+=columnsettings[j].column_name+'=';
                        if(columnsettings[j].typname=='varchar')
                            string+="'";
                        string+=content[i][columnsettings[j].column_name];
                        if(columnsettings[j].typname=='varchar')
                            string+="'";
                        if(j!=columnsettings.length-1){
                            string+=',';
                        }
                    }
                    string+=' WHERE ';
                    for(var j=0;j<columnsettings.length;j++){
                        if(copycontent[i][columnsettings[j].column_name]==undefined)
                            continue;
                        string+=columnsettings[j].column_name+'=';
                        if(columnsettings[j].typname=='varchar')
                            string+="'";
                        string+=copycontent[i][columnsettings[j].column_name];
                        if(columnsettings[j].typname=='varchar')
                            string+="'";
                        if(j!=columnsettings.length-1){
                            string+=' AND ';
                        }
                    }
                    string+=';';
                }
            }
            return string;
        }
    };
});

App.factory('getDeleteSQLString',function(){
    return{
        getString:function(content,copycontent,tablename,columnsettings,selected){
            var string='';
            for(var i=0;i<selected.length;i++){
                if(selected[i]==true){
                    string+='DELETE FROM '+tablename+' WHERE ';
                    for(var j=0;j<columnsettings.length;j++){
                        if(copycontent[i][columnsettings[j].column_name]==undefined)
                            continue;
                        string+=columnsettings[j].column_name+'=';
                        if(columnsettings[j].typname=='varchar')
                            string+="'";
                        string+=copycontent[i][columnsettings[j].column_name];
                        if(columnsettings[j].typname=='varchar')
                            string+="'";
                        if(j!=columnsettings.length-1){
                            string+=' AND ';
                        }
                    }
                    string+=';';
                }
            }
            return string;
        }
    };
});

App.factory('getSQLStringFromForm',function(){
    return{
        getInsertString:function(input,table){
            var string='INSERT INTO '+table+'(';
            for(var i=0;i<input.length;i++){
                string+=input[i].column;
                if(i!=input.length-1)
                    string+=',';
            }
            string+=') VALUES(';
            for(var i=0;i<input.length;i++){
                if(input[i].type=='varchar'){
                    string+="'";
                }
                string+=input[i].value;
                if(input[i].type=='varchar'){
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

App.factory('getColumnPrivilegesModel',function(){
    return{
        get:function(cs,username){
            console.log(username);
            var model={
                column:null,
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
            console.log(cs.length);//ok
            for(var i=0;i<cs.length;i++){
                models[i]=JSON.parse(JSON.stringify(model));
                models[i].column=cs[i].attname;
                if(cs[i].attacl==null){
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
                    for(var j=0;j<cs[i].attacl.length;j++){
                        if(cs[i].attacl[j].name==username){
                            settings=JSON.parse(JSON.stringify(cs[i].attacl[j]));
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

App.factory('getUpdateColumnPrivilegesString',function(){
    return{
        get:function(cpm,cs,tablename,username){
            var string='';
            
            var grantselect='GRANT SELECT (';
            var gs=false;
            var grantupdate='GRANT UPDATE (';
            var gu=false;
            var grantinsert='GRANT INSERT (';
            var gi=false;
            var grantdelete='GRANT DELETE (';
            var gd=false;
            var revokeselect='REVOKE SELECT (';
            var rs=false;
            var revokeupdate='REVOKE UPDATE (';
            var ru=false;
            var revokeinsert='REVOKE INSERT (';
            var ri=false;
            var revokedelete='REVOKE DELETE (';
            var rd=false;
            
            for(var i=0;i<cpm.length;i++){
                var column=cpm[i].column;
                var select=cpm[i].select.now;
                if(select==true){
                    for(var j=0;j<cs.length;j++){
                        if(cs[j].attname==column){
                            if(gs==true)
                                grantselect+=',';
                            grantselect+=column;
                            gs=true;
                        }
                    }
                }
            }
            grantselect+=') ON '+tablename+' TO '+username;
            
            for(var i=0;i<cpm.length;i++){
                var column=cpm[i].column;
                var update=cpm[i].update.now;
                if(update==true){
                    for(var j=0;j<cs.length;j++){
                        if(cs[j].attname==column){
                            if(gu==true)
                                grantupdate+=',';
                            grantupdate+=column;
                            gu=true;
                        }
                    }
                }
            }
            grantupdate+=') ON '+tablename+' TO '+username;
            
            for(var i=0;i<cpm.length;i++){
                var column=cpm[i].column;
                var insert=cpm[i].insert.now;
                if(insert==true){
                    for(var j=0;j<cs.length;j++){
                        if(cs[j].relname==column){
                            if(gi==true)
                                grantinsert+=',';
                            grantinsert+=column;
                            gi=true;
                        }
                    }
                }
            }
            grantinsert+=') ON '+tablename+' TO '+username;
            
            for(var i=0;i<cpm.length;i++){
                var column=cpm[i].column;
                var del=cpm[i].delete.now;
                if(del==true){
                    for(var j=0;j<cs.length;j++){
                        if(cs[j].attname==column){
                            if(gd==true)
                                grantdelete+=',';
                            grantdelete+=column;
                            gd=true;
                        }
                    }
                }
            }
            grantdelete+=') ON '+tablename+' TO '+username;
            
            for(var i=0;i<cpm.length;i++){
                var column=cpm[i].column;
                var select=cpm[i].select.now;
                if(select==false){
                    for(var j=0;j<cs.length;j++){
                        if(cs[j].attname==column && cs[j].attacl!=null){
                            for(var k=0;k<cs[j].attacl.length;k++){
                                if(cs[j].attacl[k].name==username){
                                    if(cs[j].attacl[k].select_r==true){
                                        if(rs==true)
                                            revokeselect+=',';
                                        revokeselect+=column;
                                        rs=true;
                                    }
                                }
                            }                          
                        }
                    }
                }
            }
            revokeselect+=') ON '+tablename+' FROM '+username;
            
            for(var i=0;i<cpm.length;i++){
                var column=cpm[i].column;
                var update=cpm[i].update.now;
                if(update==false){
                    for(var j=0;j<cs.length;j++){
                        if(cs[j].attname==column && cs[j].attacl!=null){
                            for(var k=0;k<cs[j].attacl.length;k++){
                                if(cs[j].attacl[k].name==username){
                                    if(cs[j].attacl[k].update_w==true){
                                        if(ru==true)
                                            revokeupdate+=',';
                                        revokeupdate+=column;
                                        ru=true;
                                    }
                                }
                            }                          
                        }
                    }
                }
            }
            revokeupdate+=') ON '+tablename+' FROM '+username;
            
            for(var i=0;i<cpm.length;i++){
                var column=cpm[i].table;
                var insert=cpm[i].insert.now;
                if(insert==false){
                    for(var j=0;j<cs.length;j++){
                        if(cs[j].attname==column && cs[j].attacl!=null){
                            for(var k=0;k<cs[j].attacl.length;k++){
                                if(cs[j].attacl[k].name==username){
                                    if(cs[j].attacl[k].insert_a==true){
                                        if(ri==true)
                                            revokeinsert+=',';
                                        revokeinsert+=column;
                                        ri=true;
                                    }
                                }
                            }                          
                        }
                    }
                }
            }
            revokeinsert+=') ON '+tablename+' FROM '+username;
            
            for(var i=0;i<cpm.length;i++){
                var column=cpm[i].table;
                var del=cpm[i].delete.now;
                if(del==false){
                    for(var j=0;j<cs.length;j++){
                        if(cs[j].relname==column && cs[j].attacl!=null){
                            for(var k=0;k<cs[j].attacl.length;k++){
                                if(cs[j].attacl[k].name==username){
                                    if(cs[j].attacl[k].delete_d==true){
                                        if(rd==true)
                                            revokedelete+=',';
                                        revokedelete+=column;
                                        rd=true;
                                    }
                                }
                            }                          
                        }
                    }
                }
            }
            revokedelete+=') ON '+tablename+' FROM '+username;
            
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


App.factory('getQueryString',function(){
    return{
        get:function(flag){
            switch(flag){
                case 1:{
                        return 'SELECT * FROM rooms_sotrudnik';
                }
                case 2:{
                        return 'SELECT * FROM rooms_computers';
                }
                case 3:{
                        return 'SELECT * FROM rooms_oborudovanie';
                }
                case 4:{
                        return 'SELECT * FROM sotrudnik_oborudovanie';
                }
            }
        }
    };
});

App.factory('getUpdateMembersString',function(){
    return{
        get:function(model,username){
            var string='';
            var string_g='GRANT ';
            var gfind=false;
            var string_r='REVOKE ';
            var rfind=false;
            for(var i=0,g=0,r=0;i<model.length;i++){
                if(model[i].default!=model[i].inherit){
                    if(model[i].inherit==true){
                        if(g!=0){
                            string_g+=',';
                        }
                        string_g+=model[i].rolename;
                        g++;
                        gfind=true;
                    }
                    if(model[i].inherit==false){
                        if(r!=0){
                            string_r+=',';
                        }
                        string_r+=model[i].rolename;
                        r++;
                        rfind=true;
                    }
                }
            }
            if(gfind==true){
                string_g+=' TO '+username;
            }
            if(rfind==true){
                string_r+=' FROM '+username;
            }
            if(gfind==true){
                string+=string_g;
                if(rfind==true){
                    string+=';'+string_r+';';
                }
            }
            else{
                if(rfind==true){
                    string+=string_r+';';
                }
                else{
                    string=false;
                }
            }
            return string;
        }
    };
});

App.factory('getItemModel',function(){
    return{
        get:function(modelname){
            var model;
            switch(modelname){
                case 'room':{
                    model={
                        table:'rooms',
                        input:{
                            elements:[
                                {
                                    value:null,
                                    description:'Номер аудитории',
                                    column:'unique_kad_num',
                                    type:'integer'
                                },
                                {
                                    value:null,
                                    description:'Описание',
                                    column:'opisanie',
                                    type:'varchar'
                                },
                                {
                                    value:null,
                                    description:'Тип комнаты',
                                    index:0,
                                    column:'id_type_room',
                                    targettable:'types_rooms',
                                    targetcolumnvalue:'id_tip_room',
                                    type:'integer',
                                    descriptionvalue:[
                                        'opisanie'
                                    ]
                                },
                                {
                                    value:null,
                                    description:'Ответственный сотрудник',
                                    index:1,
                                    column:'id_sotr',
                                    targettable:'sotrudniki',
                                    targetcolumnvalue:'id_sotrudnika',
                                    type:'integer',
                                    descriptionvalue:[
                                        'familia',
                                        'imya',
                                        'otchestvo'
                                    ]
                                }
                            ]
                        }
                    };
                    break;  
                }
                case 'sotrudnik':{
                        model={
                        table:'sotrudniki',
                        input:{
                            elements:[
                                {
                                    value:null,
                                    description:'Имя',
                                    column:'imya',
                                    type:'varchar'
                                },
                                {
                                    value:null,
                                    description:'Фамилия',
                                    column:'familia',
                                    type:'varchar'
                                },
                                {
                                    value:null,
                                    description:'Отчество',
                                    column:'otchestvo',
                                    type:'varchar'
                                },
                                {
                                    value:null,
                                    description:'Серия паспорта',
                                    column:'pasport_seria',
                                    type:'integer'
                                },
                                {
                                    value:null,
                                    description:'Номер паспорта',
                                    column:'pasport_nomer',
                                    type:'integer'
                                },
                                {
                                    value:null,
                                    description:'Контактный телефон',
                                    column:'kontaktniy_telephone',
                                    type:'integer'
                                },
                                {
                                    value:null,
                                    description:'Адрес',
                                    column:'origin',
                                    type:'varchar'
                                },
                                {
                                    value:null,
                                    description:'Отдел',
                                    index:0,
                                    column:'id_otdela',
                                    targettable:'otdely',
                                    targetcolumnvalue:'id_otdela',
                                    type:'integer',
                                    descriptionvalue:[
                                        'nazvanie'
                                    ]
                                },
                                {
                                    value:null,
                                    description:'Кафедра',
                                    index:1,
                                    column:'id_kafedra',
                                    targettable:'kafedry',
                                    targetcolumnvalue:'id_kafedry',
                                    type:'integer',
                                    descriptionvalue:[
                                        'nazvanie_kafedry'
                                    ]
                                }
                            ]
                        }
                    };
                    break;
                }
                case 'computer':{
                        model={
                            table:'computers',
                            input:{
                                elements:[
                                    {
                                        value:null,
                                        description:'Процессор',
                                        column:'processor',
                                        type:'double'
                                    },
                                    {
                                        value:null,
                                        description:'Жесткий диск',
                                        column:'hdd',
                                        type:'integer'
                                    },
                                    {
                                        value:null,
                                        description:'Память ГП',
                                        column:'gpu_memory',
                                        type:'double'
                                    },
                                    {
                                        value:null,
                                        description:'Память ОП',
                                        column:'ozu_memory',
                                        type:'double'
                                    },
                                    {
                                        value:null,
                                        description:'Оборудование',
                                        index:0,
                                        column:'id_oborudovaniya',
                                        targettable:'oborudovanie',
                                        targetcolumnvalue:'id_oborudovaniya',
                                        type:'integer',
                                        descriptionvalue:[
                                            'description'
                                        ]
                                    }
                                ]
                            }
                        };
                    break;
                }
                case 'oborudovanie':{
                        model={
                            table:'oborudovanie',
                            input:{
                                elements:[
                                    {
                                        value:null,
                                        description:'Описание',
                                        column:'description',
                                        type:'varchar'
                                    },
                                    {
                                        value:null,
                                        description:'Комната',
                                        column:'id_room',
                                        index:0,
                                        targettable:'rooms',
                                        targetcolumnvalue:'id_room',
                                        type:'integer',
                                        descriptionvalue:[
                                            'opisanie'
                                        ]
                                    },
                                    {
                                        value:null,
                                        description:'Ответственный сотрудник',
                                        index:1,
                                        column:'id_otvetstvennogo',
                                        targettable:'sotrudniki',
                                        targetcolumnvalue:'id_sotrudnika',
                                        type:'integer',
                                        descriptionvalue:[
                                            'familia',
                                            'imya',
                                            'otchestvo'
                                        ]
                                    }
                                ]
                            }
                        };
                    break;
                }
                case 'kafedra':{
                        model={
                            table:'kafedry',
                            input:{
                                elements:[
                                    {
                                        value:null,
                                        description:'Название кафедры',
                                        column:'nazvanie_kafedry',
                                        type:'varchar'
                                    },
                                    {
                                        value:null,
                                        description:'Корпус',
                                        column:'id_korpusa',
                                        index:0,
                                        targettable:'korpusa',
                                        targetcolumnvalue:'id_korpusa',
                                        type:'integer',
                                        descriptionvalue:[
                                            'nazvanie',
                                            'adres'
                                        ]
                                    }
                                ]
                            }
                        };
                    break;
                }
                case 'institut':{
                        model={
                            table:'institutes',
                            input:{
                                elements:[
                                    {
                                        value:null,
                                        description:'Название института',
                                        column:'nazvanie',
                                        type:'varchar'
                                    },
                                    {
                                        value:null,
                                        description:'Кафедра',
                                        column:'id_kafedry',
                                        index:0,
                                        targettable:'kafedry',
                                        targetcolumnvalue:'id_kafedry',
                                        type:'integer',
                                        descriptionvalue:[
                                            'nazvanie_kafedry'
                                        ]
                                    }
                                ]
                            }
                        };
                    break;
                }
                case 'filial':{
                        model={
                            table:'filialy',
                            input:{
                                elements:[
                                    {
                                        value:null,
                                        description:'Название филиала',
                                        column:'nazvanie',
                                        type:'varchar'
                                    },
                                    {
                                        value:null,
                                        description:'Адрес',
                                        column:'adres',
                                        type:'varchar'
                                    }
                                ]
                            }
                        };
                    break;
                }
                case 'facultet':{
                        model={
                            table:'facultets',
                            input:{
                                elements:[
                                    {
                                        value:null,
                                        description:'Название факультета',
                                        column:'nazvanie',
                                        type:'varchar'
                                    },
                                    {
                                        value:null,
                                        description:'Кафедра',
                                        column:'id_kafedry',
                                        index:0,
                                        targettable:'kafedry',
                                        targetcolumnvalue:'id_kafedry',
                                        type:'integer',
                                        descriptionvalue:[
                                            'nazvanie_kafedry'
                                        ]
                                    }
                                ]
                            }
                        };
                    break;
                }
                case 'room_type':{
                        model={
                            table:'types_rooms',
                            input:{
                                elements:[
                                    {
                                        value:null,
                                        description:'Описание типа',
                                        column:'opisanie',
                                        type:'varchar'
                                    }
                                ]
                            }
                        };
                    break;
                }
            }
            return model;
        }
    };
});