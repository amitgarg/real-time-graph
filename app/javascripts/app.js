var myapp = angular.module('myApp', []);

myapp.factory('FeedService', function () {

  var service = {};

  var feeds = $.get('./app/fixtures/data.txt').then(function (response) {
    return response.split('\r\n');
  });
  var feedCounter = 0;
  var parseFeed = function (feed) {
    var feedData = feed.split(', ');
    return {
      age: feedData[0],
      sex: feedData[9],
      salary: feedData[14]
    }
  }

  service.getFeed = function () {
    return feeds.then(feeds => feeds[feedCounter++ % 2000]).then(parseFeed);
  };
  return service;

});

myapp.controller("MainCtrl", function ($scope, FeedService) {
  $scope.currentFeed;
  $scope.feeds = [];
  $scope.numberOfFeeds = 0;
  var pollFeed = function () {
    FeedService.getFeed().then(function (feed) {
      $scope.feeds.push(feed);
      $scope.numberOfFeeds++;
      $scope.currentFeed = feed;
      $scope.$apply();
      setTimeout(pollFeed, 1000);
    });
  }
  pollFeed();
});

myapp.controller("UserSigninCtrl", function ($scope) {
  $scope.ageData = [];
  $scope.pageViewsPerSecondDataPoints = [];

  var liveUsersAgeDataChart = new CanvasJS.Chart("live-users-age-data-per-second", {
    animationDuration: 800,
    animationEnabled: true,
    backgroundColor: "transparent",
    axisX: {
      interval: 1,
      labelAutoFit: false,
      labelFontColor: "#717171",
      lineColor: "#a2a2a2",
      tickColor: "transparent",
      tickLength: 2,
      labelFormatter: function (e) {
        var diff = e.value - $scope.numberOfFeeds;
        return diff % 5 < 0 ? "" : diff + "";
      }
    },
    axisY: {
      gridThickness: 0,
      labelFontColor: "#717171",
      lineColor: "#a2a2a6",
      tickColor: "#a2a2a2"
    },
    toolTip: {
      cornerRadius: 0,
      fontStyle: "normal",
    },
    data: [{
      xValueFormatString: "age(years)",
      type: "column",
      dataPoints: $scope.pageViewsPerSecondDataPoints
    }]
  });

  $scope.$watch('numberOfFeeds', function () {
    if ($scope.numberOfFeeds > 0) {
      var color = $scope.currentFeed.sex === 'Male' ? 'RoyalBlue' : '#e76486';
      $scope.pageViewsPerSecondDataPoints.push({
        x: $scope.numberOfFeeds,
        y: parseInt($scope.currentFeed.age),
        color: color
      });
      if ($scope.numberOfFeeds > 31) {
        $scope.pageViewsPerSecondDataPoints.shift();
      }
      liveUsersAgeDataChart.render();
    }
  });
});

myapp.controller("MaleFemalRatioCtrl", function ($scope) {
  $scope.statistics = [{
    y: 0,
    name: "Male"
  }, {
    y: 0,
    name: "Female"
  }];

  var maleFemalRatioDonutChart = new CanvasJS.Chart("male-femal-ratio-donut-chart", {
    animationDuration: 800,
    animationEnabled: true,
    backgroundColor: "transparent",
    colorSet: "customColorSet",
    theme: "theme2",
    legend: {
      fontFamily: "calibri",
      fontSize: 14,
      horizontalAlign: "left",
      verticalAlign: "center",
      itemTextFormatter: function (e) {
        return e.dataPoint.name + ": " + Math.round(e.dataPoint.y / $scope.numberOfFeeds * 100) + "%";
      }
    },
    title: {
      dockInsidePlotArea: true,
      fontSize: 55,
      fontWeight: "normal",
      horizontalAlign: "center",
      verticalAlign: "center",
      text: "55"
    },
    toolTip: {
      cornerRadius: 0,
      fontStyle: "normal",
      contentFormatter: function (e) {
        return e.entries[0].dataPoint.name + ": " + Math.round(e.entries[0].dataPoint.y / $scope.numberOfFeeds * 100) + "% (" + e.entries[0].dataPoint.y + ")";
      }
    },
    data: [{
      innerRadius: "80%",
      radius: "90%",
      legendMarkerType: "square",
      showInLegend: true,
      startAngle: 90,
      type: "doughnut",
      dataPoints: $scope.statistics
    }]
  });

  $scope.$watch('numberOfFeeds', function () {
    if ($scope.numberOfFeeds > 0) {
      if ($scope.currentFeed.sex === 'Male') {
        $scope.statistics[0].y += 1;
      } else {
        $scope.statistics[1].y += 1;
      }
      maleFemalRatioDonutChart.options.title.text = $scope.numberOfFeeds.toString();
      maleFemalRatioDonutChart.render();
    }
  });
});

