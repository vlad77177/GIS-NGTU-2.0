/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
App.controller('AppController',['$scope','$http',
    function AppController($scope,$http){
        $scope.tablenames=null;
        $scope.openedmenupage=1;
        $scope.isuserlog=false;
        $scope.test='test';
        
        $scope.getTableNames=function(){
            $http({method:'POST',data:$scope.user,url:'php/gettablenames.php'})
                        .success(function(data){
                            $scope.tablenames=data;
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.getTableColumns=function(table_name){
            var data={
                user:null,
                table_name:null
            };
            data.user=$scope.user;
            data.table_name=table_name;
            $http({method:'POST',data:data,url:'php/gettablecolumns.php'})
                        .success(function(data){
                            $scope.selectedtablecolumns=data;
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.getTableContent=function(table_name){
            var data={
                user:null,
                table_name:null
            };
            data.user=$scope.user;
            data.table_name=table_name;
            $http({method:'POST',data:data,url:'php/gettablecontent.php'})
                        .success(function(data){
                            if(data!=="false"){
                                $scope.selectedtablecontent=data;
                            }
                            else{
                                $scope.selectedtablecontent=undefined;
                            }
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.getTable=function(table_name){
            $scope.getTableColumns(table_name);
            $scope.getTableContent(table_name);
        };
        
        $scope.changeMenuPage=function(page){
            $scope.openedmenupage=page;
            switch(page){
                case 1:{
                        $scope.getTableNames();
                        if($scope.tablenames!==null)
                            $scope.getTableColumns($scope.tablenames[0]);
                        break;
                }
                case 2:{
                        break;
                }
                case 3:{
                        break;
                }
            }
        };
        
        $scope.checkLogin=function(){
            $http({method:'POST',url:'php/checklogin.php'})
                        .success(function(data){
                            var user=data;
                            console.log($scope.user);
                            if(user.login!==null){
                                console.log("Пользователь найден");
                                $scope.user=data;
                                $scope.isuserlog=true;
                                $scope.changeMenuPage(1);
                            }
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.logOut=function(){
            $http({method:'POST',url:'php/logout.php'})
                        .success(function(){
                            $scope.isuserlog=false;
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        console.log("Проверка сессии");
        $scope.checkLogin();
        
        $scope.userLogin=function(){
            $http({method:'POST',data:$scope.user,url:'php/login.php'})
                        .success(function(data){
                            $scope.checkLogin();
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
    }
]);


