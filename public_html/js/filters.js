//Фильтр по значению rolcanlogin
App.filter('users',function(){
    return function(input){
        //var blacklist=['postgres'];
        var users=[];
        for(var i=0;i<input.length;i++){
            if(input[i].rolcanlogin==='t'){
                users.push(input[i]);
            }
        }
        return users;
    };
});
App.filter('groups',function(){
    return function(input){
        var groups=[];
        for(var i=0;i<input.length;i++){
            if(input[i].rolcanlogin==='f'){
                groups.push(input[i]);
            }
        }
        return groups;
    };
});
App.filter('userSetting',function(){
    return function(input){
        if(input==='t')
            return 'Да';
        else
            return 'Нет';
    };
});
App.filter('userSettingConnections',function(){
    return function(input){
        if(input==-1)
            return 'Infinity';
        else
            return input;
    };
});
App.filter('userPrivileges',function(){
    return function(input){
        if(input==true)
            return 'Разрешено';
        else
            return 'Запрещено';
    };
});
App.filter('relaclUserFind',function(){
    return function(input,user,mode){
        if(input==null){
            return false;
        }
        var index=-1;
        for(var i=0;i<input.length;i++){
            if(input[i].name==user){
                index=i;
                break;
            }
        }
        if(index!=-1){
            switch(mode){
                case 'r':{
                        return input[index].select_r;
                        break;
                }
                case 'w':{
                        return input[index].update_w;
                        break;
                }
                case 'a':{
                        return input[index].insert_a;
                        break;
                }
                case 'd':{
                        return input[index].delete_d;
                        break;
                }
            }
        }
        else{
            return false;
        }
    };
});
App.filter('findUserSettings',function(){
    return function(input,users){
        for(var i=0;i<users.length;i++){
            if(input.login==users[i].rolname){
                return users[i];
            }
        }
    };
});
App.filter('columnType',function(){
    return function(input){
        var string='';
        switch(input.typname){
            case 'int4':{
                    string+='Целое число(4 байта)';
                    break;
            }
            case 'varchar':{
                    string+='Строка';
                    break;
            }
            case 'float8':{
                    string+='Вещественное число(8 байт)';
                    break;
            }
            default:{
                    string+='Не определено';
            }
        }
        switch(input.contype){
            case 'c':{
                    string+=' | Ограничение-проверка';
                    break;
            }
            case 'f':{
                    string+=' | Внешний ключ';
                    break;
            }
            case 'p':{
                    string+=' | Первичный ключ';
                    break;
            }
            case 'u':{
                    string+=' | Ограничение-уникальности';
                    break;
            }
            case 't':{
                    string+=' | Триггер ограничения';
                    break;
            }
            case 'e':{
                    string+=' | Ограничение-исключение';
                    break;
            }
        }
        return string;
    };
});
App.filter('noinherit',function(){
    return function(input){
        var result=[];
        for(var i=0,j=0;i<input.length;i++){
            if(input[i].inherit==false){
                result[j]=input[i];
                j++;
            }
        }
        return result;
    };
});
App.filter('inherit',function(){
    return function(input){
        var result=[];
        for(var i=0,j=0;i<input.length;i++){
            if(input[i].inherit==true){
                result[j]=input[i];
                j++;
            }
        }
        return result;
    };
});

