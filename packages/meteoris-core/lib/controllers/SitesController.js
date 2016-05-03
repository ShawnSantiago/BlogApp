SitesController = MeteorisController.extend({
	subscriptions: function() {
        var sort = MeteorisGridView.getSorting();
        sort.limit = this.limit();

        this.subscription = this.subs.subscribe('posts', this.getCriteria(), sort);
    },
    /* @override getCriteria */
    getCriteria: function() {
        var search = this.params.query.q ? this.params.query.q : "";
        return {
            $or: [
                {title: {$regex: search, $options: 'i'}},
                {content: {$regex: search, $options: 'i'}},
            ]
        };
    },
    index: function() {
        var sort = MeteorisGridView.getSorting();
        sort.limit = this.limit();
        var models = Posts.find(this.getCriteria(), sort);
        console.log(models)
        return this.render('sitesIndex', {
            data: {
                ready: this.subscription.ready,
                isEmpty: models.count() === 0 ? true : false,
                models: models,
                hasMore: this.limit() == models.fetch().length ? this.route.path({limit: this.limit() + this.increment}) : null,
            }
        });
    },
    view: function() {
        return this.render('sitesIndex', {
            data: {
                model: this._loadModel(this.getId()),
            }
        });
    },
    _loadModel: function(_id) {
        return Posts.findOne(_id);
    },
});