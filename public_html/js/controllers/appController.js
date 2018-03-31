/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
App.controller('AppController',['$scope',
    '$http',
    'tableSettingsDecoder',
    'columnSettingsDecoder',
    'getTablePrivilegesModel',
    'getColumnPrivilegesModel',
    'newRowModelFactory',
    'getSQLString',
    'getUserMembersModel',
    'getCreateRoleString',
    'getUpdatePrivilegesString',
    'getUpdateColumnPrivilegesString',
    'getUpdateMembersString',
    'getQueryString',
    function AppController($scope,
            $http,
            tableSettingsDecoder,
            columnSettingsDecoder,
            getTablePrivilegesModel,
            getColumnPrivilegesModel,
            newRowModelFactory,
            getSQLString,
            getUserMembersModel,
            getCreateRoleString,
            getUpdatePrivilegesString,
            getUpdateColumnPrivilegesString,
            getUpdateMembersString,
            getQueryString
        ){
      
        $scope.tablenames=false;
        $scope.openedmenupage=1;
        $scope.isuserlog=false;
        $scope.alreadycheck=false;
        $scope.columnprotectionshow=false;
        $scope.newrow=[];
               
        $scope.getTableNames=function(){
            $http({method:'POST',data:$scope.user,url:'php/gettablenames.php'})
                        .success(function(data){
                            console.log(data);
                            if(Array.isArray(data)){
                                console.log('массив');
                                $scope.tablenames=data;
                            }
                            else{
                                $scope.tablenames=false;
                            }
                        })
                        .error(function(status){
                            console.log('error');
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.getTableColumns=function(table_name){
            var data={
                user:null,
                tablename:null
            };
            data.user=$scope.user;
            data.tablename=table_name;
            $http({method:'POST',data:data,url:'php/gettablecolumns.php'})
                        .success(function(data){
                            if(data!==false){
                                $scope.selectedtablecolumns=data;
                                $scope.newrow=newRowModelFactory.get($scope.selectedtablecolumns);
                                $scope.columnprotectionsettings=columnSettingsDecoder.decode(data);
                                $scope.columnprivilegesmodel=getColumnPrivilegesModel.get($scope.columnprotectionsettings,$scope.user.login);
                                $scope.getTableContent(table_name);
                            }
                            else{
                                $scope.selectedtablecolumns=undefined;
                            }
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.getTableContent=function(table_name){
            var columns=[];
            for(var i=0,j=0;i<$scope.columnprivilegesmodel.length;i++){
                if($scope.columnprivilegesmodel[i].select.now==true){
                    columns[j++]=$scope.columnprivilegesmodel[i].column;
                }
            }
            var data={
                user:null,
                tablename:null,
                columns:columns
            };
            data.user=$scope.user;
            data.tablename=table_name;
            $http({method:'POST',data:data,url:'php/gettablecontent.php'})
                        .success(function(data){
                            if(Array.isArray(data)){
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
        
        $scope.getUsers=function(){
            $http({method:'POST',data:$scope.user,url:'php/getuserssettings.php'})
                        .success(function(data){
                            console.log(data);
                            if(Array.isArray(data)){
                                $scope.users=data;
                            }
                            else{
                                $scope.users=undefined;
                            }
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.getUserMembers=function(){
            $http({method:'POST',data:$scope.user,url:'php/getusermembers.php'})
                        .success(function(data){
                            $scope.usermembers=data;
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.getTableSettings=function(){
            $http({method:'POST',data:$scope.user,url:'php/gettablessettings.php'})
                        .success(function(data){
                            console.log(data);
                            $scope.tablesettings=tableSettingsDecoder.decode(data);
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.getTable=function(table_name){;
            $scope.selectedtablename=table_name;
            $scope.selectedtablecolumns=undefined;
            $scope.selectedtablecontent=undefined;
            $scope.columnprotectionsettings=undefined;
            $scope.columnprivilegesmodel=undefined;
            $scope.getTableColumns(table_name);                             
        };
        
        $scope.changeMenuPage=function(page){
            $scope.openedmenupage=page;
            switch(page){
                case 1:{
                        $scope.getTableNames();
                        if($scope.tablenames!==false){
                            console.log('загружаю column_name');
                            $scope.getTableColumns($scope.tablenames[0]);
                        }
                        break;
                }
                case 2:{
                        $scope.getUsers();
                        $scope.getUserMembers();
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
                                $scope.alreadycheck=true;
                                $scope.changeMenuPage(1);
                                $scope.getTableSettings();
                            }
                            else{
                                $scope.isuserlog=false;
                                $scope.alreadycheck=true;
                            }
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.showUserSettings=function(user){
            $scope.current_user=user;
            $scope.tableprivilegesmodel=getTablePrivilegesModel.get($scope.tablesettings,user.rolname);
            $scope.usermembersmodel=getUserMembersModel.get($scope.current_user,
                $scope.users,
                $scope.usermembers
            );
        };
        
        $scope.getTdPrivilegesClass=function(model,oldmodel){
            if(model!=oldmodel){
                return 'td-changed';
            }
            else if(model){
                return 'td-enabled';
            }
            return 'td-disabled';
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
        
        $scope.getUserInheritValueClass=function(element){
            if(element.inherit!=element.default){
                return 'user-inherit-value-new';
            }
            else{
                if(element.selected==true){
                    return 'user-inherit-value-selected';
                }
                else{
                    return 'user-inherit-value';
                }
            }
        };
        
        $scope.newInherit=function(){
            for(var i=0;i<$scope.usermembersmodel.length;i++){
                if($scope.usermembersmodel[i].selected==true && $scope.usermembersmodel[i].inherit==false){
                    $scope.usermembersmodel[i].inherit=true;
                    $scope.usermembersmodel[i].selected=false;
                }
            }
        };
        
        $scope.newNoInherit=function(){
            for(var i=0;i<$scope.usermembersmodel.length;i++){
                if($scope.usermembersmodel[i].selected==true && $scope.usermembersmodel[i].inherit==true){
                    $scope.usermembersmodel[i].inherit=false;
                    $scope.usermembersmodel[i].selected=false;
                }
            }
        };
        
        $scope.addRow=function(){
            var string=getSQLString.getInsertString($scope.newrow,$scope.selectedtablename,$scope.selectedtablecolumns);
            var data={
                login:$scope.user.login,
                password:$scope.user.password,
                string:string
            };
            $http({method:'POST',data:data,url:'php/addrow.php'})
                        .success(function(data){
                            if(data!=0){
                                alert(data);
                            }
                            $scope.getTableContent($scope.selectedtablename);
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.addRole=function(){
            var string=getCreateRoleString.get($scope.newuser);
            var data={
                login:$scope.user.login,
                password:$scope.user.password,
                string:string
            };
            $http({method:'POST',data:data,url:'php/createuser.php'})
                        .success(function(data){
                            if(data!=0){
                                alert(data);
                            }
                            $scope.getUsers();
                            $scope.showUserSettings($scope.newuser.name);
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.updatePrivileges=function(){
            var string=getUpdatePrivilegesString.get($scope.tableprivilegesmodel,$scope.tablesettings,$scope.current_user.rolname);
            var data={
                login:$scope.user.login,
                password:$scope.user.password,
                string:string
            };
            $http({method:'POST',data:data,url:'php/updateprivileges.php'})
                        .success(function(data){
                            if(data!=0){
                                alert(data);
                            }
                            $scope.getTableSettings();
                            $scope.showUserSettings($scope.current_user.name);
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.updateColumnPrivileges=function(tablename){
            var string=getUpdateColumnPrivilegesString.get($scope.columnprivilegesmodel,
                $scope.columnprotectionsettings,
                $scope.currentcolumnprotectiontable,
                $scope.current_user.rolname
            );
            var data={
                login:$scope.user.login,
                password:$scope.user.password,
                string:string
            };
            $scope.columnprotectionshow=false;
            $http({method:'POST',data:data,url:'php/query.php'})
                        .success(function(data){
                            if(data!=0){
                                alert(data);
                            }
                            $scope.getUserMembers();
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.updateInheritData=function(){
            var string=getUpdateMembersString.get($scope.usermembersmodel,$scope.current_user.rolname);
            var data={
                login:$scope.user.login,
                password:$scope.user.password,
                string:string
            };
            $http({method:'POST',data:data,url:'php/query.php'})
                        .success(function(data){
                            if(data!=0){
                                alert(data);
                            }
                            $http({method:'POST',data:$scope.user,url:'php/getusermembers.php'})
                                .success(function(data){
                                    $scope.usermembers=data;
                                    $scope.usermembersmodel=getUserMembersModel.get($scope.current_user,
                                        $scope.users,
                                        $scope.usermembers
                                    );
                                })
                                .error(function(status){
                                    console.log(JSON.stringify(status));
                            });
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.openQueryCategory=function(op){
            $scope.queryresult=undefined;
            $scope.queryresultkeys=undefined;
            $scope.openquerycategory=op;
        };
        
        $scope.getQueryResult=function(flag){
            var string=getQueryString.get(flag);
            var data={
                login:$scope.user.login,
                password:$scope.user.password,
                string:string
            };
            $http({method:'POST',data:data,url:'php/query.php'})
                        .success(function(data){
                            if(Array.isArray(data)){
                                $scope.queryresult=data;
                                $scope.queryresultkeys=Object.keys($scope.queryresult[0]);
                            }
                            else{
                                alert("Ошибка! У вас нет прав на выполнение запроса!");
                                $scope.queryresult=undefined;
                            }                          
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        
        $scope.showColumnProtectionTable=function(tablename){
            $scope.currentcolumnprotectiontable=tablename;
            var data={
                user:null,
                tablename:null
            };
            data.user=$scope.user;
            data.tablename=tablename;
            $http({method:'POST',data:data,url:'php/gettablecolumns.php'})
                        .success(function(data){
                            if(data!==false){
                                $scope.columnprotectionsettings=columnSettingsDecoder.decode(data);
                                $scope.columnprotectionshow=true;
                                $scope.columnprivilegesmodel=getColumnPrivilegesModel.get($scope.columnprotectionsettings,$scope.current_user.rolname);
                            }
                            else{
                                $scope.columnprotectionsettings=undefined;
                            }
                        })
                        .error(function(status){
                            console.log(JSON.stringify(status));
            });
        };
        }
]);