myapp.controller("SalaryWiseSigninCtrl", function ($scope) {
  $scope.statistics = [{
    y: 0,
    name: "<=50K"
  }, {
    y: 0,
    name: ">50K"
  }];

  var salaryWiseSigninPieChart = new CanvasJS.Chart("salary-wise-sign-in-raio-pie-chart", {
    animationDuration: 800,
    animationEnabled: true,
    backgroundColor: "transparent",
    colorSet: "customColorSet",
    legend: {
      fontFamily: "calibri",
      fontSize: 14,
      horizontalAlign: "left",
      verticalAlign: "center",
      itemTextFormatter: function (e) {
        return e.dataPoint.name + ": " + Math.round(e.dataPoint.y / $scope.numberOfFeeds * 100) + "%";
      }
    },
    toolTip: {
      cornerRadius: 0,
      fontStyle: "normal",
      contentFormatter: function (e) {
        return e.entries[0].dataPoint.name + ": " + Math.round(e.entries[0].dataPoint.y / $scope.numberOfFeeds * 100) + "% (" + e.entries[0].dataPoint.y + ")";
      }
    },
    data: [{
      legendMarkerType: "square",
      radius: "90%",
      showInLegend: true,
      startAngle: 90,
      type: "pie",
      dataPoints: $scope.statistics
    }]
  });

  $scope.$watch('numberOfFeeds', function () {
    if ($scope.numberOfFeeds > 0) {
      if ($scope.currentFeed.salary === '<=50K') {
        $scope.statistics[0].y += 1;
      } else {
        $scope.statistics[1].y += 1;
      }
      salaryWiseSigninPieChart.render();
    }
  });
});


myapp.controller("AgeWiseSigninCtrl", function ($scope) {
  $scope.statistics = [{
    y: 0,
    name: "0-25Yrs"
  }, {
    y: 0,
    name: "25-35Yrs"
  }, {
    y: 0,
    name: "35-50Yrs"
  }, {
    y: 0,
    name: ">50Yrs"
  }];

  var ageWiseSigninPieChart = new CanvasJS.Chart("age-wise-sign-in-raio-pie-chart", {
    animationDuration: 800,
    animationEnabled: true,
    backgroundColor: "transparent",
    colorSet: "customColorSet",
    legend: {
      fontFamily: "calibri",
      fontSize: 14,
      horizontalAlign: "left",
      verticalAlign: "center",
      itemTextFormatter: function (e) {
        return e.dataPoint.name + ": " + Math.round(e.dataPoint.y / $scope.numberOfFeeds * 100) + "%";
      }
    },
    toolTip: {
      cornerRadius: 0,
      fontStyle: "normal",
      contentFormatter: function (e) {
        return e.entries[0].dataPoint.name + ": " + Math.round(e.entries[0].dataPoint.y / $scope.numberOfFeeds * 100) + "% (" + e.entries[0].dataPoint.y + ")";
      }
    },
    data: [{
      legendMarkerType: "square",
      radius: "90%",
      showInLegend: true,
      startAngle: 90,
      type: "pie",
      dataPoints: $scope.statistics
    }]
  });

  $scope.$watch('numberOfFeeds', function () {
    if ($scope.numberOfFeeds > 0) {
      var age = $scope.currentFeed.age;
      if (age < 25) {
        $scope.statistics[0].y += 1;
      } else if (age < 35) {
        $scope.statistics[1].y += 1;
      } else if (age < 50) {
        $scope.statistics[2].y += 1;
      } else {
        $scope.statistics[3].y += 1;
      }
      ageWiseSigninPieChart.render();
    }
  });
});