'use strict';

var app = angular.module('myapp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: './splash.html'
    })
    .state('add', {
      url: '/add',
      templateUrl: './addStock.html',
      controller: 'addCtrl'
    })
    .state('portfolio', {
      url: '/portfolio',
      templateUrl: './portfolio.html',
      controller: 'tablectrl'
    })
  $urlRouterProvider.otherwise('/');
});

app.controller('addCtrl', function($scope,Stock) {
  $scope.stocks = [];
  $scope.getastock = function(input) {
    console.log(input);
    Stock.getStock(input)
      .then(function(results) {
        console.log('allResults:', results);
        $scope.stocks = results.data;
      });
  }

  $scope.add = function(stock) {
    Stock.getQuote(stock.Symbol);
    $scope.stocks = [];
  }
});

app.service('Stock', function($http) {
  this.portfolio = [];
  this.getStock = function(input) {
    return $http.jsonp(`http://dev.markitondemand.com/MODApis/Api/v2/lookup/jsonp?input=${input}&jsoncallback=JSON_CALLBACK`);
  };
  this.getQuote = function(input) {
    $http.jsonp(`http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=${input}&jsoncallback=JSON_CALLBACK`)
    .then(result => {
      console.log('allResults:', result);
      // stock.last = result.data.LastPrice;
      this.portfolio.push(result.data);
    });
  };
});

app.controller('tablectrl', function($scope, Stock) {
  $scope.stocks = Stock.portfolio;
  $scope.remove = function(stock){
    Stock.portfolio.splice(Stock.portfolio.indexOf(stock),1);
    $scope.stocks = Stock.portfolio;
  }
});
