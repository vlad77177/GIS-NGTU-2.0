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

