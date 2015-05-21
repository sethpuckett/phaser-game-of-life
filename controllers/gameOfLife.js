angular.module("gameOfLife")
    .controller("gameOfLifeCtrl", function ($scope) {
        $scope.screenWidth = 1920;
        $scope.screenHeight = 1080;
        $scope.cellXCount = 444;
        $scope.cellYCount = 250;
        $scope.edgeCount = 6;
        $scope.updatesPerMinute = 1200;
        $scope.fadeRate = 1; // 0-1 (no fade to immediate fade)

        $scope.backgroundColor = "#6B0000";
        $scope.cellColor = "darkBlue";
        $scope.historyColor = "darkBlue";

        $scope.totalXCount = $scope.cellXCount + ($scope.edgeCount * 2);
        $scope.totalYCount = $scope.cellYCount + ($scope.edgeCount * 2);
        $scope.cellXSize = $scope.screenWidth / $scope.cellXCount;
        $scope.cellYSize = $scope.screenHeight / $scope.cellYCount;
    });