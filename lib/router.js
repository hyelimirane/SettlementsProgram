/**
 * Created by hyelim on 2016. 3. 25..
 */
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
});

var requireLogin = function() {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
};

var settlementsListController = RouteController.extend({
    template: 'settlementsList',
    increment: 5,
    settlementsLimit: function(){
        return parseInt(this.params.settlementsLimit) || this.increment;
    },
    findOptions: function(){
        return {sort: {submitted: -1}, limit:this.settlementsLimit()}
    },
    waitOn: function(){
        return [Meteor.subscribe('settlements', this.findOptions()), Meteor.subscribe('receipt')];
    },
    settlements: function(){
        return Settlements.find({}, this.findOptions());
    },
    data: function(){
        var hasMore = this.settlements().count() === this.settlementsLimit();
        var nextPath = this.route.path({settlementsLimit: this.settlementsLimit() + this.increment});
        return {
            settlements: this.settlements(),
            nextPath : hasMore ? nextPath : null
        };
    }
});

var settlementSubmitController = RouteController.extend({
    template: 'settlementSubmit',
    waitOn: function(){
        return Meteor.subscribe('purchasersList')
    },
    purchasersList: function(){
        return Purchasers.find();
    },
    data: function(){
        return {
            purchasersList: this.purchasersList()
        }
    }
});

var settlementEditController = RouteController.extend({
    template: 'settlementEdit',
    increment: 5,
    settlementsLimit: function(){
        return parseInt(this.params.settlementsLimit) || this.increment;
    },
    findOptions: function(){
        return {sort: {submitted: -1}, limit:this.settlementsLimit()}
    },
    waitOn: function(){
        return [Meteor.subscribe('settlements', this.findOptions()), Meteor.subscribe('receipt')];
    },

    data: function() {
        return {
            _id : this.params._id,
            settlementSelected : Settlements.find({_id: this.params._id}).fetch()
        };
    }
});

var settlementDoItController = RouteController.extend({
    template: 'settlementDoIt',
});

var imagesController = RouteController.extend({
    template: 'imageView',
    waitOn: function(){
        return Meteor.subscribe('receipt')
    }
});

Router.map(function() {

    this.route('settlementSubmit', {
        path: '/settlementSubmit',
        controller: settlementSubmitController
    }),

    this.route('settlementEdit', {
        path: '/settlementEdit/:_id',
        controller: settlementEditController
    }),
    this.route('settlementDoIt', {
        path: '/settlementDoIt',
        controller: settlementDoItController
    }),

    this.route('settlementsList',{
        path: '/:settlementsLimit?',
        controller: settlementsListController
    }),

    this.route('images', {
        path: 'images',
        controller: imagesController
    })
});

Router.onBeforeAction(requireLogin, {only: 'settlementSubmit'});
Router.onBeforeAction(requireLogin, {only: 'settlementsDoIt'});
Router.onBeforeAction(requireLogin, {only: 'settlementEdit'});
