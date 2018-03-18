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


