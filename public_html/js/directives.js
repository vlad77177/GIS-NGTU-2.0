App.directive('loginForm',function(){
    return{
        restrict:'E',
        templateUrl:'templates/loginform.html',
        replace:true
    };
});
App.directive('tableMenu',function(){
    return{
        restrict:'E',
        templateUrl:'templates/tablemenu.html',
        replace:true
    };
});
App.directive('tableContent',function(){
    return{
        restrict:'E',
        templateUrl:'templates/table.html',
        replace:true
    };
});
App.directive('usersMenu',function(){
    return{
        restrict:'E',
        templateUrl:'templates/usersmenu.html',
        replace:true
    };
});
App.directive('userPrivileges',function(){
    return{
        restrict:'E',
        templateUrl:'templates/userprivilegestable.html',
        replace:true
    };
});
App.directive('userSettings',function(){
    return{
        restrict:'E',
        templateUrl:'templates/usersettings.html',
        replace:true
    };
});


