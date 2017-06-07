var React = require('react');
var Main = require('../Main');
var helpers = require('../utils/helpers.js')
var Search = require("./Search.js");

var SavedArticles = React.createClass({
    getInitialState: function() {
        return {
            savedArticles: []
        }
    },
    componentDidMount: function() {
        console.log("COMPONENT MOUNTED -SavedArticle");

        helpers.getSavedArticles()
        .then(function(response) {

            for(var i=0; i < response.data.length; i++) {
                this.setState({
                    savedArticles: this.state.savedArticles.concat(response.data[i])
                });
            }
            console.log("yowza: " + this.props.mainArticles[1]);
        }.bind(this));
    },
    componentDidUpdate: function(prevState) {
         if (prevState.articles !== this.state.articles) {
            console.log("COMPONENT UPDATED");
         }
    },
    //handle delete button function 
    handleDelete: function(UID) {
    
        helpers.deleteArticle(UID)
        .then(function() {
            console.log('Deleted article from MongoDB');

            //clear current state
            this.setState({
                savedArticles: []
            });

            //update parent state
            this.props.showSavedArticles();

            //update current state
            helpers.getSavedArticles()
            .then(function(response) {
                for(var i=0; i < response.data.length; i++) {
                    this.setState({
                        savedArticles: this.state.savedArticles.concat(response.data[i])
                    });
                }
            }.bind(this));

        }.bind(this));
    },
    //populate saved articles to the component div by mapping through the state
    populateSavedArticles: function() {
        return (
            <div>
                {this.state.savedArticles.map(function(article) {
                    return (
                        <div className="savedArticle" key={article._id} data-id={article._id}>
                            <h3>{article.title}</h3>
                            <button className="btn btn-primary float-right" 
                            onClick={() => this.handleDelete(article._id)} id={article._id}>Delete</button>
                        </div>
                    );
                },this)}
            </div>
        );
    },
    render: function() {
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    Saved Articles
                </div>
                <div className="panel-body" id="savedArticles">
                    {this.populateSavedArticles()}
                </div>
            </div>
        );
    }
});

module.exports = SavedArticles;