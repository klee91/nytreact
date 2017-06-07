var React = require('react');
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
var Search = require("./Components/Search.js");
var SavedArticles = require("./Components/SavedArticles.js");
var helpers = require('./utils/helpers.js')

var Main = React.createClass({
    getInitialState: function() {
        return {
            savedArticles: []
        }
    },
    showSavedArticles: function() {
        this.setState({
            savedArticles: []
        });
        helpers.getSavedArticles()
        .then(function(response) {

            for(var i=0; i < response.data.length; i++) {
                this.setState({
                    savedArticles: this.state.savedArticles.concat(response.data[i])
                });
                console.log("from main: " + this.state.savedArticles[i].title);
            }
        }.bind(this));
    },
    //  On load display the articles
    componentDidMount: function() {
        this.showSavedArticles();
    },
  // Whenever our component updates, the code inside componentDidUpdate is run
    componentDidUpdate: function(prevState) {
        if (prevState.articles !== this.state.articles) {
            console.log("COMPONENT UPDATED");
         }
    },
    render: function() {
        return (
            <div>
                <div className="container-fluid header jumbotron">
                    <h1 className="text-center">New York Times Article Scrubber</h1>
                    <p className="text-center">Search for and annotate articles of interest!</p>
                </div>

                {/* Search Component*/}
                <div className="col-xs-8 col-xs-offset-2">
                    <Search articleSearch={this.articleSearch}
                            showSavedArticles={this.showSavedArticles}
                    />
                </div>

                {/* Saved Articles Component*/}
                <div className="col-xs-8 col-xs-offset-2">
                    <SavedArticles 
                        mainArticles={this.state.savedArticles}
                        showSavedArticles={this.showSavedArticles}
                    />
                </div>

            </div>
        );
    }
})

module.exports = Main;