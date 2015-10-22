/**
 * Created by xiyu3 on 10/12/15.
 */

'use strict';


angular.module('kbWebApp')
  .controller('LoginCtrl', function ($scope,$http,$location,kbHttp,kbCookie) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    //if(kbCookie.getSessionID()!="") $location.path('/');

    $scope.deleteSession = function(){
        kbHttp.delMethod("/config/running_config/" + $scope.sessionID)
          .then(
          function (response) {  //  .resolve
            console.log("del sessionID");
          },
          function (response) {  //  .reject
            console.log("delete error:");
            console.log(response);
          }
        );
    };

    $scope.CleanUp = function(){
        kbHttp.postMethod("/kloudbuster/cleanup/" + $scope.sessionID)
          .then(
          function(response) {  //  .resolve
            console.log("clean up successfully");
          },
          function(response) {  //  .reject
            console.log("clean error:");
            console.log(response);
          }
        );
    };


    if(kbCookie.getSessionID()!="") {
      $scope.sessionID=kbCookie.getSessionID();
      if(kbCookie.getStatus()!="READY")
      {
        $scope.CleanUp();
      }
      $scope.deleteSession();
      kbCookie.init();
    }
//---------------------------------credentials--------------------------------
    $scope.samecloud = true;
    $scope.clouds = function() {
      if($scope.samecloud===true) {
        $('#inputPassword2').attr("disabled",true);
        $('#file2').attr("disabled",true);
      }
      else{
        $('#inputPassword2').attr("disabled",false);
        $('#file2').attr("disabled",false);

      }
      //console.log($scope.samecloud);
    };

    var test_rc;
    function readFile (evt) {
      var files = evt.target.files;
      var file = files[0];
      var reader = new FileReader();
      reader.onload = function() {
        test_rc = this.result;
        //console.log(this.result);
      };
      reader.readAsText(file);
    }
    document.getElementById('file1').addEventListener('change', readFile, false);

    var test_rc2;
    function readFile2 (evt) {
      var files = evt.target.files;
      var file = files[0];
      var reader = new FileReader();
      reader.onload = function() {
        test_rc2 = this.result;
        //console.log(this.result);
      };
      reader.readAsText(file);
    }
    document.getElementById('file2').addEventListener('change', readFile2, false);


    $scope.setConfig = function() {
      if($scope.samecloud===true){
        kbCookie.setIsOneCloud(true);
        $scope.credentials = { "tested-passwd": $scope.inputPassword1, "tested-rc": test_rc, "testing-passwd":"", "testing-rc":""};
      }
      else{
        kbCookie.setIsOneCloud(false);
        $scope.credentials = { "tested-passwd": $scope.inputPassword1, "tested-rc": test_rc, "testing-passwd":inputPassword2, "testing-rc":test_rc2};
      }

      //no sessionID but have cred
      $scope.runCon = {"credentials":{},kb_cfg:""};

      console.log($scope.credentials);
      $scope.runCon.credentials = $scope.credentials;

      kbCookie.setCredentials($scope.credentials);

      kbHttp.postMethod("/config/running_config", $scope.runCon)
        .then(
        function(response) {  //  .resolve
          kbCookie.setSessionID(response.data);
          $scope.sessionID = kbCookie.getSessionID();
          console.log("set config & get sesID:" + $scope.sessionID);
          $location.path('/');
        },
        function(response) {  //  .reject
          console.log("set config error:");
          console.log(response);
        }
      );
    }
  });